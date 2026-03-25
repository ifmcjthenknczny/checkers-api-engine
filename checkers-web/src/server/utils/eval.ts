import * as ort from 'onnxruntime-node'
import { type Player, type BoardPosition, type Move } from '~/types'
import { findAllLegalContinuations, applyMovesToBoard } from '~/helpers/move'
import { PRUNE_CONFIG } from '~/config'
import { session } from './model'
import { type ShallowCandidate, buildSortedShallowCandidates, filterCandidatesByDelta } from './prune'

type PlayerToMove = -1 | 1

type AlphaBetaOptions = { alpha?: number; beta?: number; useAlphaBeta: boolean }

type AlphaBetaState = { bestScore: number; alpha: number; beta: number }

function toPlayerToMove(player: Player): PlayerToMove {
  return player === 'white' ? 1 : -1
}

function initAlphaBetaState(isMaximizing: boolean, bounds: AlphaBetaOptions): AlphaBetaState {
  return {
    bestScore: isMaximizing ? -Infinity : Infinity,
    alpha: bounds.alpha ?? -Infinity,
    beta: bounds.beta ?? Infinity,
  }
}

function applyAlphaBetaScore(
  state: AlphaBetaState,
  score: number,
  isMaximizing: boolean,
  useAlphaBeta: boolean,
): { state: AlphaBetaState; shouldBreak: boolean } {
  if (isMaximizing) {
    const bestScore = Math.max(state.bestScore, score)
    const alpha = useAlphaBeta ? Math.max(state.alpha, bestScore) : state.alpha
    const nextState = { bestScore, alpha, beta: state.beta }
    return { state: nextState, shouldBreak: useAlphaBeta && alpha >= nextState.beta }
  }

  const bestScore = Math.min(state.bestScore, score)
  const beta = useAlphaBeta ? Math.min(state.beta, bestScore) : state.beta
  const nextState = { bestScore, alpha: state.alpha, beta }
  return { state: nextState, shouldBreak: useAlphaBeta && nextState.alpha >= beta }
}

async function buildPrunedCandidatesIfWorthIt(
  board: BoardPosition,
  continuations: Move[][],
  opponent: Player,
  useAlphaBeta: boolean,
): Promise<ShallowCandidate[] | null> {
  const isMaximizing = opponent === 'black'
  const shouldPruneByDelta = useAlphaBeta && continuations.length >= PRUNE_CONFIG.maxBestContinuations
  if (!shouldPruneByDelta) {
    return null
  }

  const candidates = await buildSortedShallowCandidates(board, continuations, opponent)
  return filterCandidatesByDelta(candidates, isMaximizing, PRUNE_CONFIG.delta).slice(0, PRUNE_CONFIG.maxBestContinuations)
}

async function buildCandidatesForRootSearch(
  board: BoardPosition,
  continuations: Move[][],
  opponent: Player,
  useAlphaBeta: boolean,
): Promise<ShallowCandidate[]> {
  const isMaximizing = opponent === 'black'
  const candidates = await buildSortedShallowCandidates(board, continuations, opponent)
  if (!useAlphaBeta || continuations.length < PRUNE_CONFIG.maxBestContinuations) {
    return candidates.slice(0, PRUNE_CONFIG.maxBestContinuations)
  }

  return filterCandidatesByDelta(candidates, isMaximizing, PRUNE_CONFIG.delta).slice(0, PRUNE_CONFIG.maxBestContinuations)
}

export async function evaluateBoardShallow(board: BoardPosition, move: Player): Promise<number> {
  try {
    if (!session) {
      throw new Error('ONNX Session not initialized')
    }
    const combinedData = new Float32Array(33)
    combinedData.set(board)
    combinedData[32] = toPlayerToMove(move)
    const tensor = new ort.Tensor('float32', combinedData, [1, 33])
    const feeds = { [session.inputNames[0]]: tensor }
    const results = await session.run(feeds)
    return (results[session.outputNames[0]] as ort.Tensor).data[0] as number
  } catch (error) {
    console.error('Evaluation failed:', error)
    throw error
  }
}

// TODO: shouldPruneByDelta should be in main function; also maybe I should not provide opponent but currentPlayer everywhere? extract useAlphaBeta and create two different functions running depending on this param 
export async function evaluateBoardDeeply(
  board: BoardPosition,
  currentPlayer: Player,
  depth: number,
  bounds: AlphaBetaOptions = { useAlphaBeta: true },
): Promise<number> {
  if (depth === 0) {
      return evaluateBoardShallow(board, currentPlayer)
  }

  const continuations = findAllLegalContinuations(board, currentPlayer)
  if (continuations.length === 0) {
    return currentPlayer === 'white' ? -1 : 1
  }

  const opponent: Player = currentPlayer === 'white' ? 'black' : 'white'
  const isMaximizing = currentPlayer === 'white'
  let state = initAlphaBetaState(isMaximizing, bounds)

  if (depth === 1) {
    const candidates = await buildCandidatesForRootSearch(board, continuations, opponent, bounds.useAlphaBeta)
    for (const candidate of candidates) {
      const {state: newState, shouldBreak} = applyAlphaBetaScore(state, candidate.shallowScore, isMaximizing, bounds.useAlphaBeta)
      state = newState
      if (shouldBreak) {
        break
      }
    }
    return state.bestScore
  }

  const candidates = await buildPrunedCandidatesIfWorthIt(board, continuations, opponent, bounds.useAlphaBeta)
  if (candidates) {
    for (const candidate of candidates) {
      const score = await evaluateBoardDeeply(candidate.resultBoard, opponent, depth - 1, bounds)
      const {state: nextState, shouldBreak} = applyAlphaBetaScore(state, score, isMaximizing, bounds.useAlphaBeta)
      state = nextState
      if (shouldBreak) {
        break
      }
    }
  } else {
    for (const moves of continuations) {
      const resultBoard = applyMovesToBoard(board, moves)
      const score = await evaluateBoardDeeply(resultBoard, opponent, depth - 1, bounds)
      const {state: nextState, shouldBreak} = applyAlphaBetaScore(state, score, isMaximizing, bounds.useAlphaBeta)
      state = nextState
      if (shouldBreak) {
        break
      }
    }
  }

  return state.bestScore
}

export async function pickBestContinuationWithDepth(
  board: BoardPosition,
  player: Player,
  depth: number,
  bounds: AlphaBetaOptions
): Promise<{moves: Move[], score: number}> {
  const continuations = findAllLegalContinuations(board, player)
  if (continuations.length === 0) {
    return { moves: [], score: player === 'white' ? -1 : 1 }
  }

  const opponent: Player = player === 'white' ? 'black' : 'white'
  const isMaximizing = player === 'white'

  const shouldPruneByDelta = bounds.useAlphaBeta && continuations.length >= PRUNE_CONFIG.maxBestContinuations

  let candidates = await buildSortedShallowCandidates(board, continuations, opponent)

  if (shouldPruneByDelta) {
    candidates = filterCandidatesByDelta(candidates, isMaximizing, PRUNE_CONFIG.delta)
  }
  candidates = candidates.slice(0, PRUNE_CONFIG.maxBestContinuations)

  const bestCandidate = candidates[0]
  if (depth <= 1) {
    return { moves: bestCandidate.moves, score: bestCandidate.shallowScore }
  }

  let bestMoves: Move[] = bestCandidate.moves
  let { alpha, beta, bestScore } = initAlphaBetaState(isMaximizing, bounds)

  for (const candidate of candidates) {
    const score = await evaluateBoardDeeply(candidate.resultBoard, opponent, depth - 1, bounds)

    if (isMaximizing) {
      if (score > bestScore) {
        bestScore = score
        bestMoves = candidate.moves
      }
      if (bounds.useAlphaBeta) {
        alpha = Math.max(alpha, bestScore)
        if (alpha >= beta) {
          break
        }
      }
    } else {
      if (score < bestScore) {
        bestScore = score
        bestMoves = candidate.moves
      }
      if (bounds.useAlphaBeta) {
        beta = Math.min(beta, bestScore)
        if (alpha >= beta) {
          break
        }
      }
    }
  }

  return { moves: bestMoves, score: bestScore }
}
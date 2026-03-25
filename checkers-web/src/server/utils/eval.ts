import * as ort from 'onnxruntime-node'
import { type Player, type BoardPosition, type Move } from '~/types'
import { findAllLegalContinuations, applyMovesToBoard } from '~/helpers/move'
import { PRUNE_CONFIG } from '~/config'
import { session } from './model'
import { type ShallowCandidate, buildSortedShallowCandidates, filterCandidatesByDelta } from './prune'
import { otherPlayer } from '~/helpers/turn'

type PlayerToMove = -1 | 1

type AlphaBetaOptions = { alpha?: number; beta?: number; useAlphaBeta: boolean }

type AlphaBetaState = { bestScore: number; alpha: number; beta: number }

function toPlayerToMove(player: Player): PlayerToMove {
  return player === 'white' ? 1 : -1
}

function shouldPruneByDelta(useAlphaBeta: boolean, continuationsCount: number): boolean {
  return useAlphaBeta && continuationsCount >= PRUNE_CONFIG.maxBestContinuations
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
  evaluationPlayer: Player,
  isMaximizing: boolean,
): Promise<ShallowCandidate[] | null> {

  const candidates = await buildSortedShallowCandidates(board, continuations, evaluationPlayer)
  return filterCandidatesByDelta(candidates, isMaximizing, PRUNE_CONFIG.delta).slice(0, PRUNE_CONFIG.maxBestContinuations)
}

async function buildCandidatesForRootSearch(
  board: BoardPosition,
  continuations: Move[][],
  evaluationPlayer: Player,
  isMaximizing: boolean,
  shouldPrune: boolean,
): Promise<ShallowCandidate[]> {
  const candidates = await buildSortedShallowCandidates(board, continuations, evaluationPlayer)
  const limited = candidates.slice(0, PRUNE_CONFIG.maxBestContinuations)
  return shouldPrune ? filterCandidatesByDelta(limited, isMaximizing, PRUNE_CONFIG.delta) : limited
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

export async function evaluateBoardDeeply(
  board: BoardPosition,
  currentPlayer: Player,
  depth: number,
  bounds: AlphaBetaOptions = { useAlphaBeta: true },
): Promise<number> {
  if (bounds.useAlphaBeta) {
    return evaluateBoardDeeplyWithAlphaBeta(board, currentPlayer, depth, bounds)
  }
  return evaluateBoardDeeplyWithoutAlphaBeta(board, currentPlayer, depth)
}

async function evaluateBoardDeeplyWithAlphaBeta(
  board: BoardPosition,
  currentPlayer: Player,
  depth: number,
  bounds: AlphaBetaOptions,
): Promise<number> {
  if (depth === 0) {
      return evaluateBoardShallow(board, currentPlayer)
  }

  const continuations = findAllLegalContinuations(board, currentPlayer)
  if (continuations.length === 0) {
    return currentPlayer === 'white' ? -1 : 1
  }

  const opponent = otherPlayer(currentPlayer)
  const isMaximizing = currentPlayer === 'white'
  const shouldPrune = shouldPruneByDelta(bounds.useAlphaBeta, continuations.length)
  let state = initAlphaBetaState(isMaximizing, bounds)

  if (depth === 1) {
    const candidates = await buildCandidatesForRootSearch(board, continuations, opponent, isMaximizing, shouldPrune)
    for (const candidate of candidates) {
      const {state: newState, shouldBreak} = applyAlphaBetaScore(state, candidate.shallowScore, isMaximizing, bounds.useAlphaBeta)
      state = newState
      if (shouldBreak) {
        break
      }
    }
    return state.bestScore
  }

  const candidates = shouldPrune ? await buildPrunedCandidatesIfWorthIt(board, continuations, opponent, isMaximizing) : null
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

async function evaluateBoardDeeplyWithoutAlphaBeta(
  board: BoardPosition,
  currentPlayer: Player,
  depth: number,
): Promise<number> {
  if (depth === 0) {
    return evaluateBoardShallow(board, currentPlayer)
  }

  const continuations = findAllLegalContinuations(board, currentPlayer)
  if (continuations.length === 0) {
    return currentPlayer === 'white' ? -1 : 1
  }

  const opponent = otherPlayer(currentPlayer)
  const isMaximizing = currentPlayer === 'white'

  // Keeping behavior: at depth===1 we still limit to maxBestContinuations (even without alpha-beta)
  if (depth === 1) {
    const candidates = await buildCandidatesForRootSearch(board, continuations, opponent, isMaximizing, false)
    let bestScore = isMaximizing ? -Infinity : Infinity
    for (const c of candidates) {
      bestScore = isMaximizing ? Math.max(bestScore, c.shallowScore) : Math.min(bestScore, c.shallowScore)
    }
    return bestScore
  }

  let bestScore = isMaximizing ? -Infinity : Infinity
  for (const moves of continuations) {
    const resultBoard = applyMovesToBoard(board, moves)
    const score = await evaluateBoardDeeply(resultBoard, opponent, depth - 1, { useAlphaBeta: false })
    bestScore = isMaximizing ? Math.max(bestScore, score) : Math.min(bestScore, score)
  }
  return bestScore
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

  const opponent = otherPlayer(player)
  const isMaximizing = player === 'white'

  let candidates = await buildSortedShallowCandidates(board, continuations, opponent)

  const shouldPrune = shouldPruneByDelta(bounds.useAlphaBeta, continuations.length)

  if (shouldPrune) {
    candidates = filterCandidatesByDelta(candidates, isMaximizing, PRUNE_CONFIG.delta).slice(0, PRUNE_CONFIG.maxBestContinuations)
  }

  const bestCandidate = candidates[0]
  if (depth <= 1) {
    return { moves: bestCandidate.moves, score: bestCandidate.shallowScore }
  }

  let bestMoves: Move[] = bestCandidate.moves

  if (!bounds.useAlphaBeta) {
    let bestScore = isMaximizing ? -Infinity : Infinity
    for (const candidate of candidates) {
      const score = await evaluateBoardDeeply(candidate.resultBoard, opponent, depth - 1, { useAlphaBeta: false })
      if (isMaximizing ? score > bestScore : score < bestScore) {
        bestScore = score
        bestMoves = candidate.moves
      }
    }
    return { moves: bestMoves, score: bestScore }
  }

  let state = initAlphaBetaState(isMaximizing, bounds)
  for (const candidate of candidates) {
    const score = await evaluateBoardDeeply(candidate.resultBoard, opponent, depth - 1, {
      ...bounds,
      alpha: state.alpha,
      beta: state.beta,
    })

    if (isMaximizing ? score > state.bestScore : score < state.bestScore) {
      bestMoves = candidate.moves
    }

    const { state: nextState, shouldBreak } = applyAlphaBetaScore(state, score, isMaximizing, true)
    state = nextState
    if (shouldBreak) {
      break
    }
  }

  return { moves: bestMoves, score: state.bestScore }
}
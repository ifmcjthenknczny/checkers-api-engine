import type { BoardPosition, Move, Player } from '../types'
import { evaluateBoard } from './engine'
import { applyMove, findAllLegalContinuations, findAllLegalMoves } from './move'

export function pickARandomMove(
  player: Player,
  board: BoardPosition,
): Move | null {
  const legalMoves = findAllLegalMoves(board, player)
  if (legalMoves.length === 0) {
    return null
  }
  return legalMoves[Math.floor(Math.random() * legalMoves.length)]!
}

export async function pickBestEngineContinuation(
  board: BoardPosition,
  player: Player,
  engineBaseUrl?: string,
): Promise<Move[]> {
  const continuations = findAllLegalContinuations(board, player)

  const resultingBoards = continuations.map((continuationMoves) =>
    continuationMoves.reduce(
      (currentBoard, move) => applyMove(currentBoard, move),
      [...board] as BoardPosition,
    ),
  )

  const evaluations = await Promise.all(
    resultingBoards.map((b) => evaluateBoard(b, player, engineBaseUrl)),
  )
  const isMaximizing = player === 'white'
  const bestIndex = evaluations.reduce(
    (bestIndex, evaluation, index) =>
      isMaximizing
        ? (evaluation > evaluations[bestIndex]! ? index : bestIndex)
        : (evaluation < evaluations[bestIndex]! ? index : bestIndex),
    0,
  )
  console.log({evaluation: evaluations[bestIndex]})
  console.log({evaluations})
  return continuations[bestIndex] ?? []
}
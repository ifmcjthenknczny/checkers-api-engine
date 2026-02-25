import { BoardPosition } from "@/types"
import { findAllLegalMoves } from "./move"

// TODO: to one function

export function determineWinner(
    board: BoardPosition,
    isWhiteToMove: boolean,
  ): boolean | null {
    const whiteHasPieces = board.some((p) => p > 0)
    const blackHasPieces = board.some((p) => p < 0)
    const whiteCanMove = Object.keys(findAllLegalMoves(board, true)).length > 0
    const blackCanMove = Object.keys(findAllLegalMoves(board, false)).length > 0
  
    if (!blackHasPieces || (blackHasPieces && !blackCanMove && !isWhiteToMove))
      return true
    if (!whiteHasPieces || (whiteHasPieces && !whiteCanMove && isWhiteToMove))
      return false
    return null
  }
  
  export function isGameOver(
    board: BoardPosition,
    isWhiteToMove: boolean,
    queenMovesWithoutCaptureCount: number,
  ): boolean {
    const QUEEN_MOVES_WITHOUT_CAPTURE_COUNT_DRAW_THRESHOLD = 30
    const playerOnMoveHasPieces = board.some((p) =>
      isWhiteToMove ? p > 0 : p < 0,
    )
    if (!playerOnMoveHasPieces) {
      return true
    }
    const playerOnMoveHasLegalMoves = Object.keys(findAllLegalMoves(board, isWhiteToMove)).length > 0
    if (!playerOnMoveHasLegalMoves) {
      return true
    }
    return queenMovesWithoutCaptureCount >= QUEEN_MOVES_WITHOUT_CAPTURE_COUNT_DRAW_THRESHOLD
  }
  
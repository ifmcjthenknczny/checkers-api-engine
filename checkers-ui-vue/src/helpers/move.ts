import type {
  BoardPosition,
  Direction,
  Move,
  PieceColor,
  Player,
} from '../types'
import {
  indexToRowCol,
  isQueen as isQueenPiece,
  rowColToIndex,
  getPieceColor,
  isSameColor,
  isInBounds,
  isPlayableSquare,
  getPiecesOfColor,
} from './board'
import { shouldPotentiallyPromotePiece } from './promotion'

const DIAGONAL_DIRECTIONS: [Direction, Direction][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

function buildCaptureDirections(
  forbiddenDirection: readonly [Direction | null, Direction | null],
): [Direction, Direction][] {
  const [forbiddenDCol, forbiddenDRow] = forbiddenDirection
  if (forbiddenDCol === null && forbiddenDRow === null) { 
    return DIAGONAL_DIRECTIONS
  }
  return DIAGONAL_DIRECTIONS.filter(
    ([dCol, dRow]) => dCol !== forbiddenDCol || dRow !== forbiddenDRow,
  )
}

function reverseDirection(direction: Direction): Direction {
  return direction === 1 ? -1 : 1
}

export function findLegalCapturesOfPiece(
  board: BoardPosition,
  fromIndex: number,
  forbiddenDirection: readonly [Direction | null, Direction | null] = [null, null],
): Move[] {
  const piece = board[fromIndex];
  if (!piece) {
    return [];
  }

  const isQueen = isQueenPiece(piece);
  const { row: startRow, col: startCol } = indexToRowCol(fromIndex);
  const moves: Move[] = [];

  for (const [dCol, dRow] of buildCaptureDirections(forbiddenDirection)) {
    let row = startRow + dRow;
    let col = startCol + dCol;

    while (isInBounds(row, col) && board[rowColToIndex(row, col)] === 0 && isQueen) {
      row += dRow;
      col += dCol;
    }

    if (!isInBounds(row, col)) {
      continue;
    }

    const targetIdx = rowColToIndex(row, col);
    const targetPiece = board[targetIdx];

    if (!targetPiece || isSameColor(targetPiece, piece)) {
      continue
    }

    row += dRow;
    col += dCol;

    while (isInBounds(row, col) && board[rowColToIndex(row, col)] === 0) {
      const landingIdx = rowColToIndex(row, col);
      
      moves.push({
        fromIndex,
        toIndex: landingIdx,
        isCapture: true,
        captureIndex: targetIdx,
        isPromotion: shouldPotentiallyPromotePiece(board, fromIndex, landingIdx),
        followingChainedCaptureForbiddenDirection: [reverseDirection(dCol), reverseDirection(dRow)],
      });

      if (!isQueen) {
        break;
      }

      row += dRow;
      col += dCol;
    }
  }

  return moves;
}

function buildNormalMoveDirections(
  isQueen: boolean,
  pieceColor: PieceColor,
): [Direction, Direction][] {
  if (isQueen) {
    return DIAGONAL_DIRECTIONS
  }
  const dRow: Direction = pieceColor === 'white' ? -1 : 1
  return [
    [1, dRow],
    [-1, dRow],
  ]
}

export function findLegalNormalMovesOfPiece(
  board: BoardPosition,
  pieceIndex: number,
): Move[] {
  const piece = board[pieceIndex]
  if (!piece) {
    return []
  }

  const isQueen = isQueenPiece(piece)
  const pieceColor = getPieceColor(piece)!
  const { row: startRow, col: startCol } = indexToRowCol(pieceIndex)
  const directions = buildNormalMoveDirections(isQueen, pieceColor)
  const moves: Move[] = []

  for (const [dCol, dRow] of directions) {
    let row = startRow + dRow
    let col = startCol + dCol

    while (isInBounds(row, col) && isPlayableSquare(row, col)) {
      const toIndex = rowColToIndex(row, col)
      if (board[toIndex] !== 0) {
        break
      }
      moves.push({
        fromIndex: pieceIndex,
        toIndex,
        isCapture: false,
        isPromotion: shouldPotentiallyPromotePiece(board, pieceIndex, toIndex),
      })
      if (!isQueen) {
        break
      }
      row += dRow
      col += dCol
    }
  }
  return moves
}

export function findLegalMovesOfPiece(
  board: BoardPosition,
  pieceIndex: number,
  isCapturePossible: boolean,
): Move[] {
  return isCapturePossible
    ? findLegalCapturesOfPiece(board, pieceIndex)
    : findLegalNormalMovesOfPiece(board, pieceIndex)
}

export function playerHasCapturePossibility(
  board: BoardPosition,
  playerColor: Player,
): boolean {
  const pieces = getPiecesOfColor(board, playerColor)

  return pieces.some(
    (piece) => findLegalCapturesOfPiece(board, piece.index).length > 0,
  )
}

export function findAllLegalMoves(
  board: BoardPosition,
  piecesColor: PieceColor,
): Move[] {
  const isCapturePossible = playerHasCapturePossibility(board, piecesColor)
  const pieces = getPiecesOfColor(board, piecesColor)
  const moves: Move[] = []
  for (const piece of pieces) {
    moves.push(
      ...findLegalMovesOfPiece(board, piece.index, isCapturePossible),
    )
  }
  return moves
}

export function applyMove(
  board: BoardPosition,
  fromIndex: number,
  toIndex: number,
  captureIndex?: number,
): BoardPosition {
  const next = [...board] as BoardPosition
  const piece = board[fromIndex]
  next[fromIndex] = 0
  next[toIndex] = piece!
  if (captureIndex !== undefined) next[captureIndex] = 0
  return next
}

export const isChainedCapturePossible = (boardAfterMove: BoardPosition, move: Move) => {
  return move.isCapture && findLegalCapturesOfPiece(boardAfterMove, move.toIndex, move.followingChainedCaptureForbiddenDirection).length > 0
}
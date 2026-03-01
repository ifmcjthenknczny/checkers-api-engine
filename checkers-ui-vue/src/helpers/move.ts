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
import { shouldPromotePiece } from './promotion'

const DIAGONAL_DIRECTIONS: [Direction, Direction][] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

function getCaptureDirections(
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

  for (const [dCol, dRow] of getCaptureDirections(forbiddenDirection)) {
    let r = startRow + dRow;
    let c = startCol + dCol;

    while (isInBounds(r, c) && board[rowColToIndex(r, c)] === 0 && isQueen) {
      r += dRow;
      c += dCol;
    }

    if (!isInBounds(r, c)) {
      continue;
    }

    const targetIdx = rowColToIndex(r, c);
    const targetPiece = board[targetIdx];

    if (!targetPiece || isSameColor(targetPiece, piece)) {
      continue
    }

    r += dRow;
    c += dCol;

    while (isInBounds(r, c) && board[rowColToIndex(r, c)] === 0) {
      const landingIdx = rowColToIndex(r, c);
      
      moves.push({
        fromIndex,
        toIndex: landingIdx,
        isCapture: true,
        captureIndex: targetIdx,
        isPromotion: shouldPromotePiece(board, fromIndex, landingIdx),
        followingChainedCaptureForbiddenDirection: [reverseDirection(dCol), reverseDirection(dRow)],
      });

      if (!isQueen) {
        break;
      }

      r += dRow;
      c += dCol;
    }
  }

  return moves;
}

function getNormalMoveDirections(
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
  const directions = getNormalMoveDirections(isQueen, pieceColor)
  const moves: Move[] = []

  for (const [dCol, dRow] of directions) {
    let r = startRow + dRow
    let c = startCol + dCol

    while (isInBounds(r, c) && isPlayableSquare(r, c)) {
      const idx = rowColToIndex(r, c)
      if (board[idx] !== 0) {
        break
      }
      moves.push({
        fromIndex: pieceIndex,
        toIndex: idx,
        isCapture: false,
        isPromotion: shouldPromotePiece(board, pieceIndex, idx),
      })
      if (!isQueen) {
        break
      }
      r += dRow
      c += dCol
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



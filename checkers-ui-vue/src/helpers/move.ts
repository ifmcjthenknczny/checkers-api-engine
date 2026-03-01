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
  forbiddenDirection: readonly [Direction | null, Direction | null] = [
    null,
    null,
  ],
): Move[] {
  const piece = board[fromIndex]
  if (!piece) {
    return []
  }

  const isQueen = isQueenPiece(piece)
  const { row: startRow, col: startCol } = indexToRowCol(fromIndex)
  const directions = getCaptureDirections( forbiddenDirection)
  const moves: Move[] = []

  for (const [dCol, dRow] of directions) {
    let r = startRow + dRow
    let c = startCol + dCol
    let captureIndex: number | null = null

    if (isQueen) {
      while (isInBounds(r, c) && isPlayableSquare(r, c)) {
        const idx = rowColToIndex(r, c)
        const content = board[idx]
        if (content === 0) {
          r += dRow
          c += dCol
          continue
        }
        if (isSameColor(content ?? 0, piece)) break
        captureIndex = idx
        r += dRow
        c += dCol
        while (isInBounds(r, c) && isPlayableSquare(r, c)) {
          const toIdx = rowColToIndex(r, c)
          if (board[toIdx] !== 0) break
          moves.push({
            fromIndex,
            toIndex: toIdx,
            isCapture: true,
            captureIndex,
            isPromotion: shouldPromotePiece(board, fromIndex, toIdx),
            followingChainedCaptureForbiddenDirection: [reverseDirection(dCol), reverseDirection(dRow)],
          })
          r += dRow
          c += dCol
        }
        break
      }
    } else {
      if (!isInBounds(r, c) || !isPlayableSquare(r, c)) {
        continue
      }
      const enemyIdx = rowColToIndex(r, c)
      const content = board[enemyIdx]
      if (content === 0 || isSameColor(content ?? 0, piece)) {
        continue
      }
      captureIndex = enemyIdx
      r += dRow
      c += dCol
      if (board[rowColToIndex(r, c)] === 0) {
        const toIndex = rowColToIndex(r, c)
        moves.push({
          fromIndex,
          toIndex,
          isCapture: true,
          captureIndex,
          isPromotion: shouldPromotePiece(board, fromIndex, toIndex),
          followingChainedCaptureForbiddenDirection: [reverseDirection(dCol), reverseDirection(dRow)],
        })
      }
    }
  }
  return moves
}

function getNormalMoveDirections(
  isQueen: boolean,
  isWhitePiece: boolean,
): [Direction, Direction][] {
  if (isQueen) return DIAGONAL_DIRECTIONS
  const dRow: Direction = isWhitePiece ? -1 : 1
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
  if (!piece) return []

  const isQueen = isQueenPiece(piece)
  const isWhitePiece = getPieceColor(piece) === 'white'
  const { row: startRow, col: startCol } = indexToRowCol(pieceIndex)
  const directions = getNormalMoveDirections(isQueen, isWhitePiece)
  const moves: Move[] = []

  for (const [dCol, dRow] of directions) {
    let r = startRow + dRow
    let c = startCol + dCol

    if (isQueen) {
      while (isInBounds(r, c) && isPlayableSquare(r, c)) {
        const idx = rowColToIndex(r, c)
        if (board[idx] !== 0) {
          r += dRow
          c += dCol
          continue
        }
        moves.push({
          fromIndex: pieceIndex,
          toIndex: idx,
          isCapture: false,
          isPromotion: shouldPromotePiece(board, pieceIndex, idx),
        })
        r += dRow
        c += dCol
      }
    } else {
      if (isInBounds(r, c) && isPlayableSquare(r, c) && board[rowColToIndex(r, c)] === 0) {
        const toIndex = rowColToIndex(r, c)
        moves.push({
          fromIndex: pieceIndex,
          toIndex,
          isCapture: false,
          isPromotion: shouldPromotePiece(board, pieceIndex, toIndex),
        })
      }
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

export function findQueenChainedCaptureForbiddenDirection(
  fromIndex: number,
  toIndex: number,
): [Direction, Direction] {
  const { row: sr, col: sc } = indexToRowCol(fromIndex)
  const { row: tr, col: tc } = indexToRowCol(toIndex)
  const dCol: Direction = tc < sc ? -1 : 1
  const dRow: Direction = tr < sr ? -1 : 1
  return [dCol, dRow]
}

export function findCapturedPieceIndex(
  board: BoardPosition,
  fromIndex: number,
  toIndex: number,
  playerToMove: Player,
): number | undefined {
  const { row: sr, col: sc } = indexToRowCol(fromIndex)
  const { row: tr, col: tc } = indexToRowCol(toIndex)
  const dRow = tr > sr ? 1 : -1
  const dCol = tc > sc ? 1 : -1
  let r = sr + dRow
  let c = sc + dCol
  const isWhite = playerToMove === 'white'
  while (r !== tr || c !== tc) {
    const idx = rowColToIndex(r, c)
    const content = board[idx]
    if (content !== 0 && ((isWhite && (content ?? 0) < 0) || (!isWhite && (content ?? 0) > 0)))
      return idx
    r += dRow
    c += dCol
  }
  return undefined
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



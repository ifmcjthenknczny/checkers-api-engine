import type { BoardPosition } from '../types'
import {
  indexToRowCol,
  isQueen as isQueenPiece,
  rowColToIndex,
  getPieceColor,
  diagonalDeltas,
  isSameColor,
  isInBounds,
  isPlayableSquare,
} from './board'


export function findLegalCapturesOfPiece(
  board: BoardPosition,
  fromIndex: number,
  forbiddenDirection: [boolean | null, boolean | null] = [null, null],
): number[] {
  const piece = board[fromIndex]
  if (!piece) return []
  const isQueen = isQueenPiece(piece)
  const friend = piece
  const { row: startRow, col: startCol } = indexToRowCol(fromIndex)
  const targets: number[] = []

  for (const rowsInc of [true, false]) {
    for (const colsInc of [true, false]) {
      if (
        isQueen &&
        forbiddenDirection[0] === colsInc &&
        forbiddenDirection[1] === rowsInc
      )
        continue
      const [dCol, dRow] = diagonalDeltas(colsInc, rowsInc)
      let r = startRow + dRow
      let c = startCol + dCol
      let foundEnemy = false

      while (isInBounds(r, c) && isPlayableSquare(r, c)) {
        const idx = rowColToIndex(r, c)
        const content = board[idx]
        if (content !== 0) {
          if (foundEnemy) break
          if (isSameColor(content, friend)) break
          foundEnemy = true
        } else if (foundEnemy) {
          targets.push(idx)
        }
        r += dRow
        c += dCol
        if (!isQueen && Math.abs(r - startRow) > 2) break
      }
    }
  }
  return targets
}

export function findLegalNormalMovesOfPiece(
  board: BoardPosition,
  fromIndex: number,
): number[] {
  const piece = board[fromIndex]
  if (!piece) return []
  const isQueen = isQueenPiece(piece)
  const isWhitePiece = getPieceColor(piece) === 'white'
  const rowDirs = isQueen ? [true, false] : isWhitePiece ? [true] : [false]
  const { row: startRow, col: startCol } = indexToRowCol(fromIndex)
  const targets: number[] = []

  for (const rowsInc of rowDirs) {
    for (const colsInc of [true, false]) {
      const [dCol, dRow] = diagonalDeltas(colsInc, rowsInc)
      let r = startRow + dRow
      let c = startCol + dCol

      while (isInBounds(r, c) && isPlayableSquare(r, c)) {
        const idx = rowColToIndex(r, c)
        if (board[idx] !== 0) break
        targets.push(idx)
        if (!isQueen) break
        r += dRow
        c += dCol
      }
    }
  }
  return targets
}

export function hasCapturePossibility(
  board: BoardPosition,
  isWhiteToMove: boolean,
): boolean {
  for (let i = 0; i < board.length; i++) {
    const p = board[i]
    if (p === 0 || (p > 0) !== isWhiteToMove) continue
    if (findLegalCapturesOfPiece(board, i).length > 0) return true
  }
  return false
}

export function findAllLegalMoves(
  board: BoardPosition,
  forWhite: boolean,
): Record<number, number[]> {
  const capturePossible = hasCapturePossibility(board, forWhite)
  const result: Record<number, number[]> = {}
  for (let fromIndex = 0; fromIndex < board.length; fromIndex++) {
    const piece = board[fromIndex]
    if (piece === 0 || (piece > 0) !== forWhite) continue
    const moves = capturePossible
      ? findLegalCapturesOfPiece(board, fromIndex)
      : findLegalNormalMovesOfPiece(board, fromIndex)
    if (moves.length > 0) result[fromIndex] = moves
  }
  return result
}

export function findQueenChainedCaptureForbiddenDirection(
  fromIndex: number,
  toIndex: number,
): [boolean, boolean] {
  const { row: sr, col: sc } = indexToRowCol(fromIndex)
  const { row: tr, col: tc } = indexToRowCol(toIndex)
  return [tc < sc, tr < sr]
}

export function findCapturedPieceIndex(
  board: BoardPosition,
  fromIndex: number,
  toIndex: number,
  isWhiteToMove: boolean,
): number | undefined {
  const { row: sr, col: sc } = indexToRowCol(fromIndex)
  const { row: tr, col: tc } = indexToRowCol(toIndex)
  const dRow = tr > sr ? 1 : -1
  const dCol = tc > sc ? 1 : -1
  let r = sr + dRow
  let c = sc + dCol
  const isWhite = isWhiteToMove
  while (r !== tr || c !== tc) {
    const idx = rowColToIndex(r, c)
    const content = board[idx]
    if (content !== 0 && ((isWhite && content < 0) || (!isWhite && content > 0)))
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
  next[toIndex] = piece
  if (captureIndex !== undefined) next[captureIndex] = 0
  return next
}



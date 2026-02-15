import { BOARD_SIZE } from './config'
import type { SquareContent } from './types'

export const isWhiteSquare = (rowIndex: number, colIndex: number) => {
  return (rowIndex + colIndex) % 2 === 0
}

export const getPieceIndex = (rowIndex: number, colIndex: number) => {
  return Math.floor((rowIndex * BOARD_SIZE + colIndex) / 2)
}

export const isQueen = (piece?: SquareContent) => {
  return piece && Math.abs(piece) === 3
}

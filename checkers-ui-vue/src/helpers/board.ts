import { BOARD_SIZE } from '../config'
import type { BoardPosition, SquareContentExtended, SquareContent, SquareCoords } from '../types'
import { range } from './utils'

export const isWhiteSquare = (rowIndex: number, colIndex: number) => {
  return (rowIndex + colIndex) % 2 === 0
}

export const getSquareIndex = (rowIndex: number, colIndex: number) => {
  if (rowIndex >= BOARD_SIZE || colIndex >= BOARD_SIZE) {
    throw new Error('Invalid square coordinates')
  }
  return Math.floor((rowIndex * BOARD_SIZE + colIndex) / 2)
}

export const isQueen = (piece?: SquareContent) => {
  return !!(piece && Math.abs(piece) === 3)
}

export function createDiagonalIterable(startIndex: number, targetIndex: number) {
  return startIndex < targetIndex
    ? range(targetIndex - startIndex, startIndex + 1)
    : range(startIndex - targetIndex, targetIndex).reverse()
}

export const findRelativeDiagonalCoords = (refCoords: SquareCoords, distance: number) => {
  const {row, col} = refCoords
  const directions: [number, number][] = [[1, 1], [-1, -1], [1, -1], [-1, 1]];
  const possibleCoordinates = directions.map(([deltaRow, deltaCol]) => {
    return {row: row + deltaRow * distance, col: col + deltaCol * distance}
  })

  return possibleCoordinates.filter(({row, col}) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE)
}

export const getSquareCoordinates = (index: number): SquareCoords => {
  if (index >= BOARD_SIZE * BOARD_SIZE) {
    throw new Error('Invalid square index')
  }
  const row = Math.floor(index / (BOARD_SIZE / 2))
  const col = (index % (BOARD_SIZE / 2)) * 2 + row % 2 === 0 ? 1 : 0;

  return {row, col}
}

const toExtendedSquareContent = (squareContent: SquareContent, index: number): SquareContentExtended => {
  const squareCoords = getSquareCoordinates(index)
  return squareContent === 0 ? { isEmpty: true, ...squareCoords } : {
    ...squareCoords,
    isEmpty: false,
    color: squareContent > 0 ? 'white' : 'black',
    isQueen: isQueen(squareContent),
  }
}

export function toBoardObject(board: BoardPosition): SquareContentExtended[] {
  return board.map(toExtendedSquareContent)
}
type Tuple<T, N extends number, R extends T[] = []> = R['length'] extends N
  ? R
  : Tuple<T, N, [T, ...R]>

export type SquareContent = -3 | -1 | 0 | 1 | 3

export type BoardPosition = Tuple<SquareContent, 32>

export type PlayerOnMove = 'white' | 'black'

export type PieceColor = 'white' | 'black'

export type Piece = Exclude<SquareContent, 0>

export interface Position {
  row: number
  col: number
}

export interface Move {
  fromIndex: number
  toIndex: number
  captureIndex?: number
}

export type GameResult = -1 | 0 | 1
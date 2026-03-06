import { writeFileSync, appendFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import type { BoardPosition, GameResult, ModelLevel, Player } from '~/types'
import { STARTING_BOARD_STATE, isQueen } from '~/helpers/board'
import { applyMove } from '~/helpers/move'
import { determineGameResult } from '~/helpers/gameOver'
import { pickBestContinuation } from '~/helpers/ai'
import { loadModel, evaluateBoardRaw } from './model'

type JsonGameResult = -1 | 0 | 1
type JsonPlayerMove = 1 | -1

export type TurnRecord = {
  board: BoardPosition
  move: JsonPlayerMove
  eval: number
}

export type GameData = (TurnRecord & {result: JsonGameResult})[]

async function evaluateBoardServer(board: BoardPosition, playerToMove: Player): Promise<number> {
  // wrongly trained model expects reversed board, matching client-side evaluateBoard
  return evaluateBoardRaw([...board].reverse(), playerToMove === 'white' ? 1 : -1)
}

const MAX_TURNS = 300

const mapResultToJson = (result: GameResult): JsonGameResult => {
  if (result === 'white') {
    return 1
  }
  if (result === 'black') {
    return -1
  }
  return 0
}

function mapTurnDataToJson(turns: TurnRecord[], result: GameResult): GameData {
  return turns.map(turn => ({...turn, result: mapResultToJson(result)}))
}

export async function playGame(modelLevel: ModelLevel = 1): Promise<GameData> {
  const config = useRuntimeConfig()
  await loadModel(modelLevel, config.modelsPath)

  let board: BoardPosition = [...STARTING_BOARD_STATE]
  let currentPlayer: Player = 'white'
  let queenMovesWithoutCaptureStreak = 0
  const turns: TurnRecord[] = []

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const gameResult = determineGameResult(board, currentPlayer, queenMovesWithoutCaptureStreak)
    if (gameResult) {
      return mapTurnDataToJson(turns, gameResult)
    }

    const moves = await pickBestContinuation(board, currentPlayer, evaluateBoardServer)
    if (moves.length === 0) {
      return mapTurnDataToJson(turns, currentPlayer === 'white' ? 'black' : 'white')
    }

    for (const move of moves) {
      board = applyMove(board, move)
      if (!move.isCapture && isQueen(board[move.toIndex])) {
        queenMovesWithoutCaptureStreak++
      } else {
        queenMovesWithoutCaptureStreak = 0
      }
    }

    currentPlayer = currentPlayer === 'white' ? 'black' : 'white'

    const evaluation = await evaluateBoardServer(board, currentPlayer)
    turns.push({
      board: [...board],
      move: currentPlayer === 'white' ? 1 : -1,
      eval: evaluation,
    })
  }

  return mapTurnDataToJson(turns, 'draw')
}

export async function playGames(count: number, modelLevel: ModelLevel = 1): Promise<string> {
  const dataDir = join(process.cwd(), 'data')
  mkdirSync(dataDir, { recursive: true })

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const outputFile = join(dataDir, `games_${timestamp}.json`)

  writeFileSync(outputFile, '[', 'utf8')

  let gamesWritten = 0

  try {
    for (let i = 0; i < count; i++) {
      console.log(`[scrape] Playing game ${i + 1}/${count}...`)
      try {
        const gameData = await playGame(modelLevel)
        const prefix = gamesWritten > 0 ? ',' : ''
        appendFileSync(outputFile, `${prefix}${JSON.stringify(gameData).slice(1, -1)}`, 'utf8')
        gamesWritten++
        console.log(`[scrape] Game ${i + 1} done (${gameData.length} turns)`)
      } catch (error) {
        console.error(`[scrape] Game ${i + 1} failed:`, error)
      }
    }
  } finally {
    appendFileSync(outputFile, ']', 'utf8')
  }

  console.log(`[scrape] ${gamesWritten}/${count} games completed. Output: ${outputFile}`)
  return outputFile
}

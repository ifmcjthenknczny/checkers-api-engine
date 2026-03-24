import { MODEL_LEVELS, type ModelLevel } from "./types"

export const BOARD_SIZE = 8


export const SCRAPE_CONFIG = {
    maxGames: 100_000,
    logEvery: 100
}

export const DEPTH_CONFIG = {
    analysisDefault: 5,
    opponentDefault: 5,
    max: 20
}

export const DEFAULT_MODEL_LEVEL: ModelLevel = MODEL_LEVELS.at(-1)!

export const PRUNE_CONFIG = {
    delta: 0.4,
    maxBestContinuations: 6
  }
import { GameResult } from "@/types"

export function mapResultToJson(hasWhiteWon: boolean | null): GameResult {
    if (hasWhiteWon === true) {
      return 1
    }
    if (hasWhiteWon === null) {
      return 0
    }
    return -1
  }
  
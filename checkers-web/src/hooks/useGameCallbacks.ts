import { useBoardStore } from '@/stores/boardStore'
import { useGameStore } from '@/stores/gameStore'
import { getPieceColor, isQueen } from '@/helpers/board'
import type { GameResult, Move, Player } from '@/types'
import { useShouldLog } from './useShouldLog'

export function useGameCallbacks() {
  const boardStore = useBoardStore()
  const gameStore = useGameStore()

  function moveCallback(move: Move) {
    const { boardAfter: newBoard, hasTurnEnded } = boardStore.applyMove(move)
    const shouldPromotePiece = move.isPotentialPromotion && hasTurnEnded
    if (shouldPromotePiece) {
      const color = getPieceColor(newBoard[move.toIndex])
      if (color) {
        gameStore.incrementPromotionsCount(color)
      }
    }
    if (!move.isCapture && isQueen(newBoard[move.toIndex])) {
      gameStore.incrementQueenMovesWithoutCaptureStreak()
      return
    }
    gameStore.resetQueenMovesWithoutCaptureStreak()
  }

  function turnOverCallback() {
    gameStore.switchPlayer()
    gameStore.incrementMovesCount()
  }

  async function gameOverCallback(gameResult: GameResult) {
    const human = gameStore.humanPlayerColor
    gameStore.setGameResult(gameResult)
    gameStore.setGamePhase('gameOver')
    if (!human) {
      return
    }
    const shouldSendSessionId = useShouldLog()
    if (shouldSendSessionId.isOk) {
      await sendGameOverEvent(human, gameResult, shouldSendSessionId.sessionId!)
    }
  }

  return { moveCallback, turnOverCallback, gameOverCallback }
}

export async function sendGameOverEvent(player: Player, result: GameResult, sessionId: string) {
  const baseUrl = useRuntimeConfig().public.engineApiUrl ?? ''
  const url = baseUrl ? `${baseUrl.replace(/\/$/, '')}/gameOver` : `/api/gameOver`

  const numericResult = toNumericResult(result)

  await $fetch(url, {
    method: 'POST',
    body: { player, result: numericResult },
    headers: {
      'x-session-id': sessionId,
    },
  })
}

const toNumericResult = (result: GameResult) => {
  if (result === 'white') {
    return 1
  }
  if (result === 'black') {
    return -1
  }
  return 0
}

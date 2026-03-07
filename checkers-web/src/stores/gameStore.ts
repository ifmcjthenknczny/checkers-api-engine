import type { GamePhase, GameResult, Move, PieceColor, Player } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const DEFAULT_STATE = {
    gamePhase: 'color' as GamePhase,
    currentPlayer: 'white' as Player,
    humanPlayerColor: null,
    movesCount: 0,
    promotionsCount: { white: 0, black: 0 },
    queenMovesWithoutCaptureStreak: 0,
    gameResult: null,
    isAnimating: false,
    animatingMove: null as Move | null,
}

export const useGameStore = defineStore('game', () => {
  const gamePhase = ref<GamePhase>('color')
  const currentPlayer = ref<Player>(DEFAULT_STATE.currentPlayer)
  const humanPlayerColor = ref<Player | null>(DEFAULT_STATE.humanPlayerColor)
  const movesCount = ref<number>(DEFAULT_STATE.movesCount)
  const promotionsCount = ref<Record<PieceColor, number>>(DEFAULT_STATE.promotionsCount)
  const queenMovesWithoutCaptureStreak = ref<number>(0)
  const gameResult = ref<GameResult | null>(null)
  const isAnimating = ref<boolean>(DEFAULT_STATE.isAnimating)
  const animatingMove = ref<Move | null>(DEFAULT_STATE.animatingMove)
  let moveAnimationResolver: (() => void) | null = null

  function setAnimating(value: boolean) {
    isAnimating.value = value
  }

  function setAnimatingMove(move: Move | null, onAnimationEnd?: () => void) {
    animatingMove.value = move
    moveAnimationResolver = move ? onAnimationEnd ?? null : null
  }

  function resolveMoveAnimation() {
    if (moveAnimationResolver) {
      moveAnimationResolver()
      moveAnimationResolver = null
    }
  }

  function switchPlayer() {
    currentPlayer.value = currentPlayer.value === 'white' ? 'black' : 'white'
  }

  function setCurrentPlayer(player: Player) {
    currentPlayer.value = player
  }

  function chooseColor(color: Player) {
    humanPlayerColor.value = color
  }

  function incrementPromotionsCount(color: PieceColor) {
    promotionsCount.value = {
      ...promotionsCount.value,
      [color]: promotionsCount.value[color] + 1,
    }
  }

  function incrementQueenMovesWithoutCaptureStreak() {
    queenMovesWithoutCaptureStreak.value++
  }

  function resetQueenMovesWithoutCaptureStreak() {
    queenMovesWithoutCaptureStreak.value = 0
  }

  function setGamePhase(phase: GamePhase) {
    gamePhase.value = phase
  }

  function resetToDefault() {
    gamePhase.value = DEFAULT_STATE.gamePhase
    currentPlayer.value = DEFAULT_STATE.currentPlayer
    humanPlayerColor.value = DEFAULT_STATE.humanPlayerColor
    movesCount.value = DEFAULT_STATE.movesCount
    promotionsCount.value = DEFAULT_STATE.promotionsCount
    queenMovesWithoutCaptureStreak.value = DEFAULT_STATE.queenMovesWithoutCaptureStreak
    gameResult.value = DEFAULT_STATE.gameResult
    isAnimating.value = DEFAULT_STATE.isAnimating
    animatingMove.value = DEFAULT_STATE.animatingMove
  }

  function incrementMovesCount() {
    movesCount.value++
  }

  function setGameResult(result: GameResult | null) {
    gameResult.value = result
  }

  return {
    currentPlayer,
    setCurrentPlayer,
    switchPlayer,
    humanPlayerColor,
    chooseColor,
    movesCount,
    incrementTurn: incrementMovesCount,
    promotionsCount,
    queenMovesWithoutCaptureStreak,
    incrementPromotionsCount,
    incrementQueenMovesWithoutCaptureStreak,
    resetQueenMovesWithoutCaptureStreak,
    resetToDefault,
    gameResult,
    setGameResult,
    gamePhase,
    setGamePhase,
    isAnimating,
    animatingMove,
    setAnimating,
    setAnimatingMove,
    resolveMoveAnimation,
  }
})

<script setup lang="ts">
import BoardWrapper from '@/components/BoardWrapper.vue'
import PlayerColorChoice from '@/components/PlayerColorChoice.vue'
import PageLayout from '@/layouts/PageLayout.vue'
import { watch } from 'vue'
import { useBoardStore } from '@/stores/boardStore';
import { useGameStore } from '@/stores/gameStore';
import { computerTurn } from '@/helpers/turn';
import type { Move } from '@/types';
import { getPieceColor, isQueen } from '@/helpers/board';
import { pickBestEngineContinuation } from '@/helpers/ai';
import { storeToRefs } from 'pinia';
import { sleep } from '@/helpers/utils';
import { determineGameResult } from '@/helpers/gameOver';

const boardStore = useBoardStore()
const {board} = storeToRefs(boardStore)
const gameStore = useGameStore()
const { humanPlayerColor, currentPlayer, queenMovesWithoutCaptureStreak, gamePhase } = storeToRefs(gameStore)

function startGame() {
    boardStore.resetToDefault()
    gameStore.setGamePhase('game')
}

function resetGame() {
    boardStore.resetToDefault()
    gameStore.resetToDefault()
}

watch(
  () => humanPlayerColor.value,
  (newVal, oldVal) => {
    if (newVal !== null && oldVal === null) {
      startGame()
    }
    if (newVal === null && oldVal !== null) {
      resetGame()
    }
  }
)

function moveCallback(move: Move) {
  const newBoard = boardStore.applyMove(move)
  if (move.isPromotion) {
    const color = getPieceColor(newBoard[move.toIndex])
    if (color) gameStore.incrementPromotionsCount(color)
  }
  if (!move.isCapture && isQueen(newBoard[move.toIndex])) {
    gameStore.incrementQueenMovesWithoutCaptureStreak()
  } else {
    gameStore.resetQueenMovesWithoutCaptureStreak()
  }
}

function turnOverCallback() {
  gameStore.switchPlayer()
  gameStore.incrementTurn()
}

function gameOverCallback() {
  // TODO: if game is over, then highlight pieces that won and show message that game is over
  gameStore.setGameResult(determineGameResult(board.value, currentPlayer.value, queenMovesWithoutCaptureStreak.value))
  gameStore.setGamePhase('gameOver')
}

watch(
  [() => gamePhase.value, () => currentPlayer.value],
  async () => {
    if (gamePhase.value === 'game' && humanPlayerColor.value !== null && humanPlayerColor.value !== currentPlayer.value) {
      await sleep(500)
      computerTurn(boardStore.board, currentPlayer.value, queenMovesWithoutCaptureStreak.value, {
        gameOverCallback,
        moveCallback,
        turnOverCallback,
        movePickingStrategy: pickBestEngineContinuation,
      })
    // TODO: animacja ruchu
    }
  },
  { immediate: true },
)

</script>

<template>
    <PageLayout>
        <div class="play-page">
            <PlayerColorChoice v-if="gamePhase === 'color'" />

            <BoardWrapper v-if="['game', 'gameOver'].includes(gamePhase)" context="game" />
        </div>
    </PageLayout>
</template>

<style lang="scss" scoped>
@use 'sass:color';

.play-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
}

@media (max-width: 700px) {
  .play-page {
    .legal-move {
      border-width: 1.2px;
    }

    .game-info {
      width: $boardSizeVertical;
      font-size: 1.4rem;

      &__who-to-move {
        margin-left: $nameSquareSizeVertical;
      }
    }
  }
}
</style>
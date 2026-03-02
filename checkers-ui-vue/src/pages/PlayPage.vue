<script setup lang="ts">
import PlayerColorChoice from '@/components/PlayerColorChoice.vue';
import { ref, watch } from 'vue';
import { useBoardStore } from '@/stores/boardStore';
import { useGameStore } from '@/stores/gameStore';

const gamePhase = ref<'color' | 'game'>('color')

const boardStore = useBoardStore()
const gameStore = useGameStore()

function startGame() {
    boardStore.resetToDefault()
    gamePhase.value = 'game'
}

function resetGame() {
    boardStore.resetToDefault()
    gameStore.resetToDefault()
    gamePhase.value = 'color'
}

watch(
  () => boardStore.humanPlayerColor,
  (newVal, oldVal) => {
    if (newVal !== null && oldVal === null) {
      startGame()
    }
    if (newVal === null && oldVal !== null) {
      resetGame()
    }
  }
)

watch(
  [gamePhase, boardStore.humanPlayerColor],
  () => {
    if (gamePhase.value === 'game' && boardStore.humanPlayerColor !== boardStore.currentPlayer) {
    //   TODO: komputerowy ruch
    // TODO: animacja ruchu
    }
  },
  { immediate: true },
)

</script>

<template>
    <div class="play-page">
        <PlayerColorChoice v-if="gamePhase === 'color'" />
        <Transition name="fade-in-out" mode="out-in">
            <BoardWrapper v-if="gamePhase === 'game'" />
        </Transition>
    </div>
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
<script setup lang="ts">
import { computed } from 'vue'
import { useBoardStore } from '@/stores/boardStore'
import { storeToRefs } from 'pinia'

const boardStore = useBoardStore()
const { currentPlayer } = storeToRefs(boardStore)

const label = computed(() => (currentPlayer.value === 'white' ? 'Białe' : 'Czarne'))
</script>

<template>
  <div class="game-info">
    <div class="game-info__who-to-move">
      RUCH:
      <button
        class="toggle-button"
        :class="{ 'is-black': currentPlayer === 'black' }"
        @click="boardStore.switchPlayer"
        type="button"
      >
        <span :class="currentPlayer">{{ label }}</span>
        <div class="toggle-track">
          <div class="toggle-thumb"></div>
        </div>
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.game-info {
  display: flex;
  flex-direction: row;
  justify-content: end;
  text-transform: uppercase;
  font-weight: 550;
  width: $boardSizeHorizontal;
  font-size: 1rem;
  align-items: center;

  &__who-to-move {
    margin-right: auto;
    margin-left: $nameSquareSizeHorizontal;
    display: flex;
    align-items: center;
    gap: 12px;

    span {
      font-weight: 700;
      color: black;
      transition: all 0.3s ease;
      display: inline-block;
      min-width: 60px;

      &.white {
        color: white;
        text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
        -webkit-text-stroke: 0.6px black;
      }
    }
  }
}

.toggle-button {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 0;
  outline: none;

  .toggle-track {
    width: 44px;
    height: 22px;
    background-color: #eee;
    border: 2px solid black;
    border-radius: 11px;
    position: relative;
    transition: background-color 0.3s ease;
    margin-left: 8px;
  }

  .toggle-thumb {
    width: 14px;
    height: 14px;
    background-color: white;
    border: 1px solid black;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition:
      transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
      background-color 0.3s;
  }

  &.is-black {
    .toggle-track {
      background-color: #333;
    }
    .toggle-thumb {
      transform: translateX(22px);
      background-color: black;
      border-color: white;
    }
  }
}

@media (max-width: 700px) {
  .game-info {
    width: $boardSizeVertical;
    font-size: 1.4rem;

    &__who-to-move {
      margin-left: $nameSquareSizeVertical;
    }
  }
}
</style>

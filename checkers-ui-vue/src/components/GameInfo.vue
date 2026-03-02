<template>
    <section class="game-info">
        <section class="game-info__who-to-move">
        <span :class="currentPlayer === 'white' ? 'white' : ''">{{
            currentPlayer === 'white' ? 'White' : 'Black'
        }}</span> to move
        </section>
        <section class="game-info__turn-counter">
        Turn: <span>{{ turn }}</span>
        </section>
    </section>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/gameStore'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { currentPlayer, turn } = storeToRefs(gameStore)
</script>

<style lang="scss" scoped>
.game-info {
    display: flex;
    flex-direction: row;
    justify-content: end;
    text-transform: uppercase;
    font-weight: 550;
    width: $boardSizeHorizontal;
    font-size: 1rem;

    &__turn-counter span {
        font-weight: 700;
    }

    &__who-to-move {
        margin-right: auto;
        margin-left: $nameSquareSizeHorizontal;

        span {
        font-weight: 700;
        color: black;
        text-shadow: none;

        &.white {
            color: white;
            -webkit-text-stroke: 0.6px black;
        }
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
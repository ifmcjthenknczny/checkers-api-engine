<template>
    <section class="captured-pieces">
        <div
        v-for="n in Array.from({ length: capturedQueensCount })"
        :key="'t-q-' + n"
        :class="[
            'mini-piece',
            'mini-piece--queen',
            `mini-piece--${props.pieceColor}`
        ]"
        />
        <div
        v-for="n in Array.from({ length: capturedNormalPiecesCount })"
        :key="'t-p-' + n"
        :class="[
            'mini-piece',
            `mini-piece--${props.pieceColor}`
        ]"
        />
    </section>
</template>

<script setup lang="ts">
import type { PieceColor } from '@/types';
import { useGameStore } from '@/stores/gameStore';
import { getPiecesOfColor, isQueen, STARTING_BOARD_STATE } from '@/helpers/board';
import { computed } from 'vue';
import { useBoardStore } from '@/stores/boardStore';

const props = defineProps<{
  pieceColor: PieceColor
}>()

const boardStore = useBoardStore()
const gameStore = useGameStore()

const startingPiecesCount = getPiecesOfColor(STARTING_BOARD_STATE, props.pieceColor).length

const capturedQueensCount = computed(() => gameStore.promotionsCount[props.pieceColor] - getPiecesOfColor(boardStore.board, props.pieceColor).filter(({piece}) => isQueen(piece)).length)

const capturedNormalPiecesCount = computed(() => getPiecesOfColor(boardStore.board, props.pieceColor).length - startingPiecesCount - capturedQueensCount.value)
</script>

<style lang="scss" scoped>
  .captured-pieces {
    height: $minipieceSize;
    margin: $minipieceSize;
    display: flex;
    flex-flow: row;
  }

  .mini-piece {
    width: $minipieceSize;
    height: $minipieceSize;
    border-radius: 50%;
    border: 0.6px solid black;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1px;

    &--white {
      background-color: white;
    }

    &--black {
      background-color: black;
      border-color: grey;
    }

    &--queen {
      background-color: color.mix(darkgrey, black);
    }
  }
</style>
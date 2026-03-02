<script lang="ts" setup>
import { useGameStore } from '@/stores/gameStore'
import BoardComponent from './BoardComponent.vue'
import { ref } from 'vue'

const isBoardFlipped = ref<boolean>(false)

const gameStore = useGameStore()

// TODO: ogar button container style i click handler

function flipBoard() {
    isBoardFlipped.value = !isBoardFlipped.value
}

</script>

<template>
    <GameInfo />

    <PieceGraveryard :pieceColor="isBoardFlipped ? 'black' : 'white'" />

    <BoardComponent :in-game-behavior="true" />

    <PieceGraveryard :pieceColor="isBoardFlipped ? 'white' : 'black'" />

    <section class="button-container button-container--game">
        <button
        type="button"
        class="button button--reset button--game"
        @click="gameStore.resetToDefault()"
        >
        restart
        </button>
        
        <button
        type="button"
        class="button button--flip button--game"
        @click="flipBoard"
        >
        flip board
        </button>        
    </section>
</template>
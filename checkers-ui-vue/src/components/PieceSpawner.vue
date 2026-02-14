<script setup lang="ts">
import type { SquareContent } from '@/types'
import PieceComponent from './PieceComponent.vue'
import SquareWrapper from './SquareWrapper.vue'
import PieceTrash from './PieceTrash.vue'

const PIECES: SquareContent[] = [3, -3, 1, -1]
</script>

<template>
  <div class="piece-spawner">
    <SquareWrapper :key="piece" v-for="piece in PIECES" :color="piece > 0 ? 'black' : 'white'">
      <PieceComponent :piece="piece" context="spawn" />
    </SquareWrapper>
    <SquareWrapper color="black">
      <PieceTrash />
    </SquareWrapper>
  </div>
</template>

<style lang="scss" scoped>
.piece-spawner {
  height: calc($boardSizeVertical / 12);
  display: flex;
  width: 100%;
}
</style>

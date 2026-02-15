<script setup lang="ts">
import type { SquareContent } from '@/types'
import PieceComponent from './PieceComponent.vue'
import SquareWrapper from './SquareWrapper.vue'
import PieceTrash from './PieceTrash.vue'
import RemovePieces from './RemovePieces.vue'
import ResetToDefaultButton from './ResetToDefaultButton.vue'

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
    <SquareWrapper color="white">
      <RemovePieces />
    </SquareWrapper>
    <SquareWrapper color="black">
      <ResetToDefaultButton />
    </SquareWrapper>
  </div>
</template>

<style lang="scss" scoped>
.piece-spawner {
  height: 100%;
  display: flex;
  flex-direction: row;
  width: calc($boardSizeVertical / 12);
}

@media (min-width: 700px) {
  .piece-spawner {
    flex-direction: column;
  }
}
</style>

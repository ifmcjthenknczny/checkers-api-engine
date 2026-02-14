<script lang="ts" setup>
import { isWhiteSquare } from '@/boardHelpers'

interface Props {
  position: [number, number],
  rowName: number
  colName: string
}

const props = defineProps<Props>();

const emit = defineEmits<{dropPiece: [[number, number]]}>()
const allowDrop = (e: DragEvent) => {
  if (isWhiteSquare(rowIndex, colIndex)) {
    return
  }
  e.preventDefault()
}

const drop = () => {
  emit("dropPiece", props.position)
}

const [colIndex, rowIndex] = props.position
</script>

<template>
      <div
        :key="colName + rowName"
        :id="colName + rowName"
        :class="[
          'grid__square',
          isWhiteSquare(rowIndex, colIndex) ? 'grid__square--white' : 'grid__square--black'
        ]"
        @dragover="allowDrop"
        @drop="drop"
      >
      <slot />
    </div>
</template>

<style lang="scss" scoped>
.grid__square {
    aspect-ratio: 1;
    border: .8px solid $borderColor;

    display: flex;
    align-items: center;
    justify-content: center;

    &--black {
        background-color: $blackSquareColor;
    }

    &--white {
        background-color: $whiteSquareColor;
    }
  }
</style>

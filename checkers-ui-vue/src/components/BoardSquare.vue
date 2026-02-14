<script lang="ts" setup>
import { isWhiteSquare } from '@/boardHelpers'
import type { SquareContent } from '@/types'
import SquareWrapper from './SquareWrapper.vue'

interface Props {
  position: [number, number]
  rowName: number
  colName: string
}

const props = defineProps<Props>()

const emit = defineEmits<{ dropPiece: [[number, number, SquareContent?]] }>()
const allowDrop = (e: DragEvent) => {
  if (!isWhiteSquare(rowIndex, colIndex)) {
    e.preventDefault()
  }
  const piece = e.dataTransfer?.getData('piece')

  if (piece) {
    emit('dropPiece', [colIndex, rowIndex, +piece as SquareContent])
    return
  }
  e.preventDefault()
}

const drop = (e: DragEvent) => {
  if (isWhiteSquare(rowIndex, colIndex)) {
    return
  }

  const piece = e.dataTransfer?.getData('piece')
  if (piece) {
    emit('dropPiece', [colIndex, rowIndex, +piece as SquareContent])
  } else {
    emit('dropPiece', [colIndex, rowIndex])
  }
}

const [colIndex, rowIndex] = props.position
</script>

<template>
  <SquareWrapper
    :color="isWhiteSquare(rowIndex, colIndex) ? 'white' : 'black'"
    :key="colName + rowName"
    :id="colName + rowName"
    @dragover="allowDrop"
    @drop="drop"
  >
    <slot />
  </SquareWrapper>
</template>

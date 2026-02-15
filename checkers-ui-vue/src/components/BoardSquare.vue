<script lang="ts" setup>
import { getSquareIndex, isWhiteSquare } from '@/boardHelpers'
import type { SquareContent } from '@/types'
import SquareWrapper from './SquareWrapper.vue'
import { useDragStore } from '@/stores/dragStore'
import { storeToRefs } from 'pinia'

interface Props {
  position: [number, number]
  rowName: number
  colName: string
}

const props = defineProps<Props>()
const [colIndex, rowIndex] = props.position

const dragStore = useDragStore()
const { activePiece, dragContext, draggedIndex } = storeToRefs(dragStore)

const emit = defineEmits<{ dropPiece: [[number, number, SquareContent?]] }>()
const allowDrop = (e: DragEvent) => {
  if (!isWhiteSquare(rowIndex, colIndex) && draggedIndex.value !== squareIndex) {
    e.preventDefault()
  }
}

const squareIndex = getSquareIndex(rowIndex, colIndex)

const drop = (e: DragEvent) => {
  e.preventDefault()
  if (dragContext.value === 'spawn' && activePiece.value !== null) {
    emit('dropPiece', [colIndex, rowIndex, activePiece.value])
  } else if (dragContext.value === 'board') {
    emit('dropPiece', [colIndex, rowIndex])
  }
}
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

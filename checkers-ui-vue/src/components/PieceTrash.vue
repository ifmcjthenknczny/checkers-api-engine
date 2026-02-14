<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'
import { useDragStore } from '@/stores/dragStore'
import { storeToRefs } from 'pinia'

const dragStore = useDragStore()
const { draggedIndex } = storeToRefs(dragStore)
const { removePiece } = useBoardStore()

const allow = (e: DragEvent) => e.preventDefault()

const drop = () => {
  if (draggedIndex.value === null) {
    return
  }
  removePiece(draggedIndex.value)
  dragStore.stopDrag()
}
</script>

<template>
  <div class="trash" @dragover="allow" @drop="drop">🗑️</div>
</template>

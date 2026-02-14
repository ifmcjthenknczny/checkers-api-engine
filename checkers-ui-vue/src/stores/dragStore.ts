import { defineStore } from 'pinia'
import { ref } from 'vue'

export type DragContext = 'board' | 'spawn'

export const useDragStore = defineStore('drag', () => {
  const draggedIndex = ref<number | null>(null)
  const dragContext = ref<DragContext | null>(null)

  const startDrag = (context: DragContext, fromIndex?: number) => {
    draggedIndex.value = fromIndex ?? null
    dragContext.value = context
  }
  const stopDrag = () => {
    draggedIndex.value = null
    dragContext.value = null
  }

  return { draggedIndex, startDrag, stopDrag, dragContext }
})

import type { Move } from '@/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAnimationStore = defineStore('animation', () => {
    const isAnimating = ref<boolean>(false)
    const animatingMove = ref<Move | null>(null)

    function setAnimating(value: boolean) {
        isAnimating.value = value
    }

    function setAnimatingMove(move: Move | null) {
        animatingMove.value = move
    }

    return {
        isAnimating,
        animatingMove,
        setAnimating,
        setAnimatingMove,
    }
})
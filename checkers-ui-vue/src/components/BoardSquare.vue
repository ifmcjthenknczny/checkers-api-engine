<script lang="ts" setup>
import { getPieceColor, getSquareIndex, isQueen, isWhiteSquare } from '@/helpers/board'
import type { BoardContext, Move, SquareContent } from '@/types'
import SquareWrapper from './SquareWrapper.vue'
import { useDragStore } from '@/stores/dragStore'
import { storeToRefs } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import { playerMove } from '@/helpers/turn'
import { getLegalMove } from '@/helpers/move'
import { useBoardStore } from '@/stores/boardStore'
import { determineGameResult } from '@/helpers/gameOver'

interface Props {
  position: [number, number]
  rowName: number
  colName: string
  boardIndex?: number
  context: BoardContext
}

const props = defineProps<Props>()
const [colIndex, rowIndex] = props.position

const dragStore = useDragStore()
const { activePiece, dragContext, draggedIndex } = storeToRefs(dragStore)

const boardStore = useBoardStore()
const { board } = storeToRefs(boardStore)

const gameStore = useGameStore()
const { humanPlayerColor, currentPlayer, queenMovesWithoutCaptureStreak } = storeToRefs(gameStore)

const emit = defineEmits<{ dropPiece: [[number, number, SquareContent?]] }>()

const allowDrop = (e: DragEvent) => {
  const isPlayersPiece = activePiece.value && getPieceColor(activePiece.value) === humanPlayerColor.value
  const isDifferentSquare = draggedIndex.value !== squareIndex
  const isPlayableSquare = !isWhiteSquare(rowIndex, colIndex)
  const isPlayerTurn = currentPlayer.value === humanPlayerColor.value

  if (isPlayableSquare && isDifferentSquare && ((props.context === 'game' && isPlayersPiece && isPlayerTurn) || props.context === 'analysis')) {
    e.preventDefault()
  }
}

const squareIndex = props.boardIndex ?? getSquareIndex(rowIndex, colIndex)

// TODO: deduplicate with PlayPage
function moveCallback(move: Move) {
  const newBoard = boardStore.applyMove(move)
  if (move.isPromotion) {
    const color = getPieceColor(newBoard[move.toIndex])
    if (color) {
      gameStore.incrementPromotionsCount(color)
    }
  }
  if (!move.isCapture && isQueen(newBoard[move.toIndex])) {
    gameStore.incrementQueenMovesWithoutCaptureStreak()
    return
  }
  gameStore.resetQueenMovesWithoutCaptureStreak()
}

function turnOverCallback() {
  gameStore.switchPlayer()
  gameStore.incrementTurn()
}

function gameOverCallback() {
  // TODO: if game is over, then highlight pieces that won
  gameStore.setGamePhase('gameOver')
  gameStore.setGameResult(determineGameResult(board.value, currentPlayer.value, queenMovesWithoutCaptureStreak.value))
}

const drop = (e: DragEvent) => {
  e.preventDefault()
  if (!activePiece.value) {
    return
  }
  if (props.context === 'game') {
    const move = getLegalMove(board.value, { fromIndex: draggedIndex.value ?? undefined, toIndex: squareIndex })
    if (move) {
      playerMove(move, board.value, currentPlayer.value, queenMovesWithoutCaptureStreak.value, {moveCallback, turnOverCallback, gameOverCallback})
    }
  }
  if (dragContext.value) {
    emit('dropPiece', [colIndex, rowIndex, activePiece.value])
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

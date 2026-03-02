import type { BoardPosition, Move, Player } from "@/types"
import { applyMove } from "./move"
import { determineGameResult } from "./gameOver"
import { pickARandomMove } from "./ai"

// TODO: problem z zakończeniem tury gdy jest chained capture

const playerTurn = (board: BoardPosition, playerColor: Player, queenMovesWithoutCaptureCount: number, gameOverCallback: () => void, moveCallback: (move: Move) => void, move: Move | null) => {
    const isGameOver = determineGameResult(board, playerColor, queenMovesWithoutCaptureCount)

    if (isGameOver) {
        gameOverCallback()
        return
    }

    const newBoard = applyMove(board, move!)
    moveCallback(move!)

    return newBoard
}


const computerTurn = (board: BoardPosition, playerColor: Player, queenMovesWithoutCaptureCount: number, gameOverCallback: () => void, moveCallback: (move: Move) => void) => {
    const move = pickARandomMove(playerColor, board)

    playerTurn(board, playerColor, queenMovesWithoutCaptureCount, gameOverCallback, moveCallback, move)
}

const gameOverCb = () => {
    // save boards with result to json
    // podświetlić figury albo coś
}

const moveCb = (move: Move) => {
    // increase turn number
    // queen moves without capture streak
    // save board
    // zmiana playera który ma teraz ruch
    // ogar chained capture wraz z forbidden direction
}
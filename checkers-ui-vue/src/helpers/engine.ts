import type { BoardPosition, Player } from '@/types'

type EvaluationResponse = {
  status: 'success'
  evaluation: number
}

/**
 * @param baseUrl - Base URL silnika (np. z useRuntimeConfig().public.engineApiUrl). Pusty = /api (Nuxt same-origin).
 * W Vite bez Nuxt można ustawić VITE_BASE_ENGINE_API_URL.
 */
export const evaluateBoard = async (
  board: BoardPosition,
  playerToMove: Player,
  baseUrl?: string,
): Promise<number> => {
  const base =
    baseUrl ??
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_BASE_ENGINE_API_URL) ??
    ''
  const url = base ? `${base.replace(/\/$/, '')}/evaluate` : '/api/evaluate'

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      // wrongly trained model expects reversed board, to be fixed in next model generation
      board: board.toReversed(),
      move: playerToMove === 'white' ? 1 : -1,
    }),
  })

  const data: EvaluationResponse = await response.json()
  return data.evaluation ?? 0
}
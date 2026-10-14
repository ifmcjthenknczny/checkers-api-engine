import { useSessionId } from '~/hooks/useSessionId'
import { type BoardPosition, type ModelLevel, type Move, type Player } from '../types'

import { findAllLegalContinuations } from './move'
import { chooseRandomly } from './utils'
import { DEPTH_CONFIG } from '~/config'

export function pickRandomContinuation(board: BoardPosition, player: Player): Move[] {
  const continuations = findAllLegalContinuations(board, player)
  return chooseRandomly(continuations)
}

type ContinuationResponse = {
  continuation: Move[]
}

const GAME_PATH = '/play'

export async function pickBestEngineContinuation(
  board: BoardPosition,
  player: Player,
  depth: number = DEPTH_CONFIG.opponentDefault,
  modelLevel: ModelLevel,
): Promise<Move[]> {
  const sessionId = useSessionId().getSessionId()
  const route = useRoute()

  const shouldSendSessionId = sessionId && route.path === GAME_PATH

  const baseUrl = useRuntimeConfig().public.engineApiUrl ?? ''
  const url = baseUrl
    ? `${baseUrl.replace(/\/$/, '')}/engine/continuation/${modelLevel}`
    : `/api/engine/continuation/${modelLevel}`

  const { continuation } = await $fetch<ContinuationResponse>(url, {
    method: 'POST',
    body: { board, move: player, depth },
    ...(shouldSendSessionId && {
      headers: {
        'x-session-id': sessionId,
      },
    }),
  })

  return continuation ?? []
}

import { type BoardPosition, type ModelLevel, type Move, type Player } from '../types'

import { findAllLegalContinuations } from './move'
import { chooseRandomly } from './utils'
import { DEPTH_CONFIG } from '~/config'
import { useShouldLog } from '~/hooks/useShouldLog'

export function pickRandomContinuation(board: BoardPosition, player: Player): Move[] {
  const continuations = findAllLegalContinuations(board, player)
  return chooseRandomly(continuations)
}

type ContinuationResponse = {
  continuation: Move[]
}

export async function pickBestEngineContinuation(
  board: BoardPosition,
  player: Player,
  depth: number = DEPTH_CONFIG.opponentDefault,
  modelLevel: ModelLevel,
): Promise<Move[]> {
  const shouldSendSessionId = useShouldLog()

  const baseUrl = useRuntimeConfig().public.engineApiUrl ?? ''
  const url = baseUrl
    ? `${baseUrl.replace(/\/$/, '')}/engine/continuation/${modelLevel}`
    : `/api/engine/continuation/${modelLevel}`

  const { continuation } = await $fetch<ContinuationResponse>(url, {
    method: 'POST',
    body: { board, move: player, depth },
    ...(shouldSendSessionId.isOk && {
      headers: {
        'x-session-id': shouldSendSessionId.sessionId!,
      },
    }),
  })

  return continuation ?? []
}

import { ensureModelLoaded, parseModelLevel } from '#server/utils/model'
import { BodyRequestSchema, parseBodyOrThrow } from '#server/utils/schema'
import type { BoardPosition } from '~/types'
import { pickBestContinuationWithDepth } from '~/server/utils/eval'

export default defineEventHandler(async (event) => {
  const modelLevel = parseModelLevel(getRouterParam(event, 'modelLevel'))

  await ensureModelLoaded(modelLevel)

  const {
    board,
    move: playerColor,
    depth,
    useNonDeterministic,
  } = await parseBodyOrThrow(event, BodyRequestSchema)

  const { moves } = await pickBestContinuationWithDepth(
    board as BoardPosition,
    playerColor,
    depth,
    useNonDeterministic,
  )

  return { continuation: moves }
})

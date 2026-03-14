import { ensureModelLoaded, parseModelLevel, pickBestContinuationWithDepth, MAX_DEPTH } from '#server/utils/model'
import { BodyRequestSchema, parseBodyOrThrow } from '#server/utils/schema'
import type { BoardPosition } from '~/types'
import { z } from 'zod'

const ContinuationBodySchema = BodyRequestSchema.extend({
  depth: z.coerce.number().int().min(0).max(MAX_DEPTH).default(0),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const modelLevel = parseModelLevel(getRouterParam(event, 'modelLevel'))

  await ensureModelLoaded(modelLevel, config.modelsPath)

  const { board, move: playerColor, depth } = await parseBodyOrThrow(event, ContinuationBodySchema)

  const continuation = await pickBestContinuationWithDepth(board as BoardPosition, playerColor, depth)

  return { continuation }
})

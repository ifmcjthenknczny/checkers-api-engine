import { evaluateBoardRaw, minimaxScore, ensureModelLoaded, parseModelLevel, MAX_DEPTH } from '#server/utils/model'
import { BodyRequestSchema, parseBodyOrThrow } from '#server/utils/schema'
import type { BoardPosition } from '~/types'
import { z } from 'zod'

const EvalBodySchema = BodyRequestSchema.extend({
  depth: z.coerce.number().int().min(0).max(MAX_DEPTH).default(0),
})

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const modelLevel = parseModelLevel(getRouterParam(event, 'modelLevel'))

  await ensureModelLoaded(modelLevel, config.modelsPath)

  const { board, move, depth } = await parseBodyOrThrow(event, EvalBodySchema)
  const boardPosition = board as BoardPosition

  const evaluation = depth === 0
    ? await evaluateBoardRaw(boardPosition, move)
    : await minimaxScore(boardPosition, move, depth, move)

  return { evaluation, status: 'success' }
})

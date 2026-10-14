import { readBody, createError } from 'h3'
import { z } from 'zod'

const GameOverSchema = z.object({
  player: z.enum(['black', 'white']),
  result: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
})

export default defineEventHandler(async (event) => {
  const sessionId = getHeader(event, 'x-session-id')
  const rawBody = await readBody(event)

  const parseResult = GameOverSchema.safeParse(rawBody)

  if (!parseResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  const { player, result } = parseResult.data

  if (sessionId) {
    console.log({
      event: 'game_over',
      human: player,
      result,
      id: sessionId,
    })
  }

  return { status: 'logged' }
})

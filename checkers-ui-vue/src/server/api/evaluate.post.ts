import { z } from 'zod'

const ALLOWED_PIECES = [0, 1, -1, 3, -3]
const ALLOWED_MOVES = [-1, 1]

const EvalSchema = z.object({
  board: z
    .array(z.number().int())
    .length(32, 'Array must have exactly 32 elements')
    .refine((arr) => arr.every((val) => ALLOWED_PIECES.includes(val)), {
      message: 'Allowed values are: 0 (empty), 1/-1 (pawns), 3/-3 (queens)',
    }),
  move: z.number().int().refine((val) => ALLOWED_MOVES.includes(val), {
    message: 'Move must be 1 (White) or -1 (Black)',
  }),
})

let modelLoaded = false

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const modelsPath = config.modelsPath as string

  const { loadModel, evaluateBoardRaw } = await import('#server/utils/model')

  if (!modelLoaded) {
    await loadModel(1, modelsPath)
    modelLoaded = true
  }

  const body = await readBody(event)
  const result = EvalSchema.safeParse(body)

  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input',
      data: result.error.format(),
    })
  }

  const evaluation = await evaluateBoardRaw(result.data.board, result.data.move)

  return {
    evaluation,
    status: 'success',
  }
})

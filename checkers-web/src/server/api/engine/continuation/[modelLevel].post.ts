import { ensureModelLoaded, parseModelLevel } from '#server/utils/model'
import { BodyRequestSchema, parseBodyOrThrow } from '#server/utils/schema'
import type { BoardPosition } from '~/types'
import { pickBestContinuationWithDepth } from '~/server/utils/eval'

const EVAL_DECIMALS = 5

const roundEval = (value: number): number => {
  return Math.round(value * 10 ** EVAL_DECIMALS) / 10 ** EVAL_DECIMALS
}

export default defineEventHandler(async (event) => {
  const modelLevel = parseModelLevel(getRouterParam(event, 'modelLevel'))
  const sessionId = getHeader(event, 'x-session-id')

  await ensureModelLoaded(modelLevel)

  const {
    board,
    move: playerColor,
    depth,
    useNonDeterministic,
  } = await parseBodyOrThrow(event, BodyRequestSchema)

  const { moves, score } = await pickBestContinuationWithDepth(
    board as BoardPosition,
    playerColor,
    depth,
    useNonDeterministic,
  )

  if (sessionId) {
    console.log({
      human: playerColor === 'black' ? 'white' : 'black',
      eval: roundEval(score),
      id: sessionId,
    })
  }

  return { continuation: moves }
})

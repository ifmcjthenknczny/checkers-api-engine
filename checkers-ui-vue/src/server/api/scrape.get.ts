import { MODEL_LEVELS, type ModelLevel } from '~/types'
import { playGames } from '#server/utils/scrape'
import { DEFAULT_MODEL_LEVEL } from './evaluate.post'

const MAX_GAMES = 100_000

export default defineEventHandler((event) => {
  const config = useRuntimeConfig()

  if (!config.scrapeSecret) {
    throw createError({ statusCode: 500, statusMessage: 'NUXT_SCRAPE_SECRET is not configured' })
  }

  const query = getQuery(event)

  if (query.secret !== config.scrapeSecret) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const games = Math.min(Math.max(parseInt(query.games as string) || 1, 1), MAX_GAMES)
  const modelLevel = (MODEL_LEVELS as readonly number[]).includes(Number(query.modelLevel))
    ? (Number(query.modelLevel) as ModelLevel)
    : DEFAULT_MODEL_LEVEL

  playGames(games, modelLevel).catch((error) =>
    console.error('[scrape] Fatal error:', error),
  )

  return { status: 'started', games, modelLevel }
})

import type { ModelLevel } from '~/types'
import { playGames } from '#server/utils/scrape'

export default defineTask({
  meta: {
    name: 'scrape',
    description: 'Play self-play games and save training data',
  },
  async run({ payload }) {
    const { games = 1, modelLevel = 1 } = (payload ?? {}) as { games?: number; modelLevel?: ModelLevel }
    const outputFile = await playGames(games, modelLevel)
    return { result: { outputFile } }
  },
})

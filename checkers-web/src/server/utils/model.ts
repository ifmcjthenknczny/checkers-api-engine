import { z } from 'zod'
import { type ModelLevel, MODEL_LEVELS } from '~/types'

export type ModelWeights = Record<string, number[] | number[][]>

const weightsCache = new Map<ModelLevel, ModelWeights>()

export let currentWeights: ModelWeights | null = null

export async function loadModelWeights(level: ModelLevel): Promise<ModelWeights> {
  if (weightsCache.has(level)) return weightsCache.get(level)!

  const raw = await useStorage('assets:models').getItem<ModelWeights | string>(
    `engine_${level}.json`,
  )
  if (!raw) {
    throw new Error(`Model weights for level ${level} not found`)
  }

  const weights = typeof raw === 'string' ? JSON.parse(raw) : raw
  weightsCache.set(level, weights)
  return weights
}

export const ModelLevelSchema = z.enum(
  MODEL_LEVELS.map((level) => level.toString()),
  {
    message: `Model level is invalid. Must be one of: ${MODEL_LEVELS.join(', ')}`,
  },
)

let modelLevelLoaded: ModelLevel | null = null

export async function ensureModelLoaded(modelLevel: ModelLevel): Promise<ModelWeights> {
  if (modelLevelLoaded !== modelLevel || !currentWeights) {
    currentWeights = await loadModelWeights(modelLevel)
    modelLevelLoaded = modelLevel
  }
  return currentWeights
}

export function parseModelLevel(param: string | undefined): ModelLevel {
  const result = ModelLevelSchema.safeParse(param)
  if (!result.success) {
    throw new Error('Invalid model level value provided')
  }
  return Number(result.data) as ModelLevel
}

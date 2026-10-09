import { z } from 'zod'
import path from 'node:path'
import fs from 'node:fs/promises'
import { type ModelLevel, MODEL_LEVELS } from '~/types'

export type ModelWeights = Record<string, number[] | number[][]>

const weightsCache = new Map<ModelLevel, ModelWeights>()

export let currentWeights: ModelWeights | null = null

export async function loadModelWeights(
  level: ModelLevel,
  modelsPath: string,
): Promise<ModelWeights> {
  if (weightsCache.has(level)) {
    return weightsCache.get(level)!
  }

  try {
    const fileName = `engine_${level}.json`
    const filePath = path.isAbsolute(modelsPath)
      ? path.join(modelsPath, fileName)
      : path.join(process.cwd(), modelsPath, fileName)

    const fileContent = await fs.readFile(filePath, 'utf-8')
    const weights = JSON.parse(fileContent)

    weightsCache.set(level, weights)
    return weights
  } catch (e) {
    console.error(`[ERROR] Loading model weights for level ${level} was unsuccessful:`, e)
    throw e
  }
}

export const ModelLevelSchema = z.enum(
  MODEL_LEVELS.map((level) => level.toString()),
  {
    message: `Model level is invalid. Must be one of: ${MODEL_LEVELS.join(', ')}`,
  },
)

let modelLevelLoaded: ModelLevel | null = null

export async function ensureModelLoaded(
  modelLevel: ModelLevel,
  modelsPath: string,
): Promise<ModelWeights> {
  if (modelLevelLoaded !== modelLevel || !currentWeights) {
    currentWeights = await loadModelWeights(modelLevel, modelsPath)
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

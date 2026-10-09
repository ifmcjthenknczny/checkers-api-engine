import { type ModelWeights } from './model'

interface LinearWithBNArgs {
  input: number[]
  weight: number[][]
  bias: number[]
  runningMean?: number[] | null
  runningVar?: number[] | null
  gamma?: number[] | null
  beta?: number[] | null
  eps?: number
}

function linearWithBN({
  input,
  weight,
  bias,
  runningMean,
  runningVar,
  gamma,
  beta,
  eps = 1e-5,
}: LinearWithBNArgs): number[] {
  const outDim = bias.length
  const inDim = input.length
  const output = new Array(outDim).fill(0)

  for (let i = 0; i < outDim; i++) {
    let sum = 0
    for (let j = 0; j < inDim; j++) {
      sum += input[j] * weight[i][j]
    }
    sum += bias[i]

    if (runningMean && runningVar && gamma && beta) {
      const norm = (sum - runningMean[i]) / Math.sqrt(runningVar[i] + eps)
      sum = norm * gamma[i] + beta[i]
    }

    output[i] = sum
  }
  return output
}

function leakyRelu(arr: number[], negativeSlope = 0.1): number[] {
  return arr.map((x) => (x > 0 ? x : x * negativeSlope))
}

export function evaluateBoardUsingWeights(
  boardAndMove: number[],
  customWeights: ModelWeights,
): number {
  let x = linearWithBN({
    input: boardAndMove,
    weight: customWeights['network.0.weight'] as number[][],
    bias: customWeights['network.0.bias'] as number[],
    runningMean: customWeights['network.1.running_mean'] as number[],
    runningVar: customWeights['network.1.running_var'] as number[],
    gamma: customWeights['network.1.weight'] as number[],
    beta: customWeights['network.1.bias'] as number[],
  })
  x = leakyRelu(x, 0.1)

  x = linearWithBN({
    input: x,
    weight: customWeights['network.4.weight'] as number[][],
    bias: customWeights['network.4.bias'] as number[],
    runningMean: customWeights['network.5.running_mean'] as number[],
    runningVar: customWeights['network.5.running_var'] as number[],
    gamma: customWeights['network.5.weight'] as number[],
    beta: customWeights['network.5.bias'] as number[],
  })
  x = leakyRelu(x, 0.1)

  x = linearWithBN({
    input: x,
    weight: customWeights['network.7.weight'] as number[][],
    bias: customWeights['network.7.bias'] as number[],
    runningMean: customWeights['network.8.running_mean'] as number[],
    runningVar: customWeights['network.8.running_var'] as number[],
    gamma: customWeights['network.8.weight'] as number[],
    beta: customWeights['network.8.bias'] as number[],
  })
  x = leakyRelu(x, 0.1)

  x = linearWithBN({
    input: x,
    weight: customWeights['network.10.weight'] as number[][],
    bias: customWeights['network.10.bias'] as number[],
    runningMean: customWeights['network.11.running_mean'] as number[],
    runningVar: customWeights['network.11.running_var'] as number[],
    gamma: customWeights['network.11.weight'] as number[],
    beta: customWeights['network.11.bias'] as number[],
  })
  x = leakyRelu(x, 0.1)

  const finalLinear = linearWithBN({
    input: x,
    weight: customWeights['network.13.weight'] as number[][],
    bias: customWeights['network.13.bias'] as number[],
  })

  return Math.tanh(finalLinear[0])
}

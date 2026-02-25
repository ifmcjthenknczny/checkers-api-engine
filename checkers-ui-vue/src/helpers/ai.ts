// TODO: weź mi wyabstrahuj to tak by paramsem był player i board XD

export function pickAMove(
    legalMoves: Record<number, number[]>,
  ): { fromIndex: number; toIndex: number } | null {
    const keys = Object.keys(legalMoves).map(Number)
    if (keys.length === 0) return null
    const fromIndex = keys[Math.floor(Math.random() * keys.length)]
    const targets = legalMoves[fromIndex]
    const toIndex =
      targets.length === 1
        ? targets[0]
        : targets[Math.floor(Math.random() * targets.length)]
    return { fromIndex, toIndex }
  }
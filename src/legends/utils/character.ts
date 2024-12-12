const getDidEvolve = (oldLevel: number, newLevel: number) => {
  const oldEvolutionStage = Math.floor(oldLevel / 10)
  const newEvolutionStage = Math.floor(newLevel / 10)

  return newEvolutionStage > oldEvolutionStage
}

export { getDidEvolve }

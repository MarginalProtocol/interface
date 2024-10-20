export function filterPositionsByKey(id: any, indexedPositions: any) {
  const matchedObject = indexedPositions?.find((position: any) => position.id === id)
  return matchedObject || null
}

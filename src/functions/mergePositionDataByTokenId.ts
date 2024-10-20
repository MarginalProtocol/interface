import _ from "lodash"

export function mergePositionDataByTokenId(
  indexedPositions?: any[] | null,
  positionsState?: any[] | null,
): any[] {
  if (!_.isArray(indexedPositions) || !_.isArray(positionsState)) return []

  return positionsState?.map((state) => {
    const position = indexedPositions?.find((pos) => pos.tokenId === state?.tokenId)
    if (!position) {
      return state
    }
    return {
      ...state,
      ...position,
    }
  })
}

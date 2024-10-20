import _ from "lodash"

export function mergePositionDataWithState(
  positionQueryData?: {} | null,
  positionState?: {} | null,
) {
  if (!_.isObject(positionQueryData) || !_.isObject(positionState)) return {}
  return {
    ...positionQueryData,
    ...positionState,
  }
}

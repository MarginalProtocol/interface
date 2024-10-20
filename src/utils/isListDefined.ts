import _ from "lodash"

export const isListDefined = (list: any[]) => {
  return _.every(list, (item) => !_.isUndefined(item))
}

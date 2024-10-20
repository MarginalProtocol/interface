import _ from "lodash"

/** Covered Cases */

// isBlank(undefined) => true

// isBlank(null) => true

// isBlank('') => true

// isBlank([]) => true

// isBlank({}) => true

// isBlank(NaN) => true

// isBlank(0) => false

export const isBlank = (value: any) => {
  return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value)
}

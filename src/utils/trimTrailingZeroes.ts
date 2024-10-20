import { isUndefined } from "lodash"

export const trimTrailingZeroes = (input: string | undefined): string | undefined => {
  if (isUndefined(input)) {
    return undefined
  } else {
    const parts = input.split(".")

    if (parts.length === 2) {
      const integerPart = parts[0]
      let fractionalPart = parts[1]

      fractionalPart = fractionalPart.replace(/0+$/, "")

      if (fractionalPart.length > 0) {
        return `${integerPart}.${fractionalPart}`
      } else {
        return integerPart
      }
    }

    return input
  }
}

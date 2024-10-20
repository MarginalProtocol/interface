import { isUndefined } from "lodash"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"
import JSBI from "jsbi"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"

export const calculatePositionLeverage = (rawMargin?: bigint, rawSize?: bigint) => {
  if (isUndefined(rawMargin) || isUndefined(rawSize)) return undefined
  if (isOnlyZeroes(rawMargin.toString())) return undefined

  const formattedMargin = JSBI.BigInt(rawMargin.toString())
  const formattedSize = JSBI.BigInt(rawSize.toString())

  const totalSize = JSBI.add(formattedMargin, formattedSize)

  const extend = formatStringToBigInt("1", 6)

  let numerator
  let denominator
  let leverage

  if (extend) {
    numerator = JSBI.multiply(totalSize, JSBI.BigInt(extend.toString()))
    denominator = formattedMargin

    const divided = JSBI.divide(numerator, denominator).toString()

    leverage = formatBigIntToString(BigInt(divided), 6)
  }

  return leverage
}

import { isUndefined } from "lodash"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import JSBI from "jsbi"

export const calculateRelativeSqrtPriceDiff = (
  oraclePriceX96: string | undefined,
  liquidationPriceX96: string | undefined,
  zeroForOne: boolean,
) => {
  if (isUndefined(oraclePriceX96) || isUndefined(liquidationPriceX96)) return undefined

  let extend = JSBI.BigInt("1000000")
  let ratio

  let numerator
  let denominator

  const formattedOraclePriceX96 = JSBI.BigInt(oraclePriceX96.toString())
  const formattedLiquidationPriceX96 = JSBI.BigInt(liquidationPriceX96.toString())

  if (zeroForOne) {
    numerator = JSBI.multiply(formattedLiquidationPriceX96, extend)
    denominator = formattedOraclePriceX96

    ratio = JSBI.divide(numerator, denominator).toString()
  } else {
    numerator = JSBI.multiply(formattedOraclePriceX96, extend)
    denominator = formattedLiquidationPriceX96

    ratio = JSBI.divide(numerator, denominator).toString()
  }

  const parsed = formatBigIntToString(BigInt(ratio), 6)

  return parsed ? parseFloat(parsed) - 1 : null
}

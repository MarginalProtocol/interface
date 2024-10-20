import { isUndefined, isNull } from "lodash"
import { parseEther } from "ethers"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import JSBI from "jsbi"

export const calculatePositionRawPnL = (quotedAmountOut?: bigint, margin?: bigint) => {
  if (
    isUndefined(quotedAmountOut) ||
    isUndefined(margin) ||
    isNull(quotedAmountOut) ||
    isNull(margin)
  )
    return undefined

  const PnL = JSBI.subtract(
    JSBI.BigInt(quotedAmountOut.toString()),
    JSBI.BigInt(margin.toString()),
  )

  return PnL.toString()
}

export const calculatePnLByPercentage = (PnL?: string | null, margin?: bigint) => {
  if (isUndefined(PnL) || isNull(PnL) || isUndefined(margin) || !margin) return undefined

  const extend = JSBI.BigInt(parseEther("1").toString())

  const numerator = JSBI.multiply(JSBI.BigInt(PnL), extend)
  const denominator = JSBI.BigInt(margin.toString())

  const divided = JSBI.divide(numerator, denominator).toString()

  const parsed = formatBigIntToString(BigInt(divided), 18)

  return parsed ? parseFloat(parsed) * 100 : null
}

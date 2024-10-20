import { parseEther } from "ethers"
import { isUndefined } from "lodash"
import JSBI from "jsbi"
import { formatBigIntToString } from "../utils/formatBigIntToString"

export const convertX96FundingRate = (fundingRatioX96?: string) => {
  if (isUndefined(fundingRatioX96)) return null

  const extend = JSBI.BigInt(parseEther("1").toString())

  const denominator = JSBI.exponentiate(JSBI.BigInt("2"), JSBI.BigInt("96"))

  const numerator = JSBI.multiply(JSBI.BigInt(fundingRatioX96.toString()), extend)

  const divided = JSBI.divide(numerator, denominator).toString()

  const parsed = formatBigIntToString(BigInt(divided), 18)

  return parsed ? (parseFloat(parsed) - 1) * 100 : null
}

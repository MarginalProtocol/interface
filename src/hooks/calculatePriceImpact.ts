import { parseEther } from "ethers"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import JSBI from "jsbi"

export const calculatePriceImpact = (
  sqrtPriceX96After: string | undefined | null,
  sqrtPriceX96: string | undefined | null,
  zeroForOne: boolean,
) => {
  if (!sqrtPriceX96After || !sqrtPriceX96) return null

  let numerator
  let denominator
  const extend = JSBI.BigInt(parseEther("1").toString())

  if (zeroForOne) {
    numerator = JSBI.multiply(JSBI.BigInt(sqrtPriceX96.toString()), extend)
    denominator = JSBI.BigInt(sqrtPriceX96After.toString())
  } else {
    numerator = JSBI.multiply(JSBI.BigInt(sqrtPriceX96After.toString()), extend)
    denominator = JSBI.BigInt(sqrtPriceX96.toString())
  }

  const divided = JSBI.divide(numerator, denominator).toString()

  const parsed = formatBigIntToString(BigInt(divided), 18)

  return parsed ? (parseFloat(parsed) - 1) * 100 : null
}

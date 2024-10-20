import { parseEther } from "ethers"
import { isUndefined } from "lodash"
import { Token } from "src/types"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import JSBI from "jsbi"

export const convertX96Prices = (
  sqrtPriceX96: string | undefined,
  token0: Token | null | undefined,
  token1: Token | null | undefined,
) => {
  if (isUndefined(sqrtPriceX96)) return undefined
  if (!token0 || !token1) return undefined

  const extend = JSBI.BigInt(parseEther("1").toString())

  const denominator = JSBI.exponentiate(JSBI.BigInt("2"), JSBI.BigInt("192"))

  const numerator = JSBI.multiply(
    JSBI.exponentiate(JSBI.BigInt(sqrtPriceX96.toString()), JSBI.BigInt("2")),
    extend,
  )

  const divided = JSBI.divide(numerator, denominator).toString()

  const isSameDecimals = Number(token1.decimals) === Number(token0.decimals)
  const decimalDifference = Number(token1.decimals) - Number(token0.decimals)

  let parsed

  if (isSameDecimals) {
    parsed = formatBigIntToString(BigInt(divided), 18)
  } else {
    parsed = formatBigIntToString(BigInt(divided), 18 + decimalDifference)
  }

  return parsed
}

export const convertX96PricesToBigInt = (sqrtPriceX96?: string) => {
  if (isUndefined(sqrtPriceX96)) return undefined

  const extend = JSBI.BigInt(parseEther("1").toString())

  const denominator = JSBI.exponentiate(JSBI.BigInt("2"), JSBI.BigInt("192"))

  const numerator = JSBI.multiply(
    JSBI.exponentiate(JSBI.BigInt(sqrtPriceX96.toString()), JSBI.BigInt("2")),
    extend,
  )

  const divided = JSBI.divide(numerator, denominator).toString()

  return divided
}

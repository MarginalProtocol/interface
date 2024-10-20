import { isUndefined } from "lodash"
import JSBI from "jsbi"

export function calculatePoolLiquidityTokenAmounts(
  liquidity?: bigint,
  sqrtPriceX96?: bigint,
) {
  if (isUndefined(liquidity) || isUndefined(sqrtPriceX96))
    return { token0: null, token1: null }

  const bitwiseShift96 = JSBI.exponentiate(JSBI.BigInt("2"), JSBI.BigInt("96"))

  const liquidity_JSBI = JSBI.BigInt(liquidity.toString())
  const sqrtPriceX96_JSBI = JSBI.BigInt(sqrtPriceX96.toString())

  const token0 = JSBI.divide(
    JSBI.multiply(liquidity_JSBI, bitwiseShift96),
    sqrtPriceX96_JSBI,
  )

  const token1 = JSBI.divide(
    JSBI.multiply(liquidity_JSBI, sqrtPriceX96_JSBI),
    bitwiseShift96,
  )

  return {
    token0: token0.toString(),
    token1: token1.toString(),
  }
}

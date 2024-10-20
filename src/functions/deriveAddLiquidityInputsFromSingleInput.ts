import JSBI from "jsbi"

export const deriveAddLiquidityInputsFromSingleInput = (
  desiredAmount: string | undefined,
  isToken0: boolean,
  poolPriceX96?: string,
) => {
  let amount0 = null
  let amount1 = null

  if (!poolPriceX96 || !desiredAmount) {
    return {
      amount0,
      amount1,
    }
  }

  const poolPriceX96_JSBI = JSBI.BigInt(poolPriceX96)
  const squaredPoolPriceX96_JSBI = JSBI.exponentiate(poolPriceX96_JSBI, JSBI.BigInt("2"))
  const bitwiseLeftShift_JSBI = JSBI.exponentiate(JSBI.BigInt("2"), JSBI.BigInt("192"))

  if (isToken0) {
    amount0 = desiredAmount

    const amount0_JSBI = JSBI.BigInt(amount0)

    const numerator = JSBI.multiply(amount0_JSBI, squaredPoolPriceX96_JSBI)
    const denominator = bitwiseLeftShift_JSBI

    const amount1_JSBI = JSBI.divide(numerator, denominator)

    amount1 = amount1_JSBI.toString()
  } else {
    amount1 = desiredAmount

    const amount1_JSBI = JSBI.BigInt(amount1)

    const numerator = JSBI.multiply(amount1_JSBI, bitwiseLeftShift_JSBI)
    const denominator = squaredPoolPriceX96_JSBI

    const amount0_JSBI = JSBI.divide(numerator, denominator)

    amount0 = amount0_JSBI.toString()
  }

  return {
    amount0,
    amount1,
  }
}

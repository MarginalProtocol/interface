import { AddLiquidityParams } from "src/hooks/useViewQuoteAddLiquidity"
import JSBI from "jsbi"

export const deriveAddLiquidityParamsWithSlippage = (
  addLiquidityParams: AddLiquidityParams | null,
  addLiquidityQuote: any,
  maxSlippage: string,
) => {
  if (!addLiquidityParams || !addLiquidityQuote) return null

  const bump = 100000
  const rawAmount0_JSBI = JSBI.BigInt(addLiquidityQuote.amount0.toString())
  const rawAmount1_JSBI = JSBI.BigInt(addLiquidityQuote.amount1.toString())

  const effectiveSlippagePercentage = 100 - parseFloat(maxSlippage)
  const bumpedEffectiveSlippagePercentage = effectiveSlippagePercentage * bump
  const bumpedEffectiveSlippagePercentage_JSBI = JSBI.BigInt(
    bumpedEffectiveSlippagePercentage,
  )

  const bumpedMinAmount0 = JSBI.multiply(
    rawAmount0_JSBI,
    bumpedEffectiveSlippagePercentage_JSBI,
  )
  const bumpedMinAmount1 = JSBI.multiply(
    rawAmount1_JSBI,
    bumpedEffectiveSlippagePercentage_JSBI,
  )

  const derivedMinAmount0ByPercentage = JSBI.divide(bumpedMinAmount0, JSBI.BigInt(bump))
  const derivedMinAmount0ByDecimal =
    parseFloat(derivedMinAmount0ByPercentage.toString()) / 100

  const derivedMinAmount1ByPercentage = JSBI.divide(bumpedMinAmount1, JSBI.BigInt(bump))
  const derivedMinAmount1ByDecimal =
    parseFloat(derivedMinAmount1ByPercentage.toString()) / 100

  return {
    ...addLiquidityParams,
    amount0Min: BigInt(Math.floor(derivedMinAmount0ByDecimal)),
    amount1Min: BigInt(Math.floor(derivedMinAmount1ByDecimal)),
  }
}

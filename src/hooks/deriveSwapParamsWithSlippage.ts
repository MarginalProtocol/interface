import { ExactInputSingleParams } from "./useViewQuoteExactInputSingle"
import { formatStringToBigInt } from "src/utils/formatStringToBigInt"

export const deriveSwapParamsWithSlippage = (
  swapParams: ExactInputSingleParams | null,
  swapQuote: any,
  zeroForOne: boolean,
  poolPrice: string | undefined,
  maxSlippage: string,
) => {
  if (!swapParams) {
    return null
  }

  if (!swapQuote) {
    return null
  }

  if (!poolPrice) {
    return null
  }

  // Currently calculating only amountOutMinimum slippage
  const amountInDesired = BigInt(swapParams.amountIn.toString())
  const marginalPoolPrice = BigInt(poolPrice)

  const bump = formatStringToBigInt("1", 18)
  const bumpedAmountInDesired: bigint | undefined = bump && amountInDesired * bump

  const amountOutWithoutSlippage = bumpedAmountInDesired
    ? zeroForOne
      ? bumpedAmountInDesired * marginalPoolPrice
      : bumpedAmountInDesired / marginalPoolPrice
    : undefined

  const effectiveSlippage: string = (100 - parseFloat(maxSlippage)).toString()
  const slippageNumerator = formatStringToBigInt(effectiveSlippage, 18)
  const slippageDenominator = formatStringToBigInt("100", 18)

  const bumpedEffectiveSlippagePercentage =
    bump &&
    slippageNumerator &&
    slippageDenominator &&
    (slippageNumerator * bump) / slippageDenominator

  const bumpedMinAmountOut =
    amountOutWithoutSlippage &&
    bumpedEffectiveSlippagePercentage &&
    amountOutWithoutSlippage * bumpedEffectiveSlippagePercentage

  const derivedAmountOutMinimumByPercentage =
    bump && bumpedMinAmountOut
      ? zeroForOne
        ? (bumpedMinAmountOut * 100n) / (bump * bump * bump)
        : (bumpedMinAmountOut * 100n) / bump
      : undefined

  const derivedAmountOutMinimumByDecimal =
    derivedAmountOutMinimumByPercentage &&
    parseFloat(derivedAmountOutMinimumByPercentage.toString()) / 100

  return {
    ...swapParams,
    amountOutMinimum: derivedAmountOutMinimumByDecimal
      ? BigInt(Math.floor(derivedAmountOutMinimumByDecimal))
      : 0n,
  }
}

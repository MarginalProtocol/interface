import { MintParams } from "../hooks/useViewQuoteMint"
import { MintQuote } from "../hooks/useViewQuoteMint"
import { formatStringToBigInt } from "./../utils/formatStringToBigInt"

export const deriveMintParamsWithSlippage = (
  mintParams: MintParams | null,
  mintQuote: MintQuote | null,
  zeroForOne: boolean,
  poolPrice: string | undefined,
  maxSlippage: string,
) => {
  if (!mintQuote || !mintParams || !poolPrice) return null

  // calculate derived size minumum
  const rawSize: bigint = BigInt(mintQuote.size.toString())

  const effectiveSizeSlippage: string = (100 - parseFloat(maxSlippage)).toString()
  const slippageNumerator = formatStringToBigInt(effectiveSizeSlippage, 18)
  const slippageDenominator = formatStringToBigInt("100", 18)

  const bump = formatStringToBigInt("1", 18)

  const bumpedEffectiveSizePercentage: bigint | undefined =
    bump &&
    slippageNumerator &&
    slippageDenominator &&
    (slippageNumerator * bump) / slippageDenominator

  const bumpedSizeMinimum =
    bumpedEffectiveSizePercentage && rawSize * bumpedEffectiveSizePercentage

  const derivedSizeMinimumByPercentage =
    bump && bumpedSizeMinimum && (bumpedSizeMinimum * 100n) / bump

  const derivedSizeMinimumByDecimal =
    derivedSizeMinimumByPercentage &&
    parseFloat(derivedSizeMinimumByPercentage.toString()) / 100

  // calculate derived debt maximum
  const bumpedSizeDesired: bigint | undefined = bump && rawSize * bump
  const marginalPoolPrice = BigInt(poolPrice)

  const debtWithoutSlippage = bumpedSizeDesired
    ? zeroForOne
      ? bumpedSizeDesired / marginalPoolPrice
      : bumpedSizeDesired * marginalPoolPrice
    : undefined

  const effectiveDebtSlippage: string = (100 + parseFloat(maxSlippage)).toString()
  const debtSlippageNumerator = formatStringToBigInt(effectiveDebtSlippage, 18)
  const debtSlippageDenominator = formatStringToBigInt("100", 18)

  const bumpedEffectiveDebtPercentage =
    bump &&
    debtSlippageNumerator &&
    debtSlippageDenominator &&
    (debtSlippageNumerator * bump) / debtSlippageDenominator

  const bumpedDebtMaximum =
    bumpedEffectiveDebtPercentage &&
    debtWithoutSlippage &&
    debtWithoutSlippage * bumpedEffectiveDebtPercentage

  const derivedDebtMaximumByPercentage =
    bump && bumpedDebtMaximum
      ? zeroForOne
        ? (bumpedDebtMaximum * 100n) / bump
        : (bumpedDebtMaximum * 100n) / (bump * bump * bump)
      : undefined

  const derivedDebtMaximumByDecimal =
    derivedDebtMaximumByPercentage &&
    parseFloat(derivedDebtMaximumByPercentage.toString()) / 100

  return {
    ...mintParams,
    sizeMinimum: derivedSizeMinimumByDecimal
      ? BigInt(Math.floor(derivedSizeMinimumByDecimal))
      : 0n,
    debtMaximum: derivedDebtMaximumByDecimal
      ? BigInt(Math.ceil(derivedDebtMaximumByDecimal))
      : 0n,
  }
}

import { isNull, isUndefined } from "lodash"
import { formatBigIntToString } from "src/utils/formatBigIntToString"

export const calculateAPRQuotePercentageRate = (rawAPRQuotePercentageRate?: bigint) => {
  if (isUndefined(rawAPRQuotePercentageRate) || isNull(rawAPRQuotePercentageRate))
    return undefined

  const formattedAPRPercentageRate = formatBigIntToString(
    rawAPRQuotePercentageRate,
    18,
    2,
  )

  const formattedAPRPercentage = !isUndefined(formattedAPRPercentageRate)
    ? parseFloat(formattedAPRPercentageRate) * 100
    : 0

  return formattedAPRPercentage
}

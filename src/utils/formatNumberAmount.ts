import { isNull, isUndefined } from "lodash"
import { trimTrailingZeroes } from "./trimTrailingZeroes"

export function formatNumberAmount(
  parsedAmount: string | null | undefined,
  showTraceAmounts: boolean = false,
) {
  if (isUndefined(parsedAmount) || isNull(parsedAmount)) return null

  const balance = parseFloat(parsedAmount ?? "0")

  if (showTraceAmounts) {
    return trimTrailingZeroes(
      Intl.NumberFormat("en-US", {
        notation: "compact",
        minimumSignificantDigits: 3,
        maximumSignificantDigits: 4,
      }).format(balance),
    )
  } else {
    if (balance > 0.1) {
      return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(balance)
    } else if (balance > 0.0001) {
      return Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 4,
      }).format(balance)
    } else if (balance === 0) {
      return "0.0"
    } else {
      return "< 0.0001"
    }
  }
}

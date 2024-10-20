export function calculatePercentageOfTotal(
  totalAmount: string | null | undefined,
  partialAmount: string | null | undefined,
) {
  if (!totalAmount || !partialAmount) {
    return 0
  }

  const total = parseFloat(totalAmount)
  const available = parseFloat(partialAmount)

  if (isNaN(total) || isNaN(available) || total === 0) {
    return 0
  }

  return (available / total) * 100
}

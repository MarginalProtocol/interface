export function uint24ToDecimal(uint24Value: bigint | string): number {
  // Convert to decimal by dividing by 1,000,000 (removing 6 decimal places).
  const decimalValue = Number(uint24Value) / 1_000_000
  return decimalValue
}

import { formatUnits } from "ethers"

export const getMaxLeverage = (maintenance: string): number => {
  if (!maintenance) {
    return 0
  }
  const parsedMaintenance = Number(formatUnits(maintenance, 6))

  const addedLeverage = 1 / parsedMaintenance
  const totalLeverage = 1 + addedLeverage

  return totalLeverage
}

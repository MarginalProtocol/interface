import { formatUnits } from "ethers"
import { isUndefined } from "lodash"

export const getPoolMaxLeverage = (maintenance?: string): number | undefined => {
  if (isUndefined(maintenance)) return undefined

  const parsedMaintenance = Number(formatUnits(maintenance, 6))

  const addedLeverage = 1 / parsedMaintenance
  const totalLeverage = 1 + addedLeverage

  return totalLeverage
}

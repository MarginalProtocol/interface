import { uint24ToDecimal } from "../utils/uint24ToDecimal"

export const convertMaintenanceToLeverage = (maintenance: string): number => {
  const parsedMaintenance = uint24ToDecimal(maintenance)

  const addedLeverage = 1 / parsedMaintenance
  const totalLeverage = 1 + addedLeverage

  return totalLeverage
}

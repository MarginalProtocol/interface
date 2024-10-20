import bigDecimal from "js-big-decimal"

export const calculateHealthFactor = (margin: string, safeMarginMinimum: string) => {
  if (!margin || !safeMarginMinimum) return null

  const margin_BD = new bigDecimal(margin)
  const safeMarginMinimum_BD = new bigDecimal(safeMarginMinimum)

  if (parseFloat(safeMarginMinimum_BD.getValue()) > 0) {
    const healthFactor_BD = margin_BD.divide(safeMarginMinimum_BD)
    const healthFactor = parseFloat(healthFactor_BD.getValue())

    return healthFactor
  } else {
    return 0
  }
}

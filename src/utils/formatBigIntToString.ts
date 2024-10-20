import { isUndefined } from "lodash"

export const formatBigIntToString = (
  bi?: bigint | null,
  nativePrecision?: number | string,
  decimalPlaces?: number,
) => {
  let decimalPrecision: number

  if (isUndefined(nativePrecision)) {
    return
  }

  if (typeof nativePrecision === "string") {
    decimalPrecision = Number(nativePrecision)
  } else {
    decimalPrecision = nativePrecision
  }

  if (typeof bi !== "bigint" && !bi) {
    return
  }

  try {
    if (bi === 0n) {
      return "0.0"
    }

    const isNegative = bi < 0n

    if (isNegative) {
      bi = -bi
    }

    let str = bi.toString().padStart(decimalPrecision, "0")
    const idx = str.length - decimalPrecision
    str = `${str.slice(0, idx)}.${str.slice(idx)}`

    if (str.startsWith(".")) {
      str = "0" + str
    }

    if (decimalPlaces !== undefined) {
      const decimalIdx = str.indexOf(".")
      str = str.slice(0, decimalIdx + decimalPlaces + 1)
    }

    if (isNegative) {
      str = "-" + str
    }

    return str
  } catch (error) {}
}

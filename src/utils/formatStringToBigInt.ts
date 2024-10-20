import { isUndefined } from "lodash"

export const formatStringToBigInt = (rawVal: string, rawDecimals?: number | string) => {
  let decimals: number

  if (isUndefined(rawDecimals)) {
    return undefined
  }

  if (typeof rawDecimals === "string") {
    decimals = Number(rawDecimals)
  } else {
    decimals = rawDecimals
  }

  if (typeof rawVal !== "string" && !rawVal) {
    return 0n
  }

  try {
    let value = rawVal.replace(/[$,]/g, "")
    if ([".", "0.", "", ".0"].includes(value)) {
      return 0n
    }
    if (value.startsWith(".")) {
      value = `0${value}`
    }

    const scaleFactor = BigInt(10 ** decimals)

    const [wholePart, fractionalPart = "0"] = value.split(".")

    const wholeBigInt = BigInt(wholePart) * scaleFactor

    const fractionalBigInt = BigInt(
      fractionalPart.padEnd(decimals, "0").slice(0, decimals),
    )

    return wholeBigInt + fractionalBigInt
  } catch (error) {}
}

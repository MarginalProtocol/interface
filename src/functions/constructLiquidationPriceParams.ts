import _ from "lodash"
import { BigNumberish } from "ethers"
import { getValidAddress } from "../utils/getValidAddress"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import { Token } from "../types"
import { convertInputToSize } from "./constructQuoteMintParams"

export type LiquidationPriceParams = {
  zeroForOne: boolean
  size: string
  debt: string
  margin: bigint
  maintenance: string
}

export const constructLiquidationPriceParams = (
  inputValue: string,
  marginToken: Token | null,
  token1: Token | null,
  quotedSize: string | undefined,
  quotedDebt: string | undefined,
  maintenance: string | undefined,
): LiquidationPriceParams | null => {
  const marginTokenAddress = getValidAddress(marginToken?.address)
  const token1Address = getValidAddress(token1?.address)

  if (!marginTokenAddress || !token1Address) return null
  if (!marginToken) return null
  if (!maintenance) return null
  if (!inputValue || isOnlyZeroes(inputValue)) return null
  if (!quotedSize || !quotedDebt) return null

  return {
    zeroForOne: marginTokenAddress === token1Address,
    size: quotedSize,
    debt: quotedDebt,
    margin: convertInputToSize(inputValue, marginToken?.decimals) ?? 0n,
    maintenance: maintenance,
  }
}

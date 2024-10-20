import { Token } from "../types"
import { getAddress } from "viem"
import { WRAPPED_GAS_TOKEN_MAP } from "src/constants/tokens"

export const isWrappedGasToken = (token: Token | null | undefined, chainId: number) => {
  if (!token) return false
  return getAddress(token.address) === getAddress(WRAPPED_GAS_TOKEN_MAP[chainId].address)
}

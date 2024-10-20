import { zeroAddress } from "viem"
import { Token } from "../types"
import { getValidAddress } from "../utils/getValidAddress"
import { TokenInfo } from "@uniswap/token-lists"

export const checkIfTokenIsTradeable = (
  token: Token | TokenInfo | null,
  tokensWithPools: Set<string>,
) => {
  if (!token) return false
  if (token.address === zeroAddress) return true
  return tokensWithPools.has(getValidAddress(token.address))
}

import { Token } from "../types"
import { getValidAddress } from "../utils/getValidAddress"
import { TokenInfo } from "@uniswap/token-lists"

export function deduplicateTokenOptions(
  defaultTokensList: TokenInfo[],
  tokenOptions: Token[],
) {
  const tokensMap = new Map()

  defaultTokensList.forEach((token) => {
    tokensMap.set(getValidAddress(token.address), token)
  })

  tokenOptions.forEach((token) => {
    if (!tokensMap.has(getValidAddress(token.address))) {
      tokensMap.set(getValidAddress(token.address), token)
    }
  })

  return Array.from(tokensMap.values())
}

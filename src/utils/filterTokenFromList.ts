import { TokenInfo } from "@uniswap/token-lists"
import { Token } from "../types"
import { getValidAddress } from "./getValidAddress"
import { isWrappedGasToken } from "./isWrappedGasToken"

export const filterTokenFromList = (
  tokens: Token[],
  filterToken?: Token | null,
): Token[] => {
  return filterToken
    ? tokens.filter(
        (token) =>
          getValidAddress(token.address) !== getValidAddress(filterToken.address),
      )
    : tokens
}

// TODO: Replace with a dynamic function to exclude certain tokens,
// or create function that filters for a list of tokens
export const filterTokenFromListWithoutWrappedGasToken = (
  tokens: (Token | TokenInfo)[] | null | undefined,
  chainId: number,
): (Token | TokenInfo)[] => {
  return (
    tokens?.filter(
      (token: Token | TokenInfo | null | undefined) => !isWrappedGasToken(token, chainId),
    ) || []
  )
}

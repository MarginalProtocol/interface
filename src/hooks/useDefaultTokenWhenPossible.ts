import { useMemo } from "react"
import { Token } from "../types"
import { getValidAddress } from "../utils/getValidAddress"
import { TokenInfo } from "@uniswap/token-lists"

export function useDefaultTokenWhenPossible(
  checkToken: Token | undefined | null,
  defaultTokens: TokenInfo[],
): Token | null {
  return useMemo(() => {
    if (!checkToken) return null

    const defaultToken = defaultTokens.find(
      (token) => getValidAddress(token.address) === getValidAddress(checkToken.address),
    )

    return defaultToken || checkToken
  }, [checkToken, defaultTokens])
}

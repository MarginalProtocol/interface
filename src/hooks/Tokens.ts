import { ChainId, Currency, Token } from "@uniswap/sdk-core"
import { DEFAULT_INACTIVE_LIST_URLS, DEFAULT_LIST_OF_LISTS } from "../constants/lists"
import { TokenAddressMap } from "../state/lists/tokensToChainTokenMap"
import { useMemo } from "react"

import { useAllLists, useCombinedActiveList } from "../state/lists/hooks"
import { TokenFromList } from "../state/lists/tokenFromList"
import { getTokenFilter } from "../state/lists/getTokenFilter"
import { useNetwork } from "wagmi"
import { useTokenFromMapOrNetwork } from "./useTokenFromActiveNetwork"

type Maybe<T> = T | null | undefined

// reduce token map into standard address <-> Token mapping, optionally include user added tokens
function useTokensFromMap(
  tokenMap: TokenAddressMap,
  chainId: Maybe<ChainId>,
): { [address: string]: Token } {
  return useMemo(() => {
    if (!chainId) return {}

    // reduce to just tokens
    return Object.keys(tokenMap[chainId] ?? {}).reduce<{ [address: string]: Token }>(
      (newMap, address) => {
        newMap[address] = tokenMap[chainId][address].token
        return newMap
      },
      {},
    )
  }, [chainId, tokenMap])
}

/** Returns all tokens from the default list + user added tokens */
export function useDefaultActiveTokens(chainId: Maybe<ChainId>): {
  [address: string]: Token
} {
  const defaultListTokens = useCombinedActiveList()

  const tokensFromMap = useTokensFromMap(defaultListTokens, chainId)
  return useMemo(() => {
    return tokensFromMap
  }, [tokensFromMap])
}

type BridgeInfo = Record<
  ChainId,
  {
    tokenAddress: string
    originBridgeAddress: string
    destBridgeAddress: string
  }
>

export function useSearchInactiveTokenLists(
  search: string | undefined,
  minResults = 10,
): TokenFromList[] {
  const lists = useAllLists()
  const inactiveUrls = DEFAULT_INACTIVE_LIST_URLS
  const { chain } = useNetwork()
  const activeTokens = useDefaultActiveTokens(chain?.id)
  return useMemo(() => {
    if (!search || search.trim().length === 0) return []
    const tokenFilter = getTokenFilter(search)
    const result: TokenFromList[] = []
    const addressSet: { [address: string]: true } = {}
    for (const url of inactiveUrls) {
      const list = lists[url]?.current
      if (!list) continue
      for (const tokenInfo of list.tokens) {
        if (tokenInfo.chainId === chain?.id && tokenFilter(tokenInfo)) {
          try {
            const wrapped: TokenFromList = new TokenFromList(tokenInfo, list)
            if (!(wrapped.address in activeTokens) && !addressSet[wrapped.address]) {
              addressSet[wrapped.address] = true
              result.push(wrapped)
              if (result.length >= minResults) return result
            }
          } catch {
            continue
          }
        }
      }
    }
    return result
  }, [activeTokens, chain?.id, inactiveUrls, lists, minResults, search])
}

// undefined if invalid or does not exist
// null if loading or null was passed
// otherwise returns the token
export function useToken(
  tokenAddress?: string | null,
  chainId?: number,
): Token | null | undefined {
  const { chain } = useNetwork()
  const tokens = useDefaultActiveTokens(chain?.id)
  return useTokenFromMapOrNetwork(tokens, tokenAddress, chainId)
}

import { useMemo } from "react"
import { useAppSelector } from "../../store/hooks"
import { AppState } from "../../store"
import sortByListPriority from "../../utils/listSort"
import { TokenAddressMap, tokensToChainTokenMap } from "./tokensToChainTokenMap"

import { DEFAULT_ACTIVE_LIST_URLS } from "./../../constants/lists"
import tokensJson from "src/constants/tokens.json"

type Mutable<T> = {
  -readonly [P in keyof T]: Mutable<T[P]>
}

export function useAllLists(): AppState["lists"]["byUrl"] {
  return useAppSelector((state) => state.lists.byUrl)
}

/**
 * Combine the tokens in map2 with the tokens on map1, where tokens on map1 take precedence
 * @param map1 the base token map
 * @param map2 the map of additioanl tokens to add to the base map
 */
function combineMaps(map1: TokenAddressMap, map2: TokenAddressMap): TokenAddressMap {
  const chainIds = Object.keys(
    Object.keys(map1)
      .concat(Object.keys(map2))
      .reduce<{ [chainId: string]: true }>((memo, value) => {
        memo[value] = true
        return memo
      }, {}),
  ).map((id) => parseInt(id))

  return chainIds.reduce<Mutable<TokenAddressMap>>((memo, chainId) => {
    memo[chainId] = {
      ...map2[chainId],
      // map1 takes precedence
      ...map1[chainId],
    }
    return memo
  }, {}) as TokenAddressMap
}

// merge tokens contained within lists from urls
export function useCombinedTokenMapFromUrls(urls: string[] | undefined): TokenAddressMap {
  const lists = useAllLists()

  return useMemo(() => {
    // Convert tokensJson to TokenAddressMap format
    const tokensFromJson = tokensToChainTokenMap(tokensJson)

    // Start with tokensFromJson as the base
    let combinedTokens = { ...tokensFromJson }

    if (!urls) return combinedTokens

    return (
      urls
        .slice()
        // sort by priority so top priority goes last
        .sort(sortByListPriority)
        .reduce((allTokens, currentUrl) => {
          const current = lists[currentUrl]?.current
          if (!current) return allTokens
          try {
            // Combine tokens from the current list and the current combinedTokens
            combinedTokens = combineMaps(tokensToChainTokenMap(current), combinedTokens)

            return combineMaps(allTokens, combinedTokens)
          } catch (error) {
            console.error("Could not show token list due to error", error)
            return allTokens
          }
        }, combinedTokens)
    )
  }, [lists, urls])
}

// get all the tokens from active lists, combine with local default tokens
export function useCombinedActiveList(): TokenAddressMap {
  const activeTokens = useCombinedTokenMapFromUrls(DEFAULT_ACTIVE_LIST_URLS)

  return activeTokens
}

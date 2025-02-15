import { nanoid } from "@reduxjs/toolkit"
import { ChainId } from "@uniswap/sdk-core"
import { TokenList } from "@uniswap/token-lists"
import { RPC_PROVIDERS } from "../constants/providers"
import getTokenList from "../state/lists/fetchTokenList"
import resolveENSContentHash from "../utils/resolveENSContentHash"
import { useCallback } from "react"
import { useAppDispatch } from "../store/hooks"

import { fetchTokenList } from "../state/lists/actions"

export function useFetchListCallback(): (
  listUrl: string,
  skipValidation?: boolean,
) => Promise<TokenList> {
  const dispatch = useAppDispatch()
  const providers = RPC_PROVIDERS

  return useCallback(
    async (listUrl: string, skipValidation?: boolean) => {
      const requestId = nanoid()
      dispatch(fetchTokenList.pending({ requestId, url: listUrl }))
      return getTokenList(
        listUrl,
        (ensName: string) => resolveENSContentHash(ensName, providers[ChainId.MAINNET]),
        skipValidation,
      )
        .then((tokenList) => {
          dispatch(fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId }))
          return tokenList
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error)
          dispatch(
            fetchTokenList.rejected({
              url: listUrl,
              requestId,
              errorMessage: error.message,
            }),
          )
          throw error
        })
    },
    [dispatch, providers],
  )
}

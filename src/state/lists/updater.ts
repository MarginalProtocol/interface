import { getVersionUpgrade, VersionUpgrade } from "@uniswap/token-lists"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { DEFAULT_LIST_OF_LISTS, UNSUPPORTED_LIST_URLS } from "../../constants/lists"
import useInterval from "../../hooks/useInterval"
import ms from "ms"
import { useCallback, useEffect } from "react"
import { useAllLists } from "../../state/lists/hooks"
import { useNetwork } from "wagmi"

import { useFetchListCallback } from "../../hooks/useFetchListCallback"
import useIsWindowVisible from "../../hooks/useIsWindowVisible"
import { acceptListUpdate } from "./actions"
import { publicClient } from "../.."

export default function Updater(): null {
  const { chain } = useNetwork()
  const dispatch = useAppDispatch()
  const isWindowVisible = useIsWindowVisible()

  // get all loaded lists, and the active urls
  const lists = useAllLists()

  const listsState = useAppSelector((state) => state.lists)

  const fetchList = useFetchListCallback()
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return
    DEFAULT_LIST_OF_LISTS.forEach((url) => {
      // Skip validation on unsupported lists
      const isUnsupportedList = UNSUPPORTED_LIST_URLS.includes(url)
      fetchList(url, isUnsupportedList).catch((error) =>
        console.debug("interval list fetching error", error),
      )
    })
  }, [fetchList, isWindowVisible])

  // fetch all lists every 10 minutes, but only after we initialize provider
  useInterval(
    fetchAllListsCallback,
    publicClient({ chainId: chain?.id ?? 1 }) ? ms(`10m`) : null,
  )

  useEffect(() => {
    // whenever a list is not loaded and not loading, try again to load it
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) =>
          console.debug("list added fetching error", error),
        )
      }
    })
    UNSUPPORTED_LIST_URLS.forEach((listUrl) => {
      const list = lists[listUrl]
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl, /* isUnsupportedList= */ true).catch((error) =>
          console.debug("list added fetching error", error),
        )
      }
    })
  }, [dispatch, fetchList, lists])

  // automatically update lists for every version update
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl]
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(list.current.version, list.pendingUpdate.version)
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error("unexpected no version bump")
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR:
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl))
        }
      }
    })
  }, [dispatch, lists])

  return null
}

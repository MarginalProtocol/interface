import _ from "lodash"
import { useMemo, useEffect } from "react"
import { useLazyGetPositionsQuery } from "../services/subgraph/generated"
import { useApplicationState } from "src/state/application/hooks"
import { Address } from "viem"

export const usePositionsQuery = (connectedAddress: Address | undefined) => {
  const { chainId } = useApplicationState()
  const [fetchPositions, queryState] = useLazyGetPositionsQuery()

  useEffect(() => {
    if (connectedAddress) {
      const address = connectedAddress.toLowerCase() // subgraph stores address in lowercase
      fetchPositions({ address })
    }
  }, [connectedAddress, chainId, fetchPositions])

  return useMemo(() => {
    if (!connectedAddress) {
      return {
        positions: null,
        isLoading: null,
      }
    }
    return {
      positions: queryState?.data?.positions,
      isLoading: queryState?.isUninitialized || queryState?.isLoading,
    }
  }, [queryState, connectedAddress])
}

import _ from "lodash"
import { useMemo, useEffect } from "react"
import { useGetPoolsQuery } from "../services/subgraph/generated"
import { useApplicationState } from "src/state/application/hooks"

export const usePoolsQuery = () => {
  const { chainId } = useApplicationState()

  const { data, isLoading, isFetching, isError, refetch } = useGetPoolsQuery()

  const poolsExist = !_.isUndefined(data) && !_.isEmpty(data)

  useEffect(() => {
    refetch()
  }, [refetch, chainId])

  return useMemo(
    () => ({
      pools: poolsExist ? data.pools : [],
      hasPools: poolsExist,
      isLoading,
      isFetching,
      isError,
    }),
    [data?.pools],
  )
}

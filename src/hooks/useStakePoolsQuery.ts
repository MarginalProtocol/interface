import _ from "lodash"
import { useMemo, useEffect } from "react"
import { useGetStakePoolsQuery } from "../services/subgraph/generated"
import { useApplicationState } from "src/state/application/hooks"
import { V1_MULTIREWARDS_FACTORY_ADDRESS } from "src/constants/addresses"

export const useStakePoolsQuery = () => {
  const { chainId } = useApplicationState()

  const { data, isLoading, isFetching, isError, refetch } = useGetStakePoolsQuery({
    factoryId: V1_MULTIREWARDS_FACTORY_ADDRESS[chainId] ?? undefined,
  })

  const isValid = !_.isUndefined(data) && !_.isEmpty(data)
  const stakePools = isValid ? data?.multiRewardsFactory?.stakePools : []

  return useMemo(
    () => ({
      stakePools,
      refetch,
      isLoading,
      isFetching,
      isError,
    }),
    [stakePools, refetch],
  )
}

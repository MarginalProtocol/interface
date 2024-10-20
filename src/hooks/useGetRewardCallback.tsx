import { useState } from "react"
import { useContractWrite, Address, usePrepareContractWrite } from "wagmi"
import _ from "lodash"
import { getContractError } from "./../utils/getContractError"
import MultiRewardsAbi from "../abis/MultiRewards.json"

export const useGetRewardCallback = (
  spenderAddress: Address | undefined,
  isApproved: boolean,
) => {
  const [error, setError] = useState<any>(undefined)

  const isValidProps = !_.isUndefined(spenderAddress) && isApproved

  const { config } = usePrepareContractWrite({
    address: spenderAddress,
    abi: MultiRewardsAbi,
    functionName: "getReward",
    enabled: isValidProps,
    onError(error: Error) {
      let contractError = getContractError(error, "getReward")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)

  return {
    getRewardCallback: writeAsync,
    getRewardError: error,
  }
}

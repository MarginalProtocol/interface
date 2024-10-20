import { useState, useEffect } from "react"
import { useContractWrite, Address, usePrepareContractWrite } from "wagmi"
import _ from "lodash"
import { getContractError } from "./../utils/getContractError"
import { isBlank } from "../utils/isBlank"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import MultiRewardsAbi from "../abis/MultiRewards.json"

export const useStakeCallback = (
  spenderAddress: Address | undefined,
  inputValue: string,
  amount: bigint | undefined,
  isApproved: boolean,
  chainId: number,
) => {
  const [error, setError] = useState<any>(undefined)

  const isInputValid = !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  const isValidProps =
    !_.isUndefined(spenderAddress) && !_.isUndefined(amount) && isInputValid && isApproved

  const { config } = usePrepareContractWrite({
    address: spenderAddress,
    abi: MultiRewardsAbi,
    functionName: "stake",
    args: [amount],
    enabled: isValidProps,
    onError(error: Error) {
      let contractError = getContractError(error, "stake")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)

  useEffect(() => {
    if (!isInputValid) {
      setError(null)
    }
  }, [inputValue])

  return {
    stakeCallback: writeAsync,
    amount,
    stakeError: error,
  }
}

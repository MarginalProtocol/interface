import { useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { ExactInputSingleParams } from "./useViewQuoteExactInputSingle"
import { V1_ROUTER_ADDRESS } from "../constants/addresses"
import { isNull } from "lodash"
import { getContractError } from "./../utils/getContractError"
import marginalV1RouterAbi from "../abis/MarginalV1Router.json"
import { parseEther } from "viem"

export const useExactInputSingleCallback = (
  inputValue: string,
  exactInputSingleParams: ExactInputSingleParams | null,
  isApproved: boolean,
  isEth: boolean,
  chainId: number,
) => {
  const [error, setError] = useState<any>(undefined)

  const isValidProps = !isNull(exactInputSingleParams) && isApproved

  const { config } = usePrepareContractWrite({
    address: V1_ROUTER_ADDRESS[chainId],
    abi: marginalV1RouterAbi,
    functionName: "exactInputSingle",
    args: [exactInputSingleParams],
    value: isEth ? parseEther(inputValue) : undefined,
    enabled: isValidProps,
    cacheTime: 2_000,
    onError(error: Error) {
      let contractError = getContractError(error, "exactInputSingle")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const { data, isLoading, isSuccess, writeAsync, reset } = useContractWrite(config)

  return {
    exactInputSingleCallback: writeAsync,
    reset,
    exactInputSingleError: error,
  }
}

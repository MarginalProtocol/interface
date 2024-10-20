import { useState, useEffect } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { isNull } from "lodash"
import { getContractError } from "./../utils/getContractError"
import { isBlank } from "../utils/isBlank"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import { V1_ROUTER_ADDRESS } from "../constants/addresses"
import marginalV1RouterAbi from "../abis/MarginalV1Router.json"
import { RemoveLiquidityParams } from "../functions/constructRemoveLiquidityParams"

export const useRemoveLiquidityCallback = (
  inputValue: string,
  removeLiquidityParams: RemoveLiquidityParams | null,
  isApproved: boolean,
  chainId: number,
) => {
  const [error, setError] = useState<any>(undefined)

  const isInputValid = !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  const isValidProps = !isNull(removeLiquidityParams) && isInputValid && isApproved

  const { config } = usePrepareContractWrite({
    address: V1_ROUTER_ADDRESS[chainId],
    abi: marginalV1RouterAbi,
    functionName: "removeLiquidity",
    args: [removeLiquidityParams],
    enabled: isValidProps,
    onError(error: Error) {
      let contractError = getContractError(error, "removeLiquidity")
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
    removeLiquidityCallback: writeAsync,
    removeLiquidityParams,
    removeLiquidityError: error,
  }
}

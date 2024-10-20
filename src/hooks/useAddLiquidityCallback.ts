import { useState, useEffect } from "react"
import { useContractWrite, Address, usePrepareContractWrite } from "wagmi"
import { parseEther } from "viem"
import { isNull, isUndefined } from "lodash"
import { getContractError } from "./../utils/getContractError"
import { isBlank } from "../utils/isBlank"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import { AddLiquidityParams } from "./useViewQuoteAddLiquidity"
import { V1_ROUTER_ADDRESS } from "../constants/addresses"
import marginalV1RouterAbi from "../abis/MarginalV1Router.json"

export const useAddLiquidityCallback = (
  inputValueA: string,
  inputValueB: string,
  ethValue: string | null | undefined,
  addLiquidityParams: AddLiquidityParams | null,
  isApproved: boolean,
  chainId: number,
) => {
  const [error, setError] = useState<any>(undefined)

  const isInputAValid = !isBlank(inputValueA) && !isOnlyZeroes(inputValueA)
  const isInputBValid = !isBlank(inputValueB) && !isOnlyZeroes(inputValueB)
  const isValidProps =
    !isNull(addLiquidityParams) && isInputAValid && isInputBValid && isApproved

  const { config, refetch } = usePrepareContractWrite({
    address: V1_ROUTER_ADDRESS[chainId],
    abi: marginalV1RouterAbi,
    functionName: "addLiquidity",
    args: [addLiquidityParams],
    value: ethValue ? parseEther(ethValue) : undefined,
    enabled: isValidProps,
    onError(error: Error) {
      let contractError = getContractError(error, "addLiquidity")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(config)

  useEffect(() => {
    if (!isInputAValid || !isInputBValid) {
      setError(null)
    }
  }, [inputValueA, inputValueB])

  return {
    addLiquidityCallback: writeAsync,
    addLiquidityParams,
    addLiquidityError: error,
    refetch,
  }
}

import { isNull } from "lodash"
import { useState, useEffect } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import marginalV1NonfungiblePositionManagerAbi from "../abis/MarginalV1NonfungiblePositionManager.json"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "../constants/addresses"
import { getContractError } from "./../utils/getContractError"
import { IgniteParams } from "../functions/constructQuoteIgniteParams"

export const useIgniteCallback = (igniteParams: IgniteParams | null, chainId: number) => {
  const [error, setError] = useState<any>(undefined)

  const isValidProps = !isNull(igniteParams)

  const { config } = usePrepareContractWrite({
    address: V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    abi: marginalV1NonfungiblePositionManagerAbi,
    functionName: "ignite",
    args: [igniteParams],
    enabled: isValidProps,
    cacheTime: 2_000,
    onError(error: Error) {
      let contractError = getContractError(error, "free")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const { data, isLoading, isSuccess, writeAsync, reset } = useContractWrite(config)

  return {
    igniteCallback: writeAsync,
    igniteParams,
    reset,
    freeError: error,
  }
}

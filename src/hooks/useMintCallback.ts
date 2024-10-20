import { useState, useEffect } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { MintParams } from "./useViewQuoteMint"
import marginalV1NonfungiblePositionManagerAbi from "../abis/MarginalV1NonfungiblePositionManager.json"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "../constants/addresses"
import { parseEther } from "viem"
import { isNull, isString } from "lodash"
import { getContractError } from "./../utils/getContractError"
import { isBlank } from "../utils/isBlank"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"

export const useMintCallback = (
  inputValue: string,
  mintParams: MintParams | null,
  escrowRewards: string | null | undefined,
  isApproved: boolean,
  chainId: number,
) => {
  const [error, setError] = useState<any>(undefined)

  const isValidProps = !isNull(mintParams) && isString(escrowRewards) && isApproved

  const { config, refetch } = usePrepareContractWrite({
    address: V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    abi: marginalV1NonfungiblePositionManagerAbi,
    functionName: "mint",
    args: [mintParams],
    value: escrowRewards ? parseEther(escrowRewards) : parseEther("0.012"),
    enabled: isValidProps,
    onError(error: Error) {
      console.log("error: ", error)

      let contractError = getContractError(error, "mint")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const {
    data,
    isLoading,
    isSuccess,
    writeAsync,
    reset,
    error: asyncError,
  } = useContractWrite(config)

  useEffect(() => {
    if (isBlank(inputValue) || isOnlyZeroes(inputValue)) {
      setError(null)
    }
    if (!isValidProps) {
      setError(null)
    }
  }, [inputValue, isValidProps])

  return {
    mintCallback: writeAsync,
    mintParams: mintParams,
    refetch,
    reset,
    mintError: error,
  }
}

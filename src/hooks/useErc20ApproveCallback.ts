import { useCallback } from "react"
import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  erc20ABI,
  Address,
} from "wagmi"
import { isUndefined } from "lodash"
import { zeroAddress, maxUint256 } from "viem"

export const useErc20ApproveCallback = (
  tokenAddress: Address | undefined,
  spenderAddress: Address | undefined,
  amount: bigint | undefined,
) => {
  const isValidProps =
    !isUndefined(tokenAddress) && !isUndefined(spenderAddress) && !isUndefined(amount)

  const { config } = usePrepareContractWrite({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [spenderAddress ?? zeroAddress, amount ?? 0n],
    enabled: isValidProps,
  })

  const { data, write, isSuccess, isLoading } = useContractWrite(config)

  return {
    data,
    approveCallback: write,
    isSuccess,
  }
}

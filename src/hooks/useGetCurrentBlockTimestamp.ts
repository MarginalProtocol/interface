import { useContractRead, Address } from "wagmi"
import multicallAbi from "src/abis/multicall.json"
import { isListDefined } from "src/utils/isListDefined"

const MULTICALL3_ADDRESS: Address = `0xcA11bde05977b3631167028862bE2a173976CA11`

export const useGetCurrentBlockTimestamp = (chainId: number): bigint | undefined => {
  const isEnabled = isListDefined([chainId])

  const { data, isError, isLoading, refetch, error } = useContractRead({
    address: MULTICALL3_ADDRESS,
    abi: multicallAbi,
    functionName: "getCurrentBlockTimestamp",
    enabled: isEnabled,
    chainId: chainId,
  })

  if (typeof data === "bigint") {
    return data
  } else {
    return undefined
  }
}

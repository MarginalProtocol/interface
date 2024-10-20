import { useContractRead, Address } from "wagmi"
import multicallAbi from "src/abis/multicall.json"
import { isListDefined } from "src/utils/isListDefined"
import { formatBigIntToString } from "src/utils/formatBigIntToString"

const MULTICALL3_ADDRESS: Address = `0xcA11bde05977b3631167028862bE2a173976CA11`

export const useNativeTokenBalance = (owner?: string, chainId?: number) => {
  const isEnabled = isListDefined([owner, chainId])

  const { data, isError, isLoading, refetch, error } = useContractRead({
    address: MULTICALL3_ADDRESS,
    abi: multicallAbi,
    functionName: "getEthBalance",
    args: [owner],
    enabled: isEnabled,
    chainId: chainId,
  })

  if (typeof data === "bigint") {
    return {
      balance: data,
      parsedBalance: formatBigIntToString(data, 18),
      shortenedParsedBalance: formatBigIntToString(data, 18, 4),
    }
  } else {
    return {
      balance: undefined,
      parsedBalance: undefined,
      shortenedParsedBalance: undefined,
    }
  }
}

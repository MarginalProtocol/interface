import { useContractRead, erc20ABI, Address } from "wagmi"
import { isUndefined } from "lodash"

export const useErc20TokenSymbol = (tokenAddress: Address | undefined) => {
  const isValidProps = !isUndefined(tokenAddress)

  const { data: symbol } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "symbol",
    enabled: isValidProps,
    watch: true,
    cacheTime: 2_000,
  })

  return symbol
}

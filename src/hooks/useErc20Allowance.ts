import { useContractRead, erc20ABI, Address } from "wagmi"
import { isUndefined } from "lodash"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { trimTrailingZeroes } from "../utils/trimTrailingZeroes"

export const useErc20Allowance = (
  tokenAddress: Address | undefined,
  decimals: number | string | undefined,
  spenderAddress: Address,
  ownerAddress: Address,
) => {
  const isValidProps = !isUndefined(tokenAddress) && !isUndefined(decimals)

  const { data: allowance, refetch } = useContractRead({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [ownerAddress, spenderAddress],
    enabled: isValidProps,
    watch: true,
    cacheTime: 2_000,
    onSuccess(data) {
      console.log(`fetched from useErc20Allowance for spender ${spenderAddress}: `, data)
    },
    onError(error) {
      console.log("error in useErc20Allowance():", error)
    },
  })

  const parsedAllowance = isUndefined(allowance)
    ? undefined
    : trimTrailingZeroes(formatBigIntToString(allowance, decimals, 8))

  return {
    allowance,
    parsedAllowance,
    refetchAllowance: refetch,
  }
}

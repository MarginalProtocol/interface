import { Address, useContractRead } from "wagmi"
import UniswapV3PoolAbi from "../abis/UniswapV3Pool.json"
import { isListDefined } from "../utils/isListDefined"

export const useUniswapPoolFee = (poolAddress: Address | undefined) => {
  const isValidProps = isListDefined([poolAddress])

  const { data, isError, isLoading } = useContractRead({
    address: poolAddress as Address,
    abi: UniswapV3PoolAbi,
    functionName: "fee",
    enabled: isValidProps,
    watch: true,
    cacheTime: 5000,
  })

  const fee = data ?? undefined

  return fee
}

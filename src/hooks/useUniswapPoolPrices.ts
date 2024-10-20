import _ from "lodash"
import { Address, useContractRead } from "wagmi"
import UniswapV3PoolAbi from "../abis/UniswapV3Pool.json"
import { isListDefined } from "../utils/isListDefined"

export const useUniswapPoolPrices = (poolAddress: Address | undefined) => {
  const isValidProps = isListDefined([poolAddress])

  const { data, isError, isLoading } = useContractRead({
    address: poolAddress as Address,
    abi: UniswapV3PoolAbi,
    functionName: "slot0",
    enabled: isValidProps,
    watch: true,
    cacheTime: 5_000,
  })

  const poolData: any[] = _.isArray(data) ? data : []

  return {
    sqrtPriceX96: poolData[0],
    tick: poolData[1],
    observationIndex: poolData[2],
    observationCardinality: poolData[3],
    observationCardinalityNext: poolData[4],
    feeProtocol: poolData[5],
    unlocked: poolData[6],
  }
}

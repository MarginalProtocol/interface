import _ from "lodash"
import { Address, useContractRead } from "wagmi"
import marginalV1PoolAbi from "../abis/MarginalV1Pool.json"
import { PoolState } from "../types"

export const useViewPoolsState = (poolAddress: string): PoolState => {
  const { data, isError, isLoading } = useContractRead({
    address: poolAddress as Address,
    abi: marginalV1PoolAbi,
    functionName: "state",
  })

  const state: any[] = _.isArray(data) ? data : []

  return {
    sqrtPriceX96: state[0],
    totalPositions: state[1],
    liquidity: state[2],
    tick: state[3],
    blockTimestamp: state[4],
    tickCumulative: state[5],
    feeProtocol: state[6],
    initialized: state[7],
  }
}

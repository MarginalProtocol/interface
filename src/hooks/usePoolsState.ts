import { Address, multicall } from "@wagmi/core"
import { useContractReads } from "wagmi"
import { isEmpty } from "lodash"
import marginalV1PoolAbi from "../abis/MarginalV1Pool.json"
import { PoolData } from "../types"

export const usePoolsState = (pools: PoolData[], chainId?: number) => {
  let contracts: any[] = []

  pools.forEach((pool) => {
    if (!isEmpty(pool) && chainId) {
      contracts.push(createContractRead(pool?.poolAddress as Address, chainId))
    }
  })

  const isEnabled = !isEmpty(contracts)

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    enabled: isEnabled,
  })

  return data?.map((poolData: any, idx: number) => {
    const state = poolData.result
    return {
      pool: pools[idx],
      sqrtPriceX96: state ? state[0] : null,
      totalPositions: state ? state[1] : null,
      liquidity: state ? state[2] : null,
      tick: state ? state[3] : null,
      blockTimestamp: state ? state[4] : null,
      tickCumulative: state ? state[5] : null,
      feeProtocol: state ? state[6] : null,
      initialized: state ? state[7] : null,
    }
  })
}

const createContractRead = (poolAddress: Address, chainId: number) => {
  return {
    address: poolAddress,
    abi: marginalV1PoolAbi,
    functionName: "state",
    chainId: chainId,
  }
}

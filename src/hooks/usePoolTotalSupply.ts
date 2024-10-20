import _ from "lodash"
import { useContractReads, Address } from "wagmi"
import { PoolData } from "../types"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import MarginalV1PoolAbi from "../abis/MarginalV1Pool.json"

const createContractRead = (poolAddress: Address) => {
  return {
    address: poolAddress,
    abi: MarginalV1PoolAbi,
    functionName: "totalSupply",
    // args: [ownerAddress],
  }
}

export const usePoolTotalSupply = (
  pools: (PoolData | undefined | null)[],
  // owner?: string,
) => {
  let contracts: any[] = []

  pools.forEach((pool) => {
    if (!_.isEmpty(pool)) {
      contracts.push(createContractRead(pool?.poolAddress as Address))
    }
  })

  const isEnabled = !_.isEmpty(contracts)

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    enabled: isEnabled,
  })

  return data?.map((fetchTotalSupply, index: number) => {
    const totalSupply = fetchTotalSupply?.result as bigint
    const parsedTotalSupply = formatBigIntToString(totalSupply, pools[index]?.decimals, 4)
    return {
      pool: pools[index],
      totalSupply,
      parsedTotalSupply,
    }
  })

  // return data
}

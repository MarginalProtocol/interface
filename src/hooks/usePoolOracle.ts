import { Address, useContractRead } from "wagmi"
import { isListDefined } from "../utils/isListDefined"
import MarginalV1PoolAbi from "../abis/MarginalV1Pool.json"

export const usePoolOracle = (poolAddress?: Address) => {
  const isValidProps = isListDefined([poolAddress])

  const { data, isError, isLoading } = useContractRead({
    address: poolAddress as Address,
    abi: MarginalV1PoolAbi,
    functionName: "oracle",
    enabled: isValidProps,
    watch: false,
  })

  const oracle = data ?? undefined

  return oracle
}

import { isUndefined, isString } from "lodash"
import { Address, useContractRead } from "wagmi"
import marginalV1PoolAbi from "../abis/MarginalV1Pool.json"

export const useViewPoolOracle = (poolAddress: string): string | undefined => {
  const isValidProp = !isUndefined(poolAddress)

  const { data, isError, isLoading } = useContractRead({
    address: poolAddress as Address,
    abi: marginalV1PoolAbi,
    functionName: "oracle",
    enabled: isValidProp,
  })

  const oracleAddress = isString(data) ? data : undefined

  return oracleAddress
}

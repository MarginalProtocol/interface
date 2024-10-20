import _ from "lodash"
import { Address, useContractRead } from "wagmi"
import { V1_ORACLE_ADDRESS } from "../constants/addresses"
import marginalV1OracleAbi from "../abis/MarginalV1Oracle.json"
import { isListDefined } from "../utils/isListDefined"

export const useOraclePoolPrices = (
  chainId: number,
  token0?: Address,
  token1?: Address,
  maintenance?: string,
  oracle?: Address,
) => {
  const isValidProps = isListDefined([token0, token1, maintenance, oracle])

  const { data, isError, isLoading } = useContractRead({
    address: V1_ORACLE_ADDRESS[chainId],
    abi: marginalV1OracleAbi,
    args: [{ token0, token1, maintenance, oracle }],
    functionName: "sqrtPricesX96",
    enabled: isValidProps,
    watch: true,
    cacheTime: 5_000,
  })

  const prices: any[] = _.isArray(data) ? data : []

  return {
    sqrtPriceX96: prices[0],
    oracleSqrtPriceX96: prices[1],
    fundingRatioX96: prices[2],
    isLoading,
  }
}

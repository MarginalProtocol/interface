import _ from "lodash"
import { useContractReads, erc20ABI, Address } from "wagmi"
import { PoolData, Token } from "../types"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import MarginalV1PoolAbi from "../abis/MarginalV1Pool.json"

const createContractRead = (poolAddress: Address, ownerAddress: Address) => {
  return {
    address: poolAddress,
    abi: MarginalV1PoolAbi,
    functionName: "balanceOf",
    args: [ownerAddress],
  }
}

export const useUserPoolBalance = (
  pools: (PoolData | undefined | null)[],
  owner?: string,
  userStakedBalance?: bigint,
) => {
  let contracts: any[] = []

  pools.forEach((pool) => {
    if (!_.isEmpty(pool)) {
      contracts.push(createContractRead(pool?.poolAddress as Address, owner as Address))
    }
  })

  const isEnabled = !_.isEmpty(contracts) && !_.isEmpty(owner)

  const { data, isError, isLoading, refetch } = useContractReads({
    contracts: contracts,
    enabled: isEnabled,
  })

  const balances = data?.map((fetchedBalance, index: number) => {
    const rawBalance = fetchedBalance?.result as bigint
    const parsedBalance = formatBigIntToString(rawBalance, pools[index]?.decimals, 4)
    const fullParsedBalance = formatBigIntToString(rawBalance, pools[index]?.decimals)

    const rawBalanceWithStaked = userStakedBalance
      ? (fetchedBalance?.result as bigint) + userStakedBalance
      : undefined
    const parsedBalanceWithStaked = formatBigIntToString(
      rawBalanceWithStaked,
      pools[index]?.decimals,
      4,
    )
    const fullParsedBalanceWithStaked = formatBigIntToString(
      rawBalanceWithStaked,
      pools[index]?.decimals,
    )

    return {
      pool: pools[index],
      balance: rawBalance,
      parsedBalance: parsedBalance,
      fullParsedBalance: fullParsedBalance,
      balanceWithStaked: rawBalanceWithStaked,
      parsedBalanceWithStaked: parsedBalanceWithStaked,
      fullParsedBalanceWithStaked: fullParsedBalanceWithStaked,
    }
  })

  return {
    balances,
    refetch,
  }

  // return data
}

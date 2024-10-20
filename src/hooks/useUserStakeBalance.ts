import _ from "lodash"
import { useContractReads, Address } from "wagmi"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import MultiRewardsAbi from "../abis/MultiRewards.json"
import { type PoolData } from "src/types"

const createContractRead = (stakeAddress: Address, ownerAddress: Address) => {
  return {
    address: stakeAddress,
    abi: MultiRewardsAbi,
    functionName: "balanceOf",
    args: [ownerAddress],
  }
}

export const useUserStakeBalance = (stakePool: PoolData | undefined, owner?: string) => {
  let contracts: any[] = []

  if (stakePool?.stakePool) {
    contracts.push(createContractRead(stakePool?.stakePool as Address, owner as Address))
  }

  const isEnabled = !_.isEmpty(contracts) && !_.isEmpty(owner)

  const { data, isError, isLoading, refetch } = useContractReads({
    contracts: contracts,
    enabled: isEnabled,
  })

  const balances = data?.map((fetchedBalance, index: number) => {
    const rawBalance = fetchedBalance?.result as bigint
    const parsedBalance = formatBigIntToString(rawBalance, stakePool?.decimals, 4)
    const fullParsedBalance = formatBigIntToString(rawBalance, stakePool?.decimals)
    return {
      stakePoolAddress: stakePool?.stakePool,
      balance: rawBalance,
      parsedBalance: parsedBalance,
      fullParsedBalance: fullParsedBalance,
    }
  })

  return {
    balances,
    refetch,
  }
}

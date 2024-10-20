import _ from "lodash"
import { useContractReads, Address } from "wagmi"
import MultiRewardsAbi from "../abis/MultiRewards.json"

const createContractRead = (stakeAddress: Address, tokenAddress: Address) => {
  return {
    address: stakeAddress,
    abi: MultiRewardsAbi,
    functionName: "rewardData",
    args: [tokenAddress],
  }
}

export const useMultiRewardsData = (
  stakeAddress: string | undefined,
  tokenAddress?: string,
) => {
  let contracts: any[] = []

  if (stakeAddress) {
    contracts.push(createContractRead(stakeAddress as Address, tokenAddress as Address))
  }

  const isEnabled =
    !_.isEmpty(contracts) && !_.isEmpty(tokenAddress) && !_.isEmpty(stakeAddress)

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    enabled: isEnabled,
  })

  // return data?.map((fetchedBalance, index: number) => {
  //   const rawBalance = fetchedBalance?.result as bigint
  //   const parsedBalance = formatBigIntToString(rawBalance, decimals, 4)
  //   const fullParsedBalance = formatBigIntToString(rawBalance, decimals)
  //   return {
  //     balance: rawBalance,
  //     parsedBalance: parsedBalance,
  //     fullParsedBalance: fullParsedBalance,
  //   }
  // })
  return data?.[0]?.result
}

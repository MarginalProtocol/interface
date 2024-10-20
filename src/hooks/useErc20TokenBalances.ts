import _ from "lodash"
import { useContractReads, erc20ABI, Address } from "wagmi"
import { Token } from "../types"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import multicallAbi from "src/abis/multicall.json"
import { zeroAddress } from "viem"

export const useErc20TokenBalances = (
  tokens: (Token | undefined | null)[],
  owner?: string,
) => {
  let contracts: any[] = []

  tokens.forEach((token) => {
    if (!_.isEmpty(token)) {
      if (token?.address === zeroAddress) {
        contracts.push(createMulticallContractRead(owner as Address))
      } else {
        contracts.push(createContractRead(token?.address as Address, owner as Address))
      }
    }
  })

  const isEnabled = !_.isEmpty(contracts) && !_.isEmpty(owner)

  const { data, isError, isLoading, refetch } = useContractReads({
    contracts: contracts,
    enabled: isEnabled,
  })

  const balances = data?.map((fetchedBalance, index: number) => {
    const rawBalance = fetchedBalance?.result as bigint
    const shortenedParsedBalance = formatBigIntToString(
      rawBalance,
      tokens[index]?.decimals,
      4,
    )
    const parsedBalance = formatBigIntToString(rawBalance, tokens[index]?.decimals)
    return {
      token: tokens[index],
      balance: rawBalance,
      shortenedParsedBalance: shortenedParsedBalance,
      parsedBalance: parsedBalance,
    }
  })

  return {
    balances,
    refetch,
  }
}

const createContractRead = (tokenAddress: Address, ownerAddress: Address) => {
  return {
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "balanceOf",
    args: [ownerAddress],
  }
}

const createMulticallContractRead = (ownerAddress: Address) => {
  const multicall3Address: Address = "0xcA11bde05977b3631167028862bE2a173976CA11"

  return {
    address: multicall3Address,
    abi: multicallAbi,
    functionName: "getEthBalance",
    args: [ownerAddress],
  }
}

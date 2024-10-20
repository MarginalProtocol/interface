import { useState, useEffect } from "react"
import { isUndefined } from "lodash"
import { Address, readContract, fetchBalance } from "@wagmi/core"
import { zeroAddress } from "viem"
import { erc20ABI } from "wagmi"
import { trimTrailingZeroes } from "../utils/trimTrailingZeroes"
import { formatBigIntToString } from "../utils/formatBigIntToString"

export const getErc20TokenAllowance = async ({
  tokenAddress,
  ownerAddress,
  spenderAddress,
  chainId,
}: {
  tokenAddress: Address
  ownerAddress: Address
  spenderAddress: Address
  chainId: number
}): Promise<bigint> => {
  const allowance = await readContract({
    address: tokenAddress,
    chainId,
    abi: erc20ABI,
    functionName: "allowance",
    args: [ownerAddress, spenderAddress],
  })

  return allowance
}

export const useErc20TokenAllowance = (
  tokenAddress: Address,
  tokenDecimals: number,
  ownerAddress: Address | undefined,
  spenderAddress: Address,
  chainId: number | undefined,
): {
  allowance: bigint | undefined
  parsedAllowance: string | undefined
  fetchAllowance: () => Promise<void>
} => {
  const [allowance, setAllowance] = useState<bigint | undefined>(undefined)

  const fetchAllowance = async () => {
    if (!ownerAddress) {
      throw new Error("Missing owner address")
    }
    if (!chainId) {
      throw new Error("Missing chain id")
    }

    try {
      if (tokenAddress === zeroAddress) {
        const fetchedBalance = await fetchBalance({
          address: ownerAddress,
          chainId,
        })
        setAllowance(fetchedBalance?.value)
      } else {
        const allowance = await getErc20TokenAllowance({
          tokenAddress,
          ownerAddress,
          spenderAddress,
          chainId,
        })
        setAllowance(allowance)
      }
    } catch (error) {
      console.error("Error fetching allowance: ", error)
    }
  }

  useEffect(() => {
    setAllowance(undefined)
  }, [tokenAddress, tokenDecimals, ownerAddress, spenderAddress, chainId])

  const parsedAllowance = isUndefined(allowance)
    ? undefined
    : trimTrailingZeroes(formatBigIntToString(allowance, tokenDecimals, 18))

  return { allowance, parsedAllowance, fetchAllowance }
}

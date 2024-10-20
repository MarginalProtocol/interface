import { formatStringToBigInt } from "./../utils/formatStringToBigInt"
import { isNull } from "lodash"
import { useState, useEffect } from "react"
import { useContractWrite, Address, usePrepareContractWrite } from "wagmi"
import marginalV1NonfungiblePositionManagerAbi from "../abis/MarginalV1NonfungiblePositionManager.json"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "../constants/addresses"
import { getValidAddress } from "../utils/getValidAddress"
import { getContractError } from "./../utils/getContractError"
import { Token } from "../types"
import { BigNumberish, parseEther } from "ethers"

interface LockParams {
  token0: Address
  token1: Address
  maintenance: string
  oracle: Address
  tokenId: string
  marginIn: bigint
  deadline: BigNumberish
}

const MAX_DEADLINE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

// TODO: Error handle when args missing / invalid
// Add custom deadline functionality
export const constructLockParams = (
  token0: Token | undefined | null,
  token1: Token | undefined | null,
  maintenance: string | undefined,
  oracle: string | undefined,
  tokenId: string | undefined,
  marginIn: string | undefined,
  marginToken: Token | undefined | null,
  currentBlockTimestamp: bigint | undefined,
  transactionDeadline: string,
): LockParams | null => {
  const token0Address = getValidAddress(token0?.address)
  const token1Address = getValidAddress(token1?.address)
  const oracleAddress = getValidAddress(oracle)

  if (!token0Address || !token1Address) return null
  if (!oracleAddress) return null
  if (!tokenId) return null
  if (!maintenance) return null
  if (!marginIn) return null
  if (!marginToken) return null

  return {
    token0: token0Address,
    token1: token1Address,
    maintenance,
    oracle: oracleAddress,
    tokenId: tokenId,
    marginIn: formatStringToBigInt(marginIn, marginToken.decimals) ?? 0n,
    deadline: currentBlockTimestamp
      ? currentBlockTimestamp + BigInt(transactionDeadline) * BigInt("60")
      : MAX_DEADLINE,
  }
}

export const useLockCallback = (
  lockParams: LockParams | null,
  ethValue: string | null | undefined,
  isApproved: boolean,
  chainId: number,
) => {
  const [error, setError] = useState<any>(undefined)

  const isValidProps = !isNull(lockParams)

  const { config, refetch } = usePrepareContractWrite({
    address: V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    abi: marginalV1NonfungiblePositionManagerAbi,
    functionName: "lock",
    args: [lockParams],
    value: ethValue ? parseEther(ethValue) : undefined,
    enabled: isValidProps,
    onError(error: Error) {
      let contractError = getContractError(error, "lock")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const { data, isLoading, isSuccess, writeAsync, reset } = useContractWrite(config)

  return {
    lockCallback: writeAsync,
    lockParams,
    refetch,
    freeError: error,
  }
}

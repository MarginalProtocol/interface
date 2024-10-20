import { isNull } from "lodash"
import { useState, useEffect } from "react"
import { useContractWrite, Address, usePrepareContractWrite } from "wagmi"
import marginalV1NonfungiblePositionManagerAbi from "../abis/MarginalV1NonfungiblePositionManager.json"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "../constants/addresses"
import { getValidAddress } from "../utils/getValidAddress"
import { getContractError } from "./../utils/getContractError"
import { Token } from "../types"
import { BigNumberish } from "ethers"

interface FreeParams {
  token0: Address
  token1: Address
  maintenance: string
  oracle: Address
  tokenId: string
  marginOut: string
  recipient: Address
  deadline: BigNumberish
}

const MAX_DEADLINE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

// TODO: Error handle when args missing / invalid
// Add custom deadline functionality
export const constructFreeParams = (
  token0: Token | undefined | null,
  token1: Token | undefined | null,
  maintenance: string | undefined,
  oracle: string | undefined,
  tokenId: string | undefined,
  marginOut: string | undefined,
  recipient: string | undefined,
  currentBlockTimestamp: bigint | undefined,
  transactionDeadline: string,
): FreeParams | null => {
  const token0Address = getValidAddress(token0?.address)
  const token1Address = getValidAddress(token1?.address)
  const oracleAddress = getValidAddress(oracle)
  const recipientAddress = getValidAddress(recipient)

  if (!token0Address || !token1Address) return null
  if (!oracleAddress) return null
  if (!recipientAddress) return null
  if (!tokenId) return null
  if (!maintenance) return null
  if (!marginOut) return null

  return {
    token0: token0Address,
    token1: token1Address,
    maintenance,
    oracle: oracleAddress,
    tokenId: tokenId,
    marginOut: marginOut,
    recipient: recipientAddress,
    deadline: currentBlockTimestamp
      ? currentBlockTimestamp + BigInt(transactionDeadline) * BigInt("60")
      : MAX_DEADLINE,
  }
}

export const useFreeCallback = (freeParams: FreeParams | null, chainId: number) => {
  const [error, setError] = useState<any>(undefined)

  const isValidProps = !isNull(freeParams)

  const { config } = usePrepareContractWrite({
    address: V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    abi: marginalV1NonfungiblePositionManagerAbi,
    functionName: "free",
    args: [freeParams],
    enabled: isValidProps,
    cacheTime: 2_000,
    onError(error: Error) {
      let contractError = getContractError(error, "free")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  const { data, isLoading, isSuccess, writeAsync, reset } = useContractWrite(config)

  return {
    freeCallback: writeAsync,
    freeParams,
    reset,
    freeError: error,
  }
}

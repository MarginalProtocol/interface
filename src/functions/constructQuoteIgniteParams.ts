import { Address } from "wagmi"
import { getValidAddress } from "../utils/getValidAddress"
import { Token } from "../types"
import { BigNumberish } from "ethers"

export interface IgniteParams {
  token0: Address
  token1: Address
  maintenance: string
  oracle: Address
  tokenId: string
  amountOutMinimum: bigint | string
  recipient: Address
  deadline: BigNumberish
}

const MAX_DEADLINE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

export const constructIgniteParams = (
  token0: Token | undefined | null,
  token1: Token | undefined | null,
  maintenance: string | undefined,
  oracle: string | undefined,
  tokenId: string | undefined,
  amountOutMinimum: string | undefined,
  recipient: string | undefined,
  currentBlockTimestamp: bigint | undefined,
  transactionDeadline: string,
): IgniteParams | null => {
  const token0Address = getValidAddress(token0?.address)
  const token1Address = getValidAddress(token1?.address)
  const oracleAddress = getValidAddress(oracle)
  const recipientAddress = getValidAddress(recipient)

  if (!token0Address || !token1Address) return null
  if (!oracleAddress) return null
  if (!recipientAddress) return null
  if (!tokenId) return null
  if (!maintenance) return null
  if (!amountOutMinimum) return null

  return {
    token0: token0Address,
    token1: token1Address,
    maintenance,
    oracle: oracleAddress,
    tokenId: tokenId,
    amountOutMinimum: amountOutMinimum,
    recipient: recipientAddress,
    deadline: currentBlockTimestamp
      ? currentBlockTimestamp + BigInt(transactionDeadline) * BigInt("60")
      : MAX_DEADLINE,
  }
}

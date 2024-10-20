import _ from "lodash"
import { BigNumberish } from "ethers"
import { getValidAddress } from "../utils/getValidAddress"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import { Token } from "../types"

export type RemoveLiquidityParams = {
  token0: string
  token1: string
  maintenance: string
  oracle: string
  recipient: string
  shares: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: BigNumberish
}

const MAX_DEADLINE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

export const constructRemoveLiquidityParams = (
  inputValue: string,
  token0: Token | null,
  token1: Token | null,
  decimals: string | undefined,
  maintenance: string | undefined,
  oracle: string | undefined,
  recipient: string,
  currentBlockTimestamp: bigint | undefined,
  transactionDeadline: string,
): RemoveLiquidityParams | null => {
  const token0Address = getValidAddress(token0?.address)
  const token1Address = getValidAddress(token1?.address)
  const oracleAddress = getValidAddress(oracle)
  const recipientAddress = getValidAddress(recipient)

  if (!token0Address || !token1Address) return null
  if (!token0 || !token1) return null
  if (!oracleAddress) return null
  if (!recipientAddress) return null
  if (!maintenance) return null
  if (!decimals) return null
  if (!inputValue || isOnlyZeroes(inputValue)) return null

  return {
    token0: token0Address,
    token1: token1Address,
    maintenance: maintenance,
    oracle: oracleAddress,
    recipient: recipientAddress,
    shares: formatStringToBigInt(inputValue, decimals) ?? 0n,
    amount0Min: 0n,
    amount1Min: 0n,
    deadline: currentBlockTimestamp
      ? currentBlockTimestamp + BigInt(transactionDeadline) * BigInt("60")
      : MAX_DEADLINE,
  }
}

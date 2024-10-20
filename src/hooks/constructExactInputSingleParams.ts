import { Token } from "../types"
import { getValidAddress } from "../utils/getValidAddress"
import { convertInputToSize } from "../functions/constructQuoteMintParams"

const MAX_DEADLINE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

export const constructExactInputSingleParams = (
  tokenIn: Token | undefined | null,
  tokenOut: Token | undefined | null,
  maintenance: string | undefined,
  oracle: string | undefined,
  recipient: string | undefined,
  amountIn: string | undefined,
  currentBlockTimestamp: bigint | undefined,
  transactionDeadline: string,
) => {
  const tokenInAddress = getValidAddress(tokenIn?.address)
  const tokenOutAddress = getValidAddress(tokenOut?.address)
  const oracleAddress = getValidAddress(oracle)
  const recipientAddress = getValidAddress(recipient)

  if (!tokenIn || !tokenOut) {
    return null
  }
  if (!tokenInAddress) {
    return null
  }
  if (!tokenOutAddress) {
    return null
  }
  if (!oracleAddress) {
    return null
  }
  if (!recipientAddress) {
    return null
  }
  if (!maintenance) {
    return null
  }
  if (!amountIn) {
    return null
  }

  return {
    tokenIn: tokenInAddress,
    tokenOut: tokenOutAddress,
    maintenance,
    oracle: oracleAddress,
    recipient: recipientAddress,
    deadline: currentBlockTimestamp
      ? currentBlockTimestamp + BigInt(transactionDeadline) * BigInt("60")
      : MAX_DEADLINE,
    amountIn: convertInputToSize(amountIn, tokenIn?.decimals) ?? 0n,
    amountOutMinimum: 0n, // TODO: Update this to factor in slippage
    sqrtPriceLimitX96: 0n, // TODO: Update this to factor in slippage
  }
}

import _ from "lodash"
import { AddLiquidityParams } from "../hooks/useViewQuoteAddLiquidity"
import { getValidAddress } from "../utils/getValidAddress"
import { convertLeverageInputToDesiredSize } from "./constructQuoteMintParams"
import { convertMaintenanceToLeverage } from "./convertMaintenanceToLeverage"
import { Token } from "../types"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"

const MAX_DEADLINE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

export const constructAddLiquidityParams = (
  inputValue0: string,
  inputValue1: string,
  token0: Token | null,
  token1: Token | null,
  maintenance: string | undefined,
  oracle: string | undefined,
  recipient: string,
  currentBlockTimestamp: bigint | undefined,
  transactionDeadline: string,
): AddLiquidityParams | null => {
  const token0Address = getValidAddress(token0?.address)
  const token1Address = getValidAddress(token1?.address)
  const oracleAddress = getValidAddress(oracle)
  const recipientAddress = getValidAddress(recipient)

  if (!token0Address || !token1Address) return null
  if (!token0 || !token1) return null
  if (!oracleAddress) return null
  if (!recipientAddress) return null
  if (!maintenance) return null
  if (!Number(inputValue0) || !Number(inputValue1)) return null

  return {
    token0: token0Address,
    token1: token1Address,
    maintenance: maintenance,
    oracle: oracleAddress,
    recipient: recipientAddress,
    amount0Desired: formatStringToBigInt(inputValue0, token0.decimals) ?? 0n,
    // convertLeverageInputToDesiredSize(
    //   inputValue0,
    //   convertMaintenanceToLeverage(maintenance),
    //   token0.decimals,
    // ) ?? 0n
    amount1Desired: formatStringToBigInt(inputValue1, token1.decimals) ?? 0n,
    // convertLeverageInputToDesiredSize(
    //   inputValue1,
    //   convertMaintenanceToLeverage(maintenance),
    //   token1.decimals,
    // ) ?? 0n,
    amount0Min: 0n,
    amount1Min: 0n,
    deadline: currentBlockTimestamp
      ? currentBlockTimestamp + BigInt(transactionDeadline) * BigInt("60")
      : MAX_DEADLINE,
  }
}

import _ from "lodash"
import bigDecimal from "js-big-decimal"
import { parseUnits, formatUnits } from "ethers"
import { MintParams } from "../hooks/useViewQuoteMint"
import { getValidAddress } from "../utils/getValidAddress"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import { Token } from "../types"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"

const MAX_DEADLINE =
  115792089237316195423570985008687907853269984665640564039457584007913129639935n

export const constructQuoteMintParams = (
  marginToken: Token | null, // margin token
  debtToken: Token | null, // debt token
  poolToken0Address: string | undefined,
  poolToken1Address: string | undefined,
  oracleAddress: string | undefined,
  inputValue: string,
  leverage: number,
  poolMaintenance: string | undefined,
  recipientAddress: string | undefined,
  currentBlockTimestamp: bigint | undefined,
  transactionDeadline: string,
): MintParams | null => {
  const marginTokenAddress = getValidAddress(marginToken?.address)
  const token0Address = getValidAddress(poolToken0Address)
  const token1Address = getValidAddress(poolToken1Address)
  const oracle = getValidAddress(oracleAddress)

  // TODO: Enhance guardrail checks with error logging
  if (!token0Address || !token1Address || !oracle) return null
  if (!marginToken || !debtToken) return null
  if (!leverage) return null
  if (_.isUndefined(inputValue) || _.isEmpty(inputValue) || isOnlyZeroes(inputValue))
    return null
  if (_.isEmpty(poolMaintenance) || _.isUndefined(poolMaintenance)) return null
  if (_.isUndefined(recipientAddress)) return null

  return {
    token0: token0Address,
    token1: token1Address,
    maintenance: poolMaintenance,
    oracle: oracle,
    zeroForOne: marginTokenAddress === token1Address,
    sizeDesired:
      convertLeverageInputToDesiredSize(inputValue, leverage, marginToken.decimals) ?? 0n,
    sizeMinimum: 0,
    debtMaximum: 0,
    amountInMaximum: 0,
    sqrtPriceLimitX96: 0,
    margin: convertInputToSize(inputValue, marginToken.decimals) ?? 0n,
    recipient: getValidAddress(recipientAddress),
    deadline: currentBlockTimestamp
      ? currentBlockTimestamp + BigInt(transactionDeadline) * BigInt("60")
      : MAX_DEADLINE,
  }
}

export const convertInputToSize = (inputValue: string, decimals: number) => {
  return formatStringToBigInt(inputValue, decimals)
}

export const convertLeverageInputToDesiredSize = (
  inputValue: string,
  leverage: number,
  decimals: number,
) => {
  const inputValue_BD = new bigDecimal(inputValue)
  const applyLeverage_BD = new bigDecimal(leverage - 1)

  const leveragedValue = inputValue_BD.multiply(applyLeverage_BD).getValue()

  return convertInputToSize(leveragedValue, decimals)
}

import _ from "lodash"

export const getContractError = (error: any, functionName?: string) => {
  console.error(`Error in ${functionName}:`, error)

  const USER_REJECTED = "User rejected the request."
  const INPUT_TOO_BIG = "SizeGreaterThanReserve"
  const SIZE_TOO_SMALL = "Invalid liquidityDelta"
  const LEVERAGE_LARGER_THAN_MAX = "Margin less than min"
  const NOT_ENOUGH_APPROVED = "STF"
  const INVALID_TOKEN_ID = "ERC721: invalid token ID"

  if (!error) return null

  if (_.includes(error?.message, USER_REJECTED)) {
    return "Wallet rejected transaction"
  }
  if (_.includes(error?.message, INPUT_TOO_BIG)) {
    return "Not enough liquidity in pool."
  }

  if (_.includes(error?.message, SIZE_TOO_SMALL)) {
    return "Input amount too small."
  }

  if (_.includes(error?.message, LEVERAGE_LARGER_THAN_MAX)) {
    return "Leverage greater than max."
  }

  if (_.includes(error?.message, NOT_ENOUGH_APPROVED)) {
    return "Input greater than approved."
  }

  if (_.includes(error?.message, INVALID_TOKEN_ID)) {
    return "Position has been closed."
  }
  return null
}

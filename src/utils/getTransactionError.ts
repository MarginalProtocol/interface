import _ from "lodash"

export const getTransactionError = (error: any, functionName?: string) => {
  const REJECTED_TRANSACTION = "User denied transaction signature"

  if (_.includes(error?.details, REJECTED_TRANSACTION)) {
    return "Wallet rejected transaction."
  }

  if (error?.message) {
    return error.message
  }

  return error
}

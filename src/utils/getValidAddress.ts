import { Address, getAddress } from "viem"
import _ from "lodash"

export const getValidAddress = (address: string | undefined | null): Address | any => {
  try {
    if (!_.isEmpty(address) && _.isString(address)) {
      return getAddress(address)
    } else {
      return null
    }
  } catch (e) {
    return null
  }
}

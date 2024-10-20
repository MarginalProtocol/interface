import { Token } from "../types"
import { zeroAddress } from "viem"

export const isGasToken = (token: Token | null | undefined) => {
  return token?.address === zeroAddress
}

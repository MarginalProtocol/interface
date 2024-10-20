import { ZeroAddress } from "ethers"
import tokenSafetyLookup, { TOKEN_LIST_TYPES } from "./tokenSafetyLookup"

export const NATIVE_CHAIN_ID = "NATIVE"

export const TOKEN_SAFETY_ARTICLE =
  "https://support.uniswap.org/hc/en-us/articles/8723118437133"

export enum WARNING_LEVEL {
  MEDIUM,
  UNKNOWN,
  BLOCKED,
}

export type Warning = {
  level: WARNING_LEVEL
  message: JSX.Element
  /** Determines whether triangle/slash alert icon is used, and whether this token is supported/able to be traded. */
  canProceed: boolean
}

const MediumWarning: Warning = {
  level: WARNING_LEVEL.MEDIUM,
  message: <div>Caution</div>,
  canProceed: true,
}

const StrongWarning: Warning = {
  level: WARNING_LEVEL.UNKNOWN,
  message: <div>Warning</div>,
  canProceed: true,
}

const BlockedWarning: Warning = {
  level: WARNING_LEVEL.BLOCKED,
  message: <div>Not available</div>,
  canProceed: false,
}

export const NotFoundWarning: Warning = {
  level: WARNING_LEVEL.UNKNOWN,
  message: <div>Token not found</div>,
  canProceed: false,
}

export function checkWarning(tokenAddress: string, chainId?: number | null) {
  if (tokenAddress === NATIVE_CHAIN_ID || tokenAddress === ZeroAddress) {
    return null
  }
  switch (tokenSafetyLookup.checkToken(tokenAddress.toLowerCase(), chainId)) {
    case TOKEN_LIST_TYPES.UNI_DEFAULT:
      return null
    case TOKEN_LIST_TYPES.UNI_EXTENDED:
      return MediumWarning
    case TOKEN_LIST_TYPES.UNKNOWN:
      return StrongWarning
    case TOKEN_LIST_TYPES.BLOCKED:
      return BlockedWarning
    case TOKEN_LIST_TYPES.BROKEN:
      return BlockedWarning
  }
}

export function displayWarningLabel(warning: Warning | null) {
  return warning && warning.level !== WARNING_LEVEL.MEDIUM
}

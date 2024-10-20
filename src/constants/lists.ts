export const UNI_LIST = "https://cloudflare-ipfs.com/ipns/tokens.uniswap.org"
export const UNI_EXTENDED_LIST =
  "https://cloudflare-ipfs.com/ipns/extendedtokens.uniswap.org"
const UNI_UNSUPPORTED_LIST =
  "https://cloudflare-ipfs.com/ipns/unsupportedtokens.uniswap.org"

export const BASE_LIST =
  "https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json"

export const UNSUPPORTED_LIST_URLS: string[] = [UNI_UNSUPPORTED_LIST]

export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST]
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [
  UNI_EXTENDED_LIST,
  BASE_LIST,
  ...UNSUPPORTED_LIST_URLS,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [...DEFAULT_ACTIVE_LIST_URLS]

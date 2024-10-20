import { ChainId } from "./chains"
import { Token } from "src/types"
import { zeroAddress } from "viem"

export const ETH = {
  address: zeroAddress,
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
  isNative: true,
  logoURI:
    "https://raw.githubusercontent.com/birdeye-so/birdeye-ads/main/network/ethereum.png",
}

export const MAINNET_WETH = {
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  decimals: 18,
  name: "Wrapped Ether",
  symbol: "WETH",
  isNative: false,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
}

export const BASE_WETH = {
  address: "0x4200000000000000000000000000000000000006",
  decimals: 18,
  name: "Wrapped Ether",
  symbol: "WETH",
  isNative: false,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
}

export const SEPOLIA_WETH = {
  address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
  decimals: 18,
  name: "Wrapped Ether",
  symbol: "WETH",
  isNative: false,
  logoURI:
    "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
}

export const BERA = {
  address: zeroAddress,
  name: "Bera",
  symbol: "BERA",
  decimals: 18,
  isNative: true,
  logoURI: "https://docs.berachain.com/assets/BERA.png",
}

export const BERACHAIN_BARTIO_WBERA = {
  address: "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8",
  decimals: 18,
  name: "Wrapped Bera",
  symbol: "WBERA",
  isNative: false,
  logoURI: "https://docs.berachain.com/assets/BERA.png",
}

export const WRAPPED_GAS_TOKEN_MAP: { [chainId: number]: Token } = {
  [ChainId.BASE]: BASE_WETH,
  [ChainId.SEPOLIA]: SEPOLIA_WETH,
  [ChainId.BERACHAIN_BARTIO]: BERACHAIN_BARTIO_WBERA,
  [ChainId.MAINNET]: MAINNET_WETH,
}

export const GAS_TOKEN_MAP: { [chainId: number]: Token } = {
  [ChainId.BASE]: ETH,
  [ChainId.SEPOLIA]: ETH,
  [ChainId.BERACHAIN_BARTIO]: BERA,
  [ChainId.MAINNET]: ETH,
}

export const MARGINAL_DAO_TOKEN = "0x43Bdd46b310a78C8f077c162D45dBe7e70F32217"

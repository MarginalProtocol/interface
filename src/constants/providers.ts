import { ChainId, SupportedChainsType } from "@uniswap/sdk-core"
import AppRpcProvider from "../rpc/AppRpcProvider"
import AppStaticJsonRpcProvider from "../rpc/StaticJsonRpcProvider"
import StaticJsonRpcProvider from "../rpc/StaticJsonRpcProvider"

import { RPC_URLS } from "./networks"

export type SupportedInterfaceChain = Exclude<SupportedChainsType, ChainId.BASE_GOERLI>

const providerFactory = (chainId: SupportedInterfaceChain, i = 0) =>
  //@ts-ignore
  new AppStaticJsonRpcProvider(chainId, RPC_URLS[chainId][i])

/**
 * These are the only JsonRpcProviders used directly by the interface.
 */
export const RPC_PROVIDERS: { [key: number]: StaticJsonRpcProvider } = {
  [ChainId.MAINNET]: new AppRpcProvider(ChainId.MAINNET, [
    providerFactory(ChainId.MAINNET),
    providerFactory(ChainId.MAINNET, 1),
  ]),
  [ChainId.GOERLI]: providerFactory(ChainId.GOERLI),
  [ChainId.SEPOLIA]: providerFactory(ChainId.SEPOLIA),
  [ChainId.OPTIMISM]: providerFactory(ChainId.OPTIMISM),
  [ChainId.OPTIMISM_GOERLI]: providerFactory(ChainId.OPTIMISM_GOERLI),
  [ChainId.ARBITRUM_ONE]: providerFactory(ChainId.ARBITRUM_ONE),
  [ChainId.ARBITRUM_GOERLI]: providerFactory(ChainId.ARBITRUM_GOERLI),
  [ChainId.POLYGON]: providerFactory(ChainId.POLYGON),
  [ChainId.POLYGON_MUMBAI]: providerFactory(ChainId.POLYGON_MUMBAI),
  [ChainId.CELO]: providerFactory(ChainId.CELO),
  [ChainId.CELO_ALFAJORES]: providerFactory(ChainId.CELO_ALFAJORES),
  [ChainId.BNB]: providerFactory(ChainId.BNB),
  [ChainId.AVALANCHE]: providerFactory(ChainId.AVALANCHE),
  [ChainId.BASE]: providerFactory(ChainId.BASE),
}

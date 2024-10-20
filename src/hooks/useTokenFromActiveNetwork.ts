import { useState, useEffect } from "react"
import { useNetwork } from "wagmi"
import { multicall, erc20ABI } from "@wagmi/core"
import { ChainId, Currency, Token } from "@uniswap/sdk-core"
import { getValidAddress } from "../utils/getValidAddress"
import ERC20_ABI from "../abis/erc20.json"
import ERC20_BYTES32_ABI from "../abis/erc20_bytes32.json"

const UNKNOWN_TOKEN_SYMBOL = "UNKNOWN"
const UNKNOWN_TOKEN_NAME = "Unknown Token"
const UNKNOWN_DEFAULT_DECIMALS = 18

/**
 * Returns a Token from the tokenAddress.
 * Returns null if token is loading or null was passed.
 * Returns undefined if tokenAddress is invalid or token does not exist.
 */
export function useTokenFromActiveNetwork(
  tokenAddress: string | undefined,
  chainId?: number,
): Token | null | undefined {
  const formattedAddress = getValidAddress(tokenAddress)

  const [token, setToken] = useState<any>(null)

  useEffect(() => {
    if (formattedAddress && chainId) {
      const fetchTokenOnChain = async () => {
        const erc20TokenContract = {
          address: formattedAddress,
          abi: erc20ABI,
        }

        const data = await multicall({
          chainId: chainId,
          contracts: [
            { ...erc20TokenContract, functionName: "name" },
            { ...erc20TokenContract, functionName: "symbol" },
            { ...erc20TokenContract, functionName: "decimals" },
          ],
        })

        const parsedName = data?.[0].result
        const parsedSymbol = data?.[1].result
        const parsedDecimals = data?.[2].result

        if (parsedName && parsedDecimals && parsedSymbol) {
          const token = new Token(
            chainId,
            formattedAddress,
            parsedDecimals,
            parsedSymbol,
            parsedName,
          )

          setToken(token)
        }
      }

      fetchTokenOnChain()
    } else {
      setToken(null)
    }
  }, [formattedAddress, chainId])

  return token
}

type TokenMap = { [address: string]: Token }

/**
 * Returns a Token from the tokenAddress.
 * Returns null if token is loading or null was passed.
 * Returns undefined if tokenAddress is invalid or token does not exist.
 */
export function useTokenFromMapOrNetwork(
  tokens: TokenMap,
  tokenAddress?: string | null,
  chainId?: number,
): Token | undefined {
  const address = getValidAddress(tokenAddress)
  const token: Token | undefined = address ? tokens[address] : undefined
  const tokenFromNetwork = useTokenFromActiveNetwork(
    token ? undefined : address ? address : undefined,
    chainId,
  )

  return tokenFromNetwork ?? token
}

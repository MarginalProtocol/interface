import { convertX96Prices } from "src/functions/convertX96Prices"
import { useWrappedGasUSDPrices } from "src/state/prices/hooks"
import { Token } from "src/types"
import { getValidAddress } from "src/utils/getValidAddress"

export const usePoolTokenPricesInUSD = (
  chainId: number,
  quoteToken: Token | null,
  token0: Token,
  token1: Token,
  poolPriceX96: any,
) => {
  const poolPrice = convertX96Prices(poolPriceX96, token0, token1)
  const wrappedTokenPriceInUSD = useWrappedGasUSDPrices(chainId)
  const isToken1QuoteToken =
    getValidAddress(token1?.address) === getValidAddress(quoteToken?.address)

  if (
    !poolPrice ||
    !wrappedTokenPriceInUSD ||
    !quoteToken ||
    !token0 ||
    !token1 ||
    !poolPriceX96
  ) {
    return {
      token0PriceInUSD: undefined,
      token1PriceInUSD: undefined,
    }
  } else {
    return {
      token1PriceInUSD: isToken1QuoteToken
        ? wrappedTokenPriceInUSD
        : wrappedTokenPriceInUSD / parseFloat(poolPrice),
      token0PriceInUSD: isToken1QuoteToken
        ? wrappedTokenPriceInUSD * parseFloat(poolPrice)
        : wrappedTokenPriceInUSD,
    }
  }
}

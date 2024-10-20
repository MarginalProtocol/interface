import { Token } from "../types"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"

export const extrapolateTokenPair = (
  token0: Token | null,
  token1: Token | null,
  chainId: number,
): { baseToken: Token | null; quoteToken: Token | null } => {
  if (!token0 || !token1) {
    return {
      baseToken: null,
      quoteToken: null,
    }
  }
  if (!isWrappedGasToken(token0, chainId) && !isWrappedGasToken(token1, chainId)) {
    console.error("WETH not detected in either tokens to construct base/quote.")
    return {
      baseToken: null,
      quoteToken: null,
    }
  }

  if (isWrappedGasToken(token0, chainId)) {
    return {
      baseToken: token1,
      quoteToken: token0,
    }
  } else {
    return {
      baseToken: token0,
      quoteToken: token1,
    }
  }
}

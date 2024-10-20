import { useAppSelector } from "src/store/hooks"
import { AppState } from "src/store"
import { WRAPPED_GAS_TOKEN_MAP } from "src/constants/tokens"

export const usePricesState = (): AppState["prices"] => {
  return useAppSelector((state) => state.prices)
}

export const useWrappedGasUSDPrices = (chainId: number) => {
  const { prices } = usePricesState()

  const wrappedGasTokenAddress = WRAPPED_GAS_TOKEN_MAP[chainId]?.address.toLowerCase()

  return prices?.[chainId]?.[wrappedGasTokenAddress].priceUsd
}

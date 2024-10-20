import { convertX96Prices } from "src/functions/convertX96Prices"
import { calculateInversePrice } from "src/components/Trade/TradeDetailList"
import { Token } from "src/types"

export const calculateInversablePrices = (
  useInverse: boolean,
  oraclePriceX96: string | undefined,
  poolPriceX96: string | undefined,
  liquidationPriceX96: string | undefined,
  token0: Token | null | undefined,
  token1: Token | null | undefined,
) => {
  const oraclePrice = convertX96Prices(oraclePriceX96, token0, token1)
  const poolPrice = convertX96Prices(poolPriceX96, token0, token1)
  const liquidationPrice = convertX96Prices(liquidationPriceX96, token0, token1)

  const inverseOraclePrice = calculateInversePrice(oraclePrice)
  const inversePoolPrice = calculateInversePrice(poolPrice)
  const inverseLiquidationPrice = calculateInversePrice(liquidationPrice)

  return {
    oraclePrice: !useInverse ? oraclePrice : inverseOraclePrice,
    poolPrice: !useInverse ? poolPrice : inversePoolPrice,
    liquidationPrice: !useInverse ? liquidationPrice : inverseLiquidationPrice,
  }
}

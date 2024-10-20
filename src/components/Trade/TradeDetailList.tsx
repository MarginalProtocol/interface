import { useState } from "react"
import { isNumber, isUndefined, isNull } from "lodash"
import { PoolData, Token } from "../../types"
import { ListRow } from "../List/ListRow"
import { TokenAsset } from "../Token/TokenAsset"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { DoubleCurrencyLogo } from "../../pages/Pools"
import { ArrowLeftRightIcon } from "../Icons/ArrowLeftRightIcon"

interface Props {
  pool: PoolData | null
  token0: Token | null
  token1: Token | null
  marginToken: Token | null
  debtToken: Token | null
  poolMaxLeverage: number | undefined

  quotedDebt: string | null | undefined
  poolPrice: string | null | undefined
  oraclePrice: string | null | undefined
  liquidationPrice: string | null | undefined
  relativeSqrtPriceDiff: number | null | undefined

  fundingRate: string | number | null | undefined
  escrowRewards: string | null | undefined
  maxSlippage: string
  priceImpact: string | undefined
  isPriceImpactModerate: boolean | undefined
  isPriceImpactSevere: boolean | undefined
  healthFactor: number | null

  useInverse: boolean
  onToggleInverse: () => void
}

export const TradeDetailList = ({
  pool,
  token0,
  token1,
  marginToken,
  debtToken,
  poolMaxLeverage,

  quotedDebt,
  poolPrice,
  oraclePrice,
  liquidationPrice,
  relativeSqrtPriceDiff,

  fundingRate,
  escrowRewards,
  maxSlippage,
  priceImpact,
  isPriceImpactModerate,
  isPriceImpactSevere,
  healthFactor,

  useInverse,
  onToggleInverse,
}: Props) => {
  const [show, setShow] = useState(false)

  const liquidationRiskIndicator = getLiquidationRiskIndicator(relativeSqrtPriceDiff)
  const priceImpactIndicator =
    priceImpact && (isPriceImpactModerate || isPriceImpactSevere)
      ? isPriceImpactSevere
        ? "text-red-500"
        : "text-yellow-500"
      : "text-marginalGray-200"

  const fundingRateIndicator =
    Math.abs(Number(fundingRate)) > 1
      ? "text-warning-500"
      : Math.abs(Number(fundingRate)) > 5
        ? "text-error-500"
        : "text-marginalGray-200"

  if (!pool) return null

  return (
    <div
      id="trade-detail-list"
      className="px-2 py-2 rounded-lg transform-gpu duration-175"
    >
      <div className="flex items-center justify-between">
        <AssetPairPriceRatio
          token0={token0}
          token1={token1}
          price={poolPrice}
          useInverse={useInverse}
          onToggleInverse={onToggleInverse}
          size="xl"
        />
        <div
          onClick={() => setShow(!show)}
          className="w-full flex items-center justify-end cursor-pointer hover:opacity-60"
        >
          <ChevronDownIcon
            width={16}
            height={16}
            className={
              show
                ? "text-marginalGray-200 transform rotate-180 transition-transform duration-200 ease-in-out"
                : "text-marginalGray-200 transition-transform duration-200 ease-in-out"
            }
          />
        </div>
      </div>

      <div
        className={`
          text-sm md:text-base tracking-thin font-bold uppercase transition-max-height ease-in-out 
          text-marginalGray-200 transform-gpu duration-500 overflow-y-hidden
          ${show ? "max-h-[600px]" : "max-h-0"}
        `}
      >
        <div className="py-4 text-marginalGray-400">
          <ListRow
            item="Pool"
            value={
              pool && (
                <div className="flex items-center space-x-1">
                  <DoubleCurrencyLogo token0={token0} token1={token1} size={4} />
                  <div className="flex flex-wrap items-baseline space-x-2">
                    <div className="flex items-center space-x-1 text-marginalGray-200">
                      <pre>{token0?.symbol}</pre>
                      <div className="my-auto font-bold">/</div>
                      <pre>{token1?.symbol}</pre>
                    </div>
                  </div>
                </div>
              )
            }
          />
          <div className="my-3 h-[1px] bg-marginalGray-200/20" />
          <div className="space-y-2">
            <ListRow
              item="Oracle price"
              value={
                oraclePrice && (
                  <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                    <div>{oraclePrice}</div>
                    {!useInverse ? (
                      <div className="flex items-center">
                        <pre>{token1?.symbol}</pre>
                        <div>/</div>
                        <pre>{token0?.symbol}</pre>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <pre>{token0?.symbol}</pre>
                        <div>/</div>
                        <pre>{token1?.symbol}</pre>
                      </div>
                    )}
                  </div>
                )
              }
            />
            <ListRow
              item="Pool price"
              value={
                poolPrice && (
                  <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                    <div>{poolPrice}</div>
                    {!useInverse ? (
                      <div className="flex items-center">
                        <pre>{token1?.symbol}</pre>
                        <div>/</div>
                        <pre>{token0?.symbol}</pre>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <pre>{token0?.symbol}</pre>
                        <div>/</div>
                        <pre>{token1?.symbol}</pre>
                      </div>
                    )}
                  </div>
                )
              }
            />
            <ListRow
              item="Liquidation price"
              value={
                liquidationPrice && (
                  <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                    <div>{liquidationPrice}</div>
                    {!useInverse ? (
                      <div className="flex items-center text-marginalGray-200">
                        <pre>{token1?.symbol}</pre>
                        <div>/</div>
                        <pre>{token0?.symbol}</pre>
                      </div>
                    ) : (
                      <div className="flex items-center text-marginalGray-200">
                        <pre>{token0?.symbol}</pre>
                        <div>/</div>
                        <pre>{token1?.symbol}</pre>
                      </div>
                    )}
                  </div>
                )
              }
            />
            <ListRow
              item="Funding rate"
              value={
                fundingRate && (
                  <div
                    className={`flex flex-wrap justify-end space-x-1 ${fundingRateIndicator} `}
                  >
                    <pre>{fundingRate}% weekly</pre>
                  </div>
                )
              }
            />
            <ListRow
              item="Escrow rewards"
              value={
                escrowRewards && (
                  <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                    <pre>{escrowRewards} ETH</pre>
                  </div>
                )
              }
            />
          </div>

          <div className="my-3 h-[1px] bg-marginalGray-200/20" />

          <div className="space-y-2">
            <ListRow
              item="Debt"
              value={
                quotedDebt && (
                  <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                    <div>{quotedDebt}</div>
                    <TokenAsset
                      token={debtToken}
                      isReversed={true}
                      className="!w-4 !h-4"
                    />
                  </div>
                )
              }
            />
            <ListRow
              item="Max slippage"
              value={
                maxSlippage && (
                  <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                    {maxSlippage === "0.5" && (
                      <div className="`text-xs tracking-thin font-bold uppercase rounded bg-marginalGray-800 px-0.5">
                        Auto
                      </div>
                    )}
                    <div>{maxSlippage}%</div>
                  </div>
                )
              }
            />
            <ListRow
              item="Max leverage"
              value={
                poolMaxLeverage && (
                  <div className="text-marginalGray-200">{poolMaxLeverage + "x"}</div>
                )
              }
            />
            <ListRow
              item="Impact"
              value={
                priceImpact && (
                  <div className="flex flex-wrap justify-end space-x-1">
                    <div className={priceImpactIndicator}>{-priceImpact}%</div>
                  </div>
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export const AssetPairPriceRatio = ({
  token0,
  token1,
  price, // @dev assumes price formatted
  useInverse,
  onToggleInverse,
  size = "lg",
}: {
  token0: Token | null | undefined
  token1: Token | null | undefined
  price: string | null | undefined
  useInverse: boolean
  onToggleInverse: () => void
  size?: "sm" | "lg" | "xl"
}) => {
  if (!token0 || !token1 || !price) return null

  return (
    <div
      onClick={onToggleInverse}
      className={`flex items-center space-x-1 ${size === "sm" ? "text-xs" : size === "xl" ? "text-sm md:text-base" : "text-sm"} font-bold text-white cursor-pointer tracking-thin hover:opacity-70`}
    >
      <ArrowLeftRightIcon />
      {!useInverse ? (
        <pre>
          1 {token0?.symbol} = {price} {token1?.symbol}
        </pre>
      ) : (
        <pre>
          1 {token1?.symbol} = {price} {token0?.symbol}
        </pre>
      )}
    </div>
  )
}

export function calculateInversePrice(price: string | undefined) {
  if (isUndefined(price)) return undefined

  const priceFloat = parseFloat(price)

  if (isNaN(priceFloat)) {
    throw new Error("Invalid price input")
  }

  const inversePrice = 1 / priceFloat

  return inversePrice.toString()
}

export function getLiquidationRiskIndicator(
  relativeSqrtPriceDiff: number | null | undefined,
) {
  if (!isNumber(relativeSqrtPriceDiff)) return null

  let liquidationRiskSeverity = "NORMAL"

  if (typeof relativeSqrtPriceDiff === "number") {
    if (relativeSqrtPriceDiff < 0.1) {
      liquidationRiskSeverity = "MODERATE"
    }
    if (relativeSqrtPriceDiff <= 0.025) {
      liquidationRiskSeverity = "SEVERE"
    }
  }

  let liquidationRiskIndicator

  switch (liquidationRiskSeverity) {
    case "NORMAL":
      liquidationRiskIndicator = "text-white"
      break
    case "SEVERE":
      liquidationRiskIndicator = "text-red-500"
      break
    case "MODERATE":
      liquidationRiskIndicator = "text-yellow-500"
      break
    default:
      liquidationRiskIndicator = "text-white"
  }

  return liquidationRiskIndicator
}

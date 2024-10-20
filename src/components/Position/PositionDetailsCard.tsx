import { Token } from "../../types"
import { ListRow } from "../List/ListRow"
import { getAddressLink } from "../../utils/getAddressLink"
import { TokenAsset } from "../Token/TokenAsset"
import { PoolData } from "../../types"
interface Props {
  tokenId: string
  pool: PoolData
  margin: string | undefined
  size: string | number | undefined
  debt: string | undefined
  marginToken: Token | null
  debtToken: Token | null
  parsedPoolPrice: string | null | undefined
  parsedOraclePrice: string | null | undefined
  liquidationPrice: string | null | undefined
  fundingRate: string | number | null | undefined
  rawPnL: string | null | undefined
  percentagePnL: string | null | undefined
  leverage: string | undefined | null
  rewards: string | undefined | null
  isClosed: boolean
}

export const PositionDetailsCard = ({
  tokenId,
  pool,
  margin,
  size,
  debt,
  marginToken,
  debtToken,
  parsedPoolPrice,
  parsedOraclePrice,
  liquidationPrice,
  fundingRate,
  rawPnL,
  percentagePnL,
  leverage,
  rewards,
  isClosed,
}: Props) => {
  const isPnLPositive: boolean | null = percentagePnL
    ? parseFloat(percentagePnL) > 0
    : null

  const moderateRiskFraction = 0.25
  const severeRiskFraction = 0.1

  const moderateRiskDelta =
    parsedOraclePrice && parseFloat(parsedOraclePrice) * moderateRiskFraction
  const severeRiskDelta =
    parsedOraclePrice && parseFloat(parsedOraclePrice) * severeRiskFraction

  let isModerateLiquidationRisk = false
  let isSevereLiquidationRisk = false

  if (marginToken?.symbol === "WETH") {
    if (
      parsedOraclePrice &&
      liquidationPrice &&
      moderateRiskDelta &&
      parseFloat(parsedOraclePrice) - moderateRiskDelta > parseFloat(liquidationPrice)
    ) {
      isModerateLiquidationRisk = true
    }

    if (
      parsedOraclePrice &&
      liquidationPrice &&
      severeRiskDelta &&
      parseFloat(parsedOraclePrice) - severeRiskDelta > parseFloat(liquidationPrice)
    ) {
      isSevereLiquidationRisk = true
    }
  } else {
    if (
      parsedOraclePrice &&
      liquidationPrice &&
      moderateRiskDelta &&
      parseFloat(parsedOraclePrice) - moderateRiskDelta < parseFloat(liquidationPrice)
    ) {
      isModerateLiquidationRisk = true
    }

    if (
      parsedOraclePrice &&
      liquidationPrice &&
      severeRiskDelta &&
      parseFloat(parsedOraclePrice) - severeRiskDelta < parseFloat(liquidationPrice)
    ) {
      isSevereLiquidationRisk = true
    }
  }

  return (
    <div
      id="position-details-card"
      className="min-w-[380px] p-2 space-y-2 border-4 bg-marginalGray-850 border-borderGray rounded-xl h-fit "
    >
      <div className="p-1 font-bold text-marginalGray-200 uppercase tracking-wide pl-[10px]">
        Position Details
      </div>
      <div className="p-3 text-sm font-bold divide-y divide-marginalGray-200/20 bg-marginalBlack rounded-xl">
        <div className="py-2 space-y-1">
          <ListRow
            item="PnL (Amount)"
            value={
              rawPnL && (
                <div className="flex flex-wrap justify-end space-x-1">
                  <div>{rawPnL}</div>
                  <div>{marginToken?.symbol}</div>
                </div>
              )
            }
          />
          <ListRow
            item="PnL (%)"
            value={
              rawPnL && (
                <div className="flex flex-wrap justify-end space-x-1">
                  <div
                    className={`${percentagePnL ? (isPnLPositive ? "text-green-500" : "text-red-500") : ""}`}
                  >
                    {percentagePnL}%
                  </div>
                </div>
              )
            }
          />
          <ListRow
            item="Escrow Rewards"
            value={
              <div className="flex flex-wrap justify-end space-x-1">
                <div>{`${rewards ?? "-"} ETH`}</div>
              </div>
            }
          />
        </div>
        {!isClosed && (
          <>
            <div className="py-2 space-y-1">
              <ListRow
                item="Liquidation Price"
                value={
                  parsedOraclePrice && (
                    <div
                      className={`
                    flex flex-wrap justify-end space-x-1
                     ${isSevereLiquidationRisk ? "text-red-500" : isModerateLiquidationRisk ? "text-yellow-500" : ""}
                  `}
                    >
                      <div>{liquidationPrice}</div>
                      <div>
                        {pool?.token1?.symbol} per {pool?.token0?.symbol}
                      </div>
                    </div>
                  )
                }
              />
              {/* <ListRow
            item='Pool Price'
            value={
              parsedPoolPrice && (
                <div className='flex flex-wrap justify-end space-x-1'>
                  <div>{parsedPoolPrice}</div>
                  <div>
                    {pool?.token0?.symbol} per {pool?.token1?.symbol}
                  </div>
                </div>
              )
            }
          /> */}
              <ListRow
                item="Oracle Price"
                value={
                  parsedOraclePrice && (
                    <div className="flex flex-wrap justify-end space-x-1">
                      <div>{parsedOraclePrice}</div>
                      <div>
                        {pool?.token1?.symbol} per {pool?.token0?.symbol}
                      </div>
                    </div>
                  )
                }
              />
              <ListRow
                item="Funding Rate"
                value={
                  fundingRate && (
                    <div className="flex flex-wrap justify-end space-x-1">
                      <div>{fundingRate}% per 7 days</div>
                    </div>
                  )
                }
              />
            </div>
            <div className="py-2 space-y-1">
              <ListRow
                item="Leverage"
                value={
                  <div className="flex flex-wrap justify-end space-x-1">
                    <div>{leverage}x</div>
                  </div>
                }
              />
              <ListRow
                item="Size"
                value={
                  <div className="flex flex-wrap justify-end space-x-1">
                    <div>{size}</div>
                    <TokenAsset
                      token={marginToken}
                      isReversed={true}
                      className="!w-4 !h-4"
                    />
                  </div>
                }
              />
              <ListRow
                item="Margin"
                value={
                  <div className="flex flex-wrap justify-end space-x-1">
                    <div>{margin}</div>
                    <TokenAsset
                      token={marginToken}
                      isReversed={true}
                      className="!w-4 !h-4"
                    />
                  </div>
                }
              />
              <ListRow
                item="Debt"
                value={
                  <div className="flex flex-wrap justify-end space-x-1">
                    <div>{debt}</div>
                    <TokenAsset
                      token={debtToken}
                      isReversed={true}
                      className="!w-4 !h-4"
                    />
                  </div>
                }
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

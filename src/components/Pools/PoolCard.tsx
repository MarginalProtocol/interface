import _ from "lodash"
import { useViewPoolsState } from "../../hooks/useViewPoolsState"
import { PoolHeader } from "./PoolTokensHeader"
import { useNavigateRoutes } from "../../hooks/useNavigateRoutes"
import { formatBigIntToString } from "../../utils/formatBigIntToString"
import { trimTrailingZeroes } from "../../utils/trimTrailingZeroes"
import { ListRow } from "../List/ListRow"
import { getAddressLink } from "../../utils/getAddressLink"
import { getPoolMaxLeverage } from "../../functions/getPoolMaxLeverage"
import { PoolAccordion } from "./PoolAccordion"
import { ActionButton } from "../ActionButton"

export const PoolCard = ({
  token0,
  token1,
  token0Address,
  token1Address,
  poolAddress,
  oracleAddress,
  maintenance,
  userPoolTokenBalance,
  poolLiquidityLocked,
  poolTotalSupply,
}: {
  token0: string
  token1: string
  token0Address: string
  token1Address: string
  poolAddress: string
  oracleAddress: string
  maintenance: string
  userPoolTokenBalance: bigint | undefined
  poolLiquidityLocked: bigint | undefined
  poolTotalSupply: bigint | undefined
}) => {
  const poolState = useViewPoolsState(poolAddress)

  const { liquidity: poolLiquidity } = poolState

  const leverageMax = getPoolMaxLeverage(maintenance)

  const { onNavigateToPool, onNavigateToAddLiquidity, onNavigateToRemoveLiquidity } =
    useNavigateRoutes()

  const handleRedirectToPool = () => onNavigateToPool(poolAddress)
  const handleRedirectToAddLiquidity = () => onNavigateToAddLiquidity(poolAddress)
  const handleRedirectToRemoveLiquidity = () => onNavigateToRemoveLiquidity(poolAddress)

  const totalPoolLiquidity =
    !_.isUndefined(poolLiquidityLocked) && !_.isUndefined(poolLiquidity)
      ? poolLiquidity + poolLiquidityLocked
      : undefined

  const poolUtilization =
    !_.isUndefined(poolLiquidityLocked) && !_.isUndefined(totalPoolLiquidity)
      ? Number(poolLiquidityLocked) / Number(totalPoolLiquidity)
      : undefined

  const userOwnedPoolPercentage =
    !_.isUndefined(poolTotalSupply) && !_.isUndefined(userPoolTokenBalance)
      ? Number(userPoolTokenBalance) / Number(poolTotalSupply)
      : undefined

  return (
    <div
      id="pool-card"
      className="flex flex-col items-center justify-between p-6 space-x-2 text-marginalGray-200 bg-marginalBlack shadow-innerBlack rounded-xl"
    >
      <PoolAccordion
        poolUtilization={poolUtilization}
        title={
          <PoolHeader
            token0Symbol={token0}
            token1Symbol={token1}
            token0Address={token0Address}
            token1Address={token1Address}
            leverageMax={leverageMax}
          />
        }
        content={
          <div className="space-y-3 text-right">
            <div className="flex flex-col w-full my-4 space-y-4">
              <ListRow item="Pool Address" value={getAddressLink(poolAddress)} />
              <ListRow item="Oracle Address" value={getAddressLink(oracleAddress)} />
              <ListRow
                item="Pool Utilization"
                value={poolUtilization ? `${(poolUtilization * 100).toFixed(2)}%` : "0%"}
              />
              <ListRow
                item="Your Pool Token (LP) Balance"
                value={trimTrailingZeroes(
                  formatBigIntToString(userPoolTokenBalance, 18, 18),
                )}
              />
              {userOwnedPoolPercentage ? (
                <ListRow
                  item="Your share of Pool (%)"
                  value={`${userOwnedPoolPercentage * 100}%`}
                />
              ) : null}
            </div>

            <hr className="h-px m-0 border-none bg-marginalGray-200 bg-opacity-20" />

            <div className="space-x-2">
              <ActionButton
                action="Add Liquidity"
                onClick={handleRedirectToAddLiquidity}
              />
              <ActionButton
                action="Remove Liquidity"
                onClick={handleRedirectToRemoveLiquidity}
              />
              {/* <ActionButton action='Manage Pool' onClick={handleRedirectToManagePool} /> */}
            </div>
          </div>
        }
      />
    </div>
  )
}

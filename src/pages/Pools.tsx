import _, { isArray, isUndefined, isEmpty, isNumber } from "lodash"
import { useMemo, useState } from "react"
import { useAccount, useNetwork, Address } from "wagmi"
import { PoolsContainer } from "../components/Pools/PoolsContainer"
import { type PoolData } from "../types"
import { usePoolsData } from "../hooks/usePoolsData"
import { useUserPoolBalance } from "../hooks/useUserPoolBalance"
import { usePoolLiquidityLocked } from "../hooks/usePoolLiquidityLocked"
import { usePoolTotalSupply } from "../hooks/usePoolTotalSupply"
import CurrencyLogo from "../components/Logo/CurrencyLogo"
import { useViewPoolsState } from "../hooks/useViewPoolsState"
import { getPoolMaxLeverage } from "../functions/getPoolMaxLeverage"
import { type Token } from "../types"
import bigDecimal from "js-big-decimal"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { useErc20TokenBalances } from "../hooks/useErc20TokenBalances"
import { CircularProgressBar } from "./Pool"
import { useErc20TokenSymbol } from "../hooks/useErc20TokenSymbol"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { DEFAULT_CHAIN_ID } from "../constants/chains"
import { useMobileView } from "../hooks/useMobileView"
import { PoolsTabSelector } from "src/components/Pools/PoolsTabSelector"
import { CaretRightIcon } from "src/components/Icons/CaretRightIcon"
import { CustomConnectButton } from "src/components/Header/CustomConnectButton"
import { CircleStackIcon } from "src/components/Icons/CircleStackIcon"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"
import { calculatePercentageOfTotal } from "src/functions/calculatePercentageOfTotal"
import { useAPRQuotePercentageRate } from "src/hooks/useAPRQuotePercentageRate"
import { calculateAPRQuotePercentageRate } from "src/functions/calculateAPRQuotePercentageRate"
import { MARGINAL_DAO_TOKEN } from "src/constants/tokens"
import { useUserStakeBalance } from "src/hooks/useUserStakeBalance"

export const TableHeaderCell = ({
  align = "right",
  children,
}: {
  align?: "right" | "left"
  children?: any
}) => {
  return (
    <th
      className={`px-4 pt-1 pb-3 text-xs tracking-thin font-bold uppercase text-marginalGray-200 whitespace-nowrap ${align === "right" ? "text-right" : "text-left"}`}
    >
      {children}
    </th>
  )
}

export const TableCell = ({ children }: { children?: any }) => {
  return (
    <td className="px-4 py-4 text-sm font-bold text-right uppercase border-b tracking-thin text-marginalGray-200 first:text-left whitespace-nowrap border-marginalGray-200/20">
      {children}
    </td>
  )
}

export const TableRow = ({ children }: { children: any }) => {
  return <tr className="">{children}</tr>
}

export const MobileTableCell = ({
  label,
  children,
}: {
  label: string
  children?: any
}) => {
  return (
    <td
      className={`w-full flex flex-col text-xs tracking-thin font-bold uppercase text-marginalGray-200`}
    >
      <span className="text-marginalGray-600">{label}:</span>
      {children}
    </td>
  )
}

export const DoubleCurrencyLogo = ({
  token0,
  token1,
  size,
  className,
}: {
  token0?: Token | null
  token1?: Token | null
  size?: number
  className?: string
}) => {
  return (
    <div className="flex -space-x-2">
      <CurrencyLogo token={token0} className={`${className} z-20`} size={size} />
      <CurrencyLogo token={token1} className={`${className} z-10`} size={size} />
    </div>
  )
}

enum PoolsView {
  INCENTIVIZED = "Incentivized",
  UNINCENTIVIZED = "Unincentivized",
}

const Pools = () => {
  const { chain } = useNetwork()
  const { pools, isLoading } = usePoolsData()
  const { address } = useAccount()
  const { isMobileView } = useMobileView()

  const [view, setView] = useState<PoolsView>(PoolsView.INCENTIVIZED)

  const incentivizedPools = useMemo(() => {
    return pools.filter((pool) => pool.stakePool)
  }, [pools])

  const unincentivizedPools = useMemo(() => {
    return pools.filter((pool) => isUndefined(pool.stakePool))
  }, [pools])

  const { balances: userPoolBalances } = useUserPoolBalance(pools, address)

  const poolLiquidityLocked = usePoolLiquidityLocked(pools)
  const poolTotalSupply = usePoolTotalSupply(pools)

  const hasPools = isArray(pools) && !isEmpty(pools)

  const handleView = (view: PoolsView) => {
    setView(view)
  }

  return (
    <PoolsContainer>
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-start w-full px-4 border-b bg-marginalGray-900 border-marginalGray-800 rounded-t-3xl">
          <span className="py-4 text-xl tracking-thin font-bold uppercase text-[#CACACA]">
            Pools
          </span>

          <PoolsTabSelector
            view={view}
            handlePrimaryClick={() => handleView(PoolsView.INCENTIVIZED)}
            handleSecondaryClick={() => handleView(PoolsView.UNINCENTIVIZED)}
          />
        </div>
      </div>

      <table
        className={
          isMobileView
            ? "w-full p-2 text-marginalGray-200 bg-marginalGray-900 rounded-b-3xl border-separate border-spacing-0"
            : "w-full p-2 overflow-hidden bg-marginalGray-900 rounded-b-3xl border-separate border-spacing-0 table-auto"
        }
      >
        <thead className="">
          <>
            {isMobileView || !address ? (
              <></>
            ) : (
              <TableRow>
                <TableHeaderCell align="left">Pool</TableHeaderCell>
                <TableHeaderCell>Max Leverage</TableHeaderCell>
                <TableHeaderCell>APR</TableHeaderCell>
                <TableHeaderCell></TableHeaderCell>
                <TableHeaderCell>Pooled Assets</TableHeaderCell>
                <TableHeaderCell>Utilization</TableHeaderCell>
                <TableHeaderCell>My Share</TableHeaderCell>
              </TableRow>
            )}
          </>
        </thead>
        <tbody>
          {isLoading ? (
            <>
              <PoolRowLoading
                isMobile={isMobileView}
                isOnlyPosition={false}
                isFirst={true}
                isLast={false}
              />
              <PoolRowLoading
                isMobile={isMobileView}
                isOnlyPosition={false}
                isFirst={false}
                isLast={false}
              />
              <PoolRowLoading
                isMobile={isMobileView}
                isOnlyPosition={false}
                isFirst={false}
                isLast={false}
              />
              <PoolRowLoading
                isMobile={isMobileView}
                isOnlyPosition={false}
                isFirst={false}
                isLast={false}
              />
              <PoolRowLoading
                isMobile={isMobileView}
                isOnlyPosition={false}
                isFirst={false}
                isLast={true}
              />
            </>
          ) : hasPools && address ? (
            <>
              {view === "Incentivized"
                ? incentivizedPools.map((pool: PoolData, index: number) => {
                    return (
                      <PoolRow
                        view={view}
                        chainId={chain?.id ?? DEFAULT_CHAIN_ID}
                        pool={pool}
                        liquidityLocked={poolLiquidityLocked?.[index]?.liquidityLocked}
                        userPoolBalance={userPoolBalances?.[index].balance}
                        poolTotalSupplyParsed={
                          poolTotalSupply?.[index]?.parsedTotalSupply
                        }
                        isMobile={isMobileView}
                        isOnlyPosition={incentivizedPools.length === 1}
                        isFirst={incentivizedPools[0] === incentivizedPools[index]}
                        isLast={
                          incentivizedPools[incentivizedPools.length - 1] ===
                          incentivizedPools[index]
                        }
                      />
                    )
                  })
                : unincentivizedPools.map((pool: PoolData, index: number) => {
                    return (
                      <PoolRow
                        view={view}
                        chainId={chain?.id ?? DEFAULT_CHAIN_ID}
                        pool={pool}
                        liquidityLocked={poolLiquidityLocked?.[index]?.liquidityLocked}
                        userPoolBalance={userPoolBalances?.[index].balance}
                        poolTotalSupplyParsed={
                          poolTotalSupply?.[index]?.parsedTotalSupply
                        }
                        isMobile={isMobileView}
                        isOnlyPosition={unincentivizedPools.length === 1}
                        isFirst={unincentivizedPools[0] === unincentivizedPools[index]}
                        isLast={
                          unincentivizedPools[unincentivizedPools.length - 1] ===
                          unincentivizedPools[index]
                        }
                      />
                    )
                  })}
            </>
          ) : !address ? (
            <tr className="w-full h-[416px] md:h-72 flex justify-center items-center bg-marginalGray-900 rounded-b-2xl md:bg-none md:rounded-b-3xl p-2">
              <td className="flex flex-col items-center justify-center w-full h-full space-y-6 bg-marginalGray-950 rounded-xl md:bg-marginalBlack md:rounded-3xl">
                <div className="flex flex-col items-center space-y-4 max-w-52 text-marginalGray-200">
                  <CircleStackIcon />
                  <div className="text-sm font-bold text-center uppercase tracking-thin text-marginalGray-400">
                    Your {view === "Incentivized" ? "Incentivized" : "Unincentivized"}{" "}
                    pools will appear here.
                  </div>
                </div>
                <CustomConnectButton />
              </td>
            </tr>
          ) : null}
        </tbody>
      </table>
    </PoolsContainer>
  )
}

const PoolRow = ({
  view,
  chainId,
  pool,
  liquidityLocked,
  userPoolBalance,
  poolTotalSupplyParsed,
  isMobile,
  isOnlyPosition,
  isFirst,
  isLast,
}: {
  view: string
  chainId: number | undefined
  pool: PoolData
  liquidityLocked: bigint | undefined
  userPoolBalance: bigint | undefined
  poolTotalSupplyParsed: string | undefined
  isMobile: boolean
  isOnlyPosition: boolean
  isFirst: boolean
  isLast: boolean
}) => {
  const { address } = useAccount()
  const { poolAddress, maintenance } = pool
  const leverageCap = getPoolMaxLeverage(maintenance)
  const poolState = useViewPoolsState(poolAddress)
  const liquidityAvailable: bigint = poolState?.liquidity

  const { onNavigateToPool } = useNavigateRoutes()
  const handleNavigateToPool = () => onNavigateToPool(poolAddress)

  const defaultTokens = useDefaultActiveTokens(chainId ?? DEFAULT_CHAIN_ID)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(pool?.token0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(pool?.token1, defaultTokensList)

  const { balances, refetch } = useErc20TokenBalances([token0, token1], poolAddress)

  const token0Balance = _.find(balances, { token: token0 })
  const token1Balance = _.find(balances, { token: token1 })

  const token0BalanceFormatted = formatNumberAmount(token0Balance?.parsedBalance)
  const token1BalanceFormatted = formatNumberAmount(token1Balance?.parsedBalance)

  const { balances: userStakeBalances } = useUserStakeBalance(pool as PoolData, address)

  const {
    balance: userStakeBalance,
    parsedBalance: parsedUserStakeBalance,
    fullParsedBalance: fullParsedUserStakeBalance,
  } = _.find(userStakeBalances, { stakePoolAddress: pool?.stakePool }) || {}

  const { balances: userPoolBalances } = useUserPoolBalance(
    [pool],
    address,
    userStakeBalance,
  )

  const durationOneYearInSeconds = 86400 * 365

  const rawAPRQuotePercentageRate = useAPRQuotePercentageRate(
    pool?.poolAddress as Address,
    MARGINAL_DAO_TOKEN as Address,
    pool?.poolAddress as Address,
    durationOneYearInSeconds,
    chainId ?? DEFAULT_CHAIN_ID,
  )

  const formattedAPR = calculateAPRQuotePercentageRate(rawAPRQuotePercentageRate)

  const userOwnedPoolSharePercentage = calculatePercentageOfTotal(
    poolTotalSupplyParsed,
    isUndefined(formattedAPR)
      ? userPoolBalances?.[0].parsedBalance
      : userPoolBalances?.[0].parsedBalanceWithStaked,
  )

  const poolLiquidityAvailable = poolState?.liquidity
  const poolLiquidityLocked = liquidityLocked
  const poolLiquidityTotal =
    poolLiquidityAvailable &&
    poolLiquidityLocked &&
    poolLiquidityAvailable + poolLiquidityLocked

  const poolUtilization =
    poolLiquidityLocked &&
    poolLiquidityTotal &&
    new bigDecimal(poolLiquidityLocked)
      .divide(new bigDecimal(poolLiquidityTotal))
      .getValue()
  const poolUtilizationPercentage = poolUtilization
    ? (parseFloat(poolUtilization) * 100).toFixed(2)
    : (0).toFixed(2)

  const hasUserBalance = Boolean(userPoolBalance && userPoolBalance > 0n)

  const lpTokenSymbol = useErc20TokenSymbol(
    hasUserBalance ? (poolAddress as Address) : undefined,
  )

  return (
    <>
      {isMobile ? (
        <tr onClick={handleNavigateToPool}>
          <div
            className={`relative p-4 space-y-4 bg-marginalGray-950 border-b
              ${
                isOnlyPosition
                  ? "rounded-xl border-b-transparent"
                  : isFirst
                    ? "rounded-t-xl border-b-marginalGray-800"
                    : isLast
                      ? "rounded-b-xl border-b-transparent"
                      : "border-b-marginalGray-800"
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 text-xs font-bold uppercase tracking-thin">
                <DoubleCurrencyLogo token0={token0} token1={token1} size={6} />
                <div>
                  <div className="flex items-center">
                    <pre>{token0?.symbol}</pre>
                    <div className="px-0.5 my-auto">/</div>
                    <pre>{token1?.symbol}</pre>
                  </div>
                  <div className="flex items-center text-marginalGray-600">
                    <pre>{token0?.name}</pre>
                    <div className="px-0.5 my-auto">∙</div>
                    <pre>{token1?.name}</pre>
                  </div>
                  {/* {hasUserBalance ? (
                  <div className="text-xs text-white">
                    Your LP balance: {userPoolBalanceParsed} {lpTokenSymbol}
                  </div>
                ) : null} */}
                </div>
              </div>
              <CaretRightIcon />
            </div>

            <div className="flex">
              <MobileTableCell label="Max Leverage">{leverageCap}x</MobileTableCell>
              <MobileTableCell label="Utilization">
                {poolUtilizationPercentage ? (
                  <div className="flex items-center justify-start space-x-2">
                    <CircularProgressBar
                      sqSize={16}
                      strokeWidth={2}
                      percentage={parseFloat(poolUtilizationPercentage)}
                    />
                    <div>{poolUtilizationPercentage}%</div>
                  </div>
                ) : (
                  <div>-</div>
                )}
              </MobileTableCell>
            </div>

            <div className="flex">
              <MobileTableCell label="APR">{formattedAPR || "-"}%</MobileTableCell>

              <MobileTableCell label="My Share">
                {userOwnedPoolSharePercentage.toFixed(2)}%
              </MobileTableCell>
            </div>

            <div className="flex">
              <MobileTableCell label="Pooled Assets">
                <div className="flex flex-col items-start space-y-1">
                  <div className="flex items-center space-x-2">
                    <div>{token0BalanceFormatted}</div>

                    <div className="flex items-center space-x-1">
                      <CurrencyLogo token={token0} size={4} />
                      <pre>{token0?.symbol}</pre>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div>{token1BalanceFormatted}</div>

                    <div className="flex items-center space-x-1">
                      <CurrencyLogo token={token1} size={4} />
                      <pre>{token1?.symbol}</pre>
                    </div>
                  </div>
                </div>
              </MobileTableCell>
            </div>
          </div>
          {/* {!isLast && <div className="h-[1px] bg-marginalGray-800" />} */}
        </tr>
      ) : (
        <tr
          onClick={handleNavigateToPool}
          className={`w-fit cursor-pointer bg-marginalBlack hover:bg-marginalGray-950 border-none 
          ${
            isOnlyPosition
              ? "first:[&>td]:rounded-tl-2xl last:[&>td]:rounded-tr-2xl first:[&>td]:rounded-bl-2xl last:[&>td]:rounded-br-2xl [&>td]:border-none"
              : isFirst
                ? "first:[&>td]:rounded-tl-2xl last:[&>td]:rounded-tr-2xl"
                : isLast
                  ? "first:[&>td]:rounded-bl-2xl last:[&>td]:rounded-br-2xl [&>td]:border-none"
                  : ""
          }`}
        >
          <TableCell>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <DoubleCurrencyLogo token0={token0} token1={token1} size={6} />

                <div className="flex items-center text-sm">
                  <pre>{token0?.symbol}</pre>
                  <div className="px-0.5 my-auto">/</div>
                  <pre>{token1?.symbol}</pre>
                </div>
              </div>

              {/* {hasUserBalance ? (
                <div className="mt-3 text-white text-xxs">
                  Your LP balance: {userPoolBalanceParsed} {lpTokenSymbol}
                </div>
              ) : null} */}
            </div>
          </TableCell>

          <TableCell>{leverageCap}X</TableCell>
          <TableCell>{formattedAPR || "-"}%</TableCell>

          <TableCell></TableCell>

          <TableCell>
            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center space-x-2">
                <div>{token0BalanceFormatted}</div>

                <div className="flex items-center space-x-1">
                  <CurrencyLogo token={token0} size={4} />
                  <pre>{token0?.symbol}</pre>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <div>{token1BalanceFormatted}</div>

                <div className="flex items-center space-x-1">
                  <CurrencyLogo token={token1} size={4} />
                  <pre>{token1?.symbol}</pre>
                </div>
              </div>
            </div>
          </TableCell>

          <TableCell>
            {poolUtilizationPercentage ? (
              <div className="flex items-center justify-end space-x-2">
                <CircularProgressBar
                  sqSize={16}
                  strokeWidth={2}
                  percentage={parseFloat(poolUtilizationPercentage)}
                />
                <div>{poolUtilizationPercentage}%</div>
              </div>
            ) : (
              <div>-</div>
            )}
          </TableCell>

          <TableCell>{userOwnedPoolSharePercentage.toFixed(2)}%</TableCell>
        </tr>
      )}
    </>
  )
}

export const PoolRowLoading = ({
  isMobile = false,
  isOnlyPosition,
  isFirst,
  isLast,
}: {
  isMobile?: boolean
  isOnlyPosition: boolean
  isFirst: boolean
  isLast: boolean
}) => {
  return (
    <>
      {isMobile ? (
        <tr>
          <div
            className={`relative h-52 p-4 space-y-4 bg-marginalGray-950 border-b
                    ${
                      isOnlyPosition
                        ? "rounded-xl border-b-transparent"
                        : isFirst
                          ? "rounded-t-xl border-b-marginalGray-800"
                          : isLast
                            ? "rounded-b-xl border-b-transparent"
                            : "border-b-marginalGray-800"
                    }
                    `}
          >
            <td className="flex items-center justify-between md:py-2">
              <div className="flex space-x-2">
                <div className="w-5 h-5 rounded-full bg-marginalGray-200"></div>
                <div className="w-8 h-5 rounded bg-marginalGray-200"></div>
              </div>
              <div className="h-5 rounded w-14 bg-marginalGray-200"></div>
            </td>
            <td className="flex items-center justify-between md:py-2">
              <div className="w-8 h-5 rounded bg-marginalGray-200"></div>
              <div className="flex space-x-2">
                <div className="w-20 h-5 rounded bg-marginalGray-200"></div>
                <div className="w-5 h-5 rounded-full bg-marginalGray-200"></div>
              </div>
            </td>

            <td className="flex items-center justify-between md:py-2">
              <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
              <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
            </td>
            <td className="flex items-center justify-between md:py-2">
              <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
              <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
            </td>
            <td className="flex items-center justify-between md:py-2">
              <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
              <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
            </td>
          </div>
        </tr>
      ) : (
        <tr
          className={`w-full cursor-pointer bg-marginalBlack hover:bg-marginalGray-950 border-none
          ${
            isOnlyPosition
              ? "first:[&>td]:rounded-tl-2xl last:[&>td]:rounded-tr-2xl first:[&>td]:rounded-bl-2xl last:[&>td]:rounded-br-2xl [&>td]:border-none"
              : isFirst
                ? "first:[&>td]:rounded-tl-2xl last:[&>td]:rounded-tr-2xl"
                : isLast
                  ? "first:[&>td]:rounded-bl-2xl last:[&>td]:rounded-br-2xl [&>td]:border-none"
                  : ""
          }`}
        >
          <TableCell>
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 rounded-full bg-marginalGray-200"></div>
              <div className="flex flex-col space-y-2">
                <div className="w-24 h-4 rounded bg-marginalGray-200"></div>
                <div className="h-3 rounded w-36 bg-marginalGray-200"></div>
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="w-8 h-4 ml-auto rounded bg-marginalGray-200"></div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="rounded-full w-7 h-7 bg-marginalGray-200"></div>
              <div className="w-10 h-4 rounded bg-marginalGray-200"></div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="rounded-full w-7 h-7 bg-marginalGray-200"></div>
              <div className="w-10 h-4 rounded bg-marginalGray-200"></div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="rounded-full w-7 h-7 bg-marginalGray-200"></div>
              <div className="w-10 h-4 rounded bg-marginalGray-200"></div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center space-x-2">
              <div className="rounded-full w-7 h-7 bg-marginalGray-200"></div>
              <div className="w-10 h-4 rounded bg-marginalGray-200"></div>
            </div>
          </TableCell>
          <TableCell>
            <div className="flex items-center justify-end">
              <div className="w-10 h-4 rounded bg-marginalGray-200"></div>
            </div>
          </TableCell>
        </tr>
      )}
    </>
  )
}

export default Pools

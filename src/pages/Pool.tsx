import _, { isNumber, isUndefined } from "lodash"
import { formatUnits, BigNumberish } from "ethers"
import { useCallback, useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { getPoolAddress, getPoolDataByAddress, usePoolsData } from "../hooks/usePoolsData"
import { ManagePoolContainer } from "../components/ManagePool/ManagePoolContainer"
import { ManagePoolCard } from "../components/ManagePool/ManagePoolCard"
import { ManagePoolHeader } from "../components/ManagePool/ManagePoolTokensHeader"
import { Address, useAccount, useNetwork } from "wagmi"
import { useUserPoolBalance } from "../hooks/useUserPoolBalance"
import { ChevronRightIcon } from "@heroicons/react/24/outline"
import { DoubleCurrencyLogo } from "./Pools"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { shortenAddress } from "../utils/shortenAddress"
import { type PoolData, type Token } from "../types"
import CurrencyLogo from "../components/Logo/CurrencyLogo"
import { Link } from "react-router-dom"
import { getExplorerLink } from "../utils/getExplorerLink"
import { ExplorerDataType } from "../utils/getExplorerLink"
import { EtherscanLogo } from "../components/Icons/Etherscan"
import { ExplorerIcon } from "../components/Icons/ExplorerIcon"
import { ChainId } from "@uniswap/sdk-core"
import useCopyClipboard from "../hooks/useCopyClipboard"
import { getValidAddress } from "../utils/getValidAddress"
import { MouseoverTooltip } from "../components/ToolTip/ToolTip"
import { useErc20TokenBalances } from "../hooks/useErc20TokenBalances"
import { useViewPoolsState } from "../hooks/useViewPoolsState"
import { usePoolLiquidityLocked } from "../hooks/usePoolLiquidityLocked"
import bigDecimal from "js-big-decimal"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { usePoolTotalSupply } from "../hooks/usePoolTotalSupply"
import { useErc20TokenSymbol } from "../hooks/useErc20TokenSymbol"
import { InfoTip } from "../components/ToolTip/ToolTip"
import { Button, PositionHeader } from "./Position"
import { calculateMulDiv } from "../functions/calculateMulDiv"
import { calculatePoolLiquidityTokenAmounts } from "../functions/calculatePoolLiquidityTokenAmounts"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { DEFAULT_CHAIN_ID } from "../constants/chains"
import { SquareStackIcon } from "src/components/Icons/SquareStackIcon"
import { CaretLeftIcon } from "src/components/Icons/CaretLeftIcon"
import { ListRow } from "src/components/List/ListRow"
import { ActionButton } from "src/components/ActionButton"
import { AnimatePresence } from "framer-motion"
import { getPoolMaxLeverage } from "src/functions/getPoolMaxLeverage"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"
import { useNetworkChangeRedirect } from "src/hooks/useNetworkChangeRedirect"
import { calculatePercentageOfTotal } from "src/functions/calculatePercentageOfTotal"
import { useUserStakeBalance } from "src/hooks/useUserStakeBalance"
import { useMultiRewardsData } from "src/hooks/useMultiRewardsData"
import { useGetRewardCallback } from "src/hooks/useGetRewardCallback"
import { useAPRQuotePercentageRate } from "src/hooks/useAPRQuotePercentageRate"
import { calculateAPRQuotePercentageRate } from "src/functions/calculateAPRQuotePercentageRate"
import { MARGINAL_DAO_TOKEN } from "src/constants/tokens"

export const Breadcrumb = ({
  text,
  onNavigate,
}: {
  text: string
  onNavigate: () => void
}) => {
  return (
    <div
      onClick={onNavigate}
      className="flex items-center space-x-1 font-bold tracking-wide cursor-pointer text-marginalGray-200 hover:opacity-50"
    >
      <div>{text}</div>
      <ChevronRightIcon
        width={12}
        height={12}
        className="stroke-2 stroke-marginalGray-200 "
      />
    </div>
  )
}

export const PoolDetailsLink = ({
  chainId,
  address,
  tokens,
}: {
  chainId: number | undefined
  address: string | undefined
  tokens: (Token | null | undefined)[]
}) => {
  const [isCopied, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    const checksummedAddress = getValidAddress(address)
    checksummedAddress && setCopied(checksummedAddress)
  }, [address, setCopied])

  const isPool = tokens.length === 2

  const token0 = tokens[0]
  const token1 = isPool ? tokens[1] : null

  const explorerUrl =
    address && chainId
      ? getExplorerLink(
          chainId,
          address,
          isPool ? ExplorerDataType.ADDRESS : ExplorerDataType.TOKEN,
        )
      : undefined

  return (
    <div className="flex items-center justify-between text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
      <div className="flex items-center space-x-2">
        {isPool ? (
          <DoubleCurrencyLogo token0={token0} token1={token1} size={6} />
        ) : (
          <CurrencyLogo token={token0} size={6} />
        )}

        {isPool ? (
          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <pre>{token0?.symbol}</pre>
              <div className="my-auto">/</div>
              <pre>{token1?.symbol}</pre>
            </div>

            <div className="text-xs text-marginalGray-600">Pool contract</div>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center">
              <pre>{token0?.symbol}</pre>
            </div>

            <div className="text-xs text-marginalGray-600">Token contract</div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <MouseoverTooltip
          hoverContent={<div>{isCopied ? "Copied" : "Copy"}</div>}
          timeoutInMs={isCopied ? 500 : 0}
        >
          <div
            onClick={copy}
            className="flex items-center pl-2.5 pr-2 py-2 space-x-1 cursor-pointer bg-marginalGray-800 rounded-lg border border-transparent
          hover:border-marginalGray-600 active:bg-marginalGray-800 active:text-marginalGray-600 focus:outline-none focus:ring-1 focus:ring-marginalOrange-300"
          >
            <div>{shortenAddress(address)}</div>
            <SquareStackIcon />
          </div>
        </MouseoverTooltip>

        <Link to={explorerUrl ?? "#"} target="_blank" className="p-1 hover:opacity-50">
          <EtherscanLogo />
        </Link>
      </div>
    </div>
  )
}

const PoolDetailsStats = ({
  token0,
  token1,

  token0BalanceTotalFormatted,
  token0BalanceTotalParsed,
  token0BalanceAvailableParsed,
  token0BalanceLockedParsed,

  token1BalanceTotalFormatted,
  token1BalanceTotalParsed,
  token1BalanceAvailableParsed,
  token1BalanceLockedParsed,
}: {
  token0: Token | null
  token1: Token | null

  token0BalanceTotalFormatted: string | undefined | null
  token0BalanceTotalParsed: string | undefined | null
  token0BalanceAvailableParsed: string | undefined | null
  token0BalanceLockedParsed: string | undefined | null

  token1BalanceTotalFormatted: string | undefined | null
  token1BalanceTotalParsed: string | undefined | null
  token1BalanceAvailableParsed: string | undefined | null
  token1BalanceLockedParsed: string | undefined | null
}) => {
  const token0BalanceAvailablePercentage = calculatePercentageOfTotal(
    token0BalanceTotalParsed,
    token0BalanceAvailableParsed,
  )
  const token0BalanceLockedPercentage = calculatePercentageOfTotal(
    token0BalanceTotalParsed,
    token0BalanceLockedParsed,
  )

  const token1BalanceAvailablePercentage = calculatePercentageOfTotal(
    token1BalanceTotalParsed,
    token1BalanceAvailableParsed,
  )
  const token1BalanceLockedPercentage = calculatePercentageOfTotal(
    token1BalanceTotalParsed,
    token1BalanceLockedParsed,
  )

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-marginalGray-600">
        <div className="w-full">Token</div>
        <div className="w-2/3 text-right">Available</div>
        <div className="w-2/3 text-right">Locked</div>
      </div>

      <div className="flex justify-between text-marginalGray-200">
        <div className="flex items-center w-full space-x-1 ">
          <CurrencyLogo token={token0} size={4} />
          <pre>{token0?.symbol}</pre>
        </div>

        <div className="w-2/3 text-right">
          {formatNumberAmount(token0BalanceAvailableParsed)}
        </div>

        <div className="w-2/3 text-right">
          {formatNumberAmount(token0BalanceLockedParsed)}
        </div>
      </div>

      <div className="flex justify-between text-marginalGray-200">
        <div className="flex items-center w-full space-x-1 ">
          <CurrencyLogo token={token1} size={4} />
          <pre>{token1?.symbol}</pre>
        </div>

        <div className="w-2/3 text-right">
          {formatNumberAmount(token1BalanceAvailableParsed)}
        </div>

        <div className="w-2/3 text-right">
          {formatNumberAmount(token1BalanceLockedParsed)}
        </div>
      </div>
    </div>
  )
}

const PoolBalancesChart = ({
  token0,
  token1,
  token0BalanceFormatted,
  token1BalanceFormatted,
}: {
  token0: Token | null
  token1: Token | null
  token0BalanceFormatted: string | undefined | null
  token1BalanceFormatted: string | undefined | null
}) => {
  return (
    <div className="flex flex-col w-full space-y-1 text-white">
      <div className="flex justify-between w-full">
        <div className="flex items-center space-x-2">
          <div>{token0BalanceFormatted}</div>

          <div className="flex items-center space-x-1">
            <CurrencyLogo token={token0} size={5} />
            <pre>{token0?.symbol}</pre>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div>{token1BalanceFormatted}</div>

          <div className="flex items-center space-x-1">
            <CurrencyLogo token={token1} size={5} />
            <pre>{token1?.symbol}</pre>
          </div>
        </div>
      </div>

      <div className="flex w-full">
        <BalanceChartSide
          percentage={50}
          isLeft={true}
          className="w-1/2 bg-marginalOrange-500"
        />
        <BalanceChartSide percentage={50} isLeft={false} className="w-1/2 bg-blue-500" />
      </div>
    </div>
  )
}

const ProgressBar = ({
  percentage,
  className,
}: {
  percentage: number
  className?: string
}) => {
  return (
    <div className="relative w-full h-2 overflow-hidden bg-gray-200 rounded-md">
      <div
        className={`h-full transition-all duration-500 ${className}`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )
}

const BalanceChartSide = ({
  isLeft,
  percentage,
  className,
}: {
  isLeft: boolean
  percentage: number
  className?: string
}) => {
  return (
    <div
      style={{ width: `${percentage}%` }}
      className={`h-2 ${className} ${isLeft ? "rounded-l-lg" : "rounded-r-lg"}`}
    ></div>
  )
}

export const CircularProgressBar = ({
  sqSize = 36,
  percentage = 0,
  strokeWidth = 5,
  className = "stroke-green-500",
}) => {
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - strokeWidth) / 2
  // Enclose circle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * percentage) / 100

  return (
    <svg width={sqSize} height={sqSize} viewBox={viewBox} className={className}>
      <circle
        className="circle-background"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        fill="none"
        stroke="#ddd"
      />
      <circle
        className="circle-progress"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidth}px`}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
        }}
      />
    </svg>
  )
}

const PoolDetailsUtilization = ({
  token0,
  token1,
  token0BalanceParsed,
  token1BalanceParsed,
  poolUtilizationPercentage,

  lpTokenSymbol,
  poolSupplyTotal,
  userPoolBalance,

  token0BalanceTotalFormatted,
  token0BalanceTotalParsed,
  token0BalanceAvailableParsed,
  token0BalanceLockedParsed,

  token1BalanceTotalFormatted,
  token1BalanceTotalParsed,
  token1BalanceAvailableParsed,
  token1BalanceLockedParsed,
}: {
  token0: Token | null
  token1: Token | null
  token0BalanceParsed: string | undefined | null
  token1BalanceParsed: string | undefined | null
  poolUtilizationPercentage: number

  lpTokenSymbol: string | undefined
  poolSupplyTotal: string | undefined
  userPoolBalance: string | null | undefined

  token0BalanceTotalFormatted: string | undefined | null
  token0BalanceTotalParsed: string | undefined | null
  token0BalanceAvailableParsed: string | undefined | null
  token0BalanceLockedParsed: string | undefined | null

  token1BalanceTotalFormatted: string | undefined | null
  token1BalanceTotalParsed: string | undefined | null
  token1BalanceAvailableParsed: string | undefined | null
  token1BalanceLockedParsed: string | undefined | null
}) => {
  return (
    <div className="flex flex-col w-full max-w-lg p-4 space-y-4 text-xs font-bold leading-4 uppercase bg-marginalBlack rounded-xl md:rounded-lg tracking-thin">
      <div className="text-sm text-marginalGray-200">Pool Utilization</div>

      <div className="flex justify-between w-full">
        <div className="flex items-center w-full space-x-2">
          <CircularProgressBar
            sqSize={24}
            strokeWidth={4}
            percentage={poolUtilizationPercentage}
          />
          <div className="text-3xl text-marginalGray-100">
            {poolUtilizationPercentage.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="space-y-1 text-marginalGray-600">
        <ListRow
          item="Total"
          value={
            <div className="text-marginalGray-200">
              {poolSupplyTotal} {lpTokenSymbol}
            </div>
          }
        />
        <ListRow
          item="Your Contributions"
          value={
            <div className="text-marginalGray-200">
              {userPoolBalance} {lpTokenSymbol}
            </div>
          }
        />
      </div>

      <div className="h-[1px] bg-marginalGray-200/20" />

      <div className="text-sm text-marginalGray-200">Pool Composition</div>

      <PoolDetailsStats
        token0={token0}
        token1={token1}
        token0BalanceTotalFormatted={token0BalanceTotalFormatted}
        token0BalanceTotalParsed={token0BalanceTotalParsed}
        token0BalanceAvailableParsed={token0BalanceAvailableParsed}
        token0BalanceLockedParsed={token0BalanceLockedParsed}
        token1BalanceTotalFormatted={token1BalanceTotalFormatted}
        token1BalanceTotalParsed={token1BalanceTotalParsed}
        token1BalanceAvailableParsed={token1BalanceAvailableParsed}
        token1BalanceLockedParsed={token1BalanceLockedParsed}
      />
    </div>
  )
}

const PoolDetailsBalances = ({
  token0,
  token1,
  lpTokenSymbol,
  poolSupplyTotal,
  userPoolBalance,
  token0UserBalance,
  token1UserBalance,
  userOwnedPoolSharePercentage,
}: {
  token0: Token | null | undefined
  token1: Token | null | undefined
  lpTokenSymbol: string | undefined
  poolSupplyTotal: string | undefined
  userPoolBalance: string | null | undefined
  token0UserBalance: string | null | undefined
  token1UserBalance: string | null | undefined
  userOwnedPoolSharePercentage: number
}) => {
  return (
    <div className="mx-auto max-w-[400px] sm:max-w-[450px] p-6 space-y-8 font-bold tracking-wide text-white border border-borderGray rounded-3xl">
      <div className="text-2xl">Balances</div>

      <div className="flex flex-col space-y-4">
        <div className="text-base text-marginalGray-200">Pool LP Supply</div>

        <div className="grid grid-cols-2">
          <div>Total</div>
          <div>
            {poolSupplyTotal} {lpTokenSymbol}
          </div>
        </div>
        <div className="grid grid-cols-2">
          <div>Your contributions</div>
          <div>
            {userPoolBalance} {lpTokenSymbol}
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-base text-marginalGray-200">Your share</div>
        <div className="flex space-x-8">
          <div className="flex items-center p-4 space-x-4">
            <CircularProgressBar percentage={userOwnedPoolSharePercentage} />
            <div className="text-3xl">{userOwnedPoolSharePercentage.toFixed(2)}%</div>
          </div>

          <div className="flex flex-col items-end space-y-3">
            <div className="flex items-center space-x-2 ">
              <div>{formatNumberAmount(token0UserBalance)}</div>

              <div className="flex items-center space-x-1 ">
                <CurrencyLogo token={token0} size={5} />
                <pre>{token0?.symbol}</pre>
              </div>
            </div>

            <div className="flex items-center space-x-2 ">
              <div>{formatNumberAmount(token1UserBalance)}</div>

              <div className="flex items-center space-x-1 ">
                <CurrencyLogo token={token1} size={5} />
                <pre>{token1?.symbol}</pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const Pool = () => {
  const { chain } = useNetwork()
  const { address } = useAccount()
  const { poolsDataByAddress, isLoading } = usePoolsData()
  const { poolAddress: poolAddressKey } = useParams()
  const poolAddress = getPoolAddress(poolAddressKey)
  const pool = getPoolDataByAddress(poolAddress, poolsDataByAddress)
  const poolState = useViewPoolsState(poolAddress)
  const leverageCap = getPoolMaxLeverage(pool?.maintenance)

  const [showRewards, setShowRewards] = useState<boolean>(false)

  const poolLiquidityLockedData = usePoolLiquidityLocked([pool])

  const poolLiquidityAvailable = poolState?.liquidity
  const poolLiquidityLocked = poolLiquidityLockedData?.[0]?.liquidityLocked
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

  const {
    onNavigateToPools,
    onNavigateToAddLiquidity,
    onNavigateToRemoveLiquidity,
    onNavigateToStake,
    onNavigateToUnstake,
  } = useNavigateRoutes()

  useNetworkChangeRedirect(onNavigateToPools)

  const defaultTokens = useDefaultActiveTokens(chain?.id ?? DEFAULT_CHAIN_ID)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(pool?.token0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(pool?.token1, defaultTokensList)

  const { token0: token0LiquidityAvailable, token1: token1LiquidityAvailable } =
    calculatePoolLiquidityTokenAmounts(poolLiquidityAvailable, poolState?.sqrtPriceX96)

  const token0LiquidityAvailableParsed =
    token0LiquidityAvailable &&
    formatBigIntToString(BigInt(token0LiquidityAvailable), token0?.decimals)

  const token1LiquidityAvailableParsed =
    token1LiquidityAvailable &&
    formatBigIntToString(BigInt(token1LiquidityAvailable), token1?.decimals)

  const { token0: token0LiquidityLocked, token1: token1LiquidityLocked } =
    calculatePoolLiquidityTokenAmounts(poolLiquidityLocked, poolState?.sqrtPriceX96)

  const token0LiquidityLockedParsed =
    token0LiquidityLocked &&
    formatBigIntToString(BigInt(token0LiquidityLocked), token0?.decimals)

  const token1LiquidityLockedParsed =
    token1LiquidityLocked &&
    formatBigIntToString(BigInt(token1LiquidityLocked), token1?.decimals)

  const { token0: token0LiquidityTotal, token1: token1LiquidityTotal } =
    calculatePoolLiquidityTokenAmounts(poolLiquidityTotal, poolState?.sqrtPriceX96)

  const token0LiquidityTotalParsed =
    token0LiquidityTotal &&
    formatBigIntToString(BigInt(token0LiquidityTotal), token0?.decimals)

  const token1LiquidityTotalParsed =
    token1LiquidityTotal &&
    formatBigIntToString(BigInt(token1LiquidityTotal), token1?.decimals)

  const token0BalanceFormatted = formatNumberAmount(token0LiquidityTotalParsed)
  const token1BalanceFormatted = formatNumberAmount(token1LiquidityTotalParsed)

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

  const poolSupplyTotal = usePoolTotalSupply([pool])?.[0]
  const lpTokenSymbol = useErc20TokenSymbol(poolAddress as Address)

  const rewardsData = useMultiRewardsData(
    pool?.stakePool as Address,
    token0?.address as Address,
  )

  const durationOneYearInSeconds = 86400 * 365

  const rawAPRQuotePercentageRate = useAPRQuotePercentageRate(
    pool?.poolAddress as Address,
    MARGINAL_DAO_TOKEN as Address,
    pool?.poolAddress as Address,
    durationOneYearInSeconds,
    chain?.id ?? DEFAULT_CHAIN_ID,
  )

  const formattedAPR = calculateAPRQuotePercentageRate(rawAPRQuotePercentageRate)

  const userOwnedPoolSharePercentage = calculatePercentageOfTotal(
    poolSupplyTotal?.parsedTotalSupply,
    isUndefined(formattedAPR)
      ? userPoolBalances?.[0].parsedBalance
      : userPoolBalances?.[0].parsedBalanceWithStaked,
  )

  const token0UserBalance =
    token0LiquidityTotal &&
    calculateMulDiv(
      BigInt(token0LiquidityTotal),
      isUndefined(formattedAPR)
        ? userPoolBalances?.[0].balance
        : userPoolBalances?.[0].balanceWithStaked,
      poolSupplyTotal?.totalSupply,
    )
  const token1UserBalance =
    token1LiquidityTotal &&
    calculateMulDiv(
      BigInt(token1LiquidityTotal),
      isUndefined(formattedAPR)
        ? userPoolBalances?.[0].balance
        : userPoolBalances?.[0].balanceWithStaked,
      poolSupplyTotal?.totalSupply,
    )

  const token0UserBalanceParsed =
    token0UserBalance && formatBigIntToString(BigInt(token0UserBalance), token0?.decimals)

  const token1UserBalanceParsed =
    token1UserBalance && formatBigIntToString(BigInt(token1UserBalance), token1?.decimals)

  console.log("userPoolBalances: ", userPoolBalances)
  const { getRewardCallback } = useGetRewardCallback(
    pool?.stakePool as Address,
    !_.isUndefined(rewardsData),
  )

  const handleClaimCallback = async () => {
    try {
      if (!getRewardCallback) {
        return new Error("Missing claim callback")
      }

      await getRewardCallback()
    } catch (error) {
      console.error("Claim callback error: ", error)
    }
  }

  return (
    <>
      <div className="max-w-[343px] sm:max-w-none w-[343px] sm:w-fit xl:w-[900px] mb-[96px] md:mb-0 md:mt-8 min-w-min mx-auto space-y-4 md:space-y-6">
        <div
          onClick={() => onNavigateToPools()}
          className="flex items-center justify-start space-x-1 cursor-pointer text-marginalGray-200"
        >
          <CaretLeftIcon />
          <span className="text-sm font-bold leading-4 uppercase tracking-thin">
            Back to Pools
          </span>
        </div>

        <div className="border shadow-outerBlack rounded-3xl bg-marginalGray-900 border-marginalGray-800">
          {isLoading ? (
            <>
              <div
                id="pool-loading-header"
                className="flex flex-col items-start w-full px-4 py-4 space-y-4 border-b md:space-y-0 md:flex-row md:justify-between md:gap-4 md:items-center md:px-4 md:py-4 border-marginalGray-800 rounded-t-3xl"
              >
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-14 rounded-xl bg-marginalGray-800"></div>

                  <div className="flex flex-col space-y-0.5">
                    <div className="h-6 w-28 rounded-xl bg-marginalGray-800"></div>

                    <div className="h-4 w-60 rounded-xl bg-marginalGray-800"></div>
                  </div>
                </div>
                <div className="flex justify-center w-full space-x-2 md:w-fit md:justify-end md:space-x-4">
                  <div className="h-10 w-36 rounded-xl bg-marginalGray-800"></div>
                  <div className="h-10 w-36 rounded-xl bg-marginalGray-800"></div>
                </div>
              </div>

              <div className="flex flex-col w-full p-2 space-x-0 md:flex-row md:space-x-2 md:p-4">
                <div className="flex flex-col w-full space-y-1 min-w-80 rounded-3xl">
                  <div className="flex flex-col w-full max-w-lg p-4 space-y-4 text-xs font-bold leading-4 uppercase bg-marginalBlack rounded-xl md:rounded-lg tracking-thin">
                    <div className="h-4 w-28 rounded-xl bg-marginalGray-800"></div>

                    <div className="flex justify-between w-full">
                      <div className="flex items-center w-full space-x-2">
                        <div className="w-6 h-6 rounded-xl bg-marginalGray-800"></div>
                        <div className="h-8 w-28 rounded-xl bg-marginalGray-800"></div>
                      </div>

                      <div className="flex flex-col items-end space-y-1 text-marginalGray-200">
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>
                    </div>

                    <div className="flex justify-between w-full">
                      <div className="h-4 w-11 rounded-xl bg-marginalGray-800"></div>
                      <div className="h-4 w-28 rounded-xl bg-marginalGray-800"></div>
                    </div>

                    <div className="h-[1px] bg-marginalGray-200/20" />

                    <div className="h-4 w-28 rounded-xl bg-marginalGray-800"></div>

                    <div className="flex justify-between">
                      <div className="flex flex-col items-start w-full space-y-3">
                        <div className="w-10 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-12 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-12 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>

                      <div className="flex flex-col items-end w-full space-y-3">
                        <div className="w-12 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-16 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>

                      <div className="flex flex-col items-end w-full space-y-3">
                        <div className="h-4 w-7 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-16 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col w-full max-w-lg p-4 space-y-4 text-xs font-bold leading-4 uppercase bg-marginalBlack rounded-xl md:rounded-lg tracking-thin">
                    <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>

                    <div className="space-y-1">
                      <div className="flex justify-between w-full">
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-12 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>

                      <div className="flex justify-between w-full">
                        <div className="w-12 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-w-[347px] w-min space-y-1">
                  <div className="max-w-[347px] h-fit flex flex-col bg-marginalBlack mt-2 md:mt-0 space-y-3 p-4 rounded-xl md:rounded-lg w-full text-xs leading-4 tracking-thin font-bold uppercase">
                    <div className="h-4 w-28 rounded-xl bg-marginalGray-800"></div>

                    <div className="flex justify-between w-full">
                      <div className="h-8 w-28 rounded-xl bg-marginalGray-800"></div>

                      <div className="flex flex-col items-end space-y-1 text-marginalGray-200">
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-marginalGray-200/20" />

                    <div className="space-y-3">
                      <div className="w-12 h-4 rounded-xl bg-marginalGray-800"></div>
                      <div className="flex justify-between w-full">
                        <div className="h-6 w-28 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>

                      <div className="flex justify-between space-x-3">
                        <div className="w-full h-10 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-full h-10 rounded-xl bg-marginalGray-800"></div>
                      </div>
                    </div>
                  </div>

                  <div className="max-w-[347px] h-fit flex flex-col bg-marginalBlack mt-4 md:mt-0 space-y-3 p-4 rounded-xl md:rounded-lg w-full text-xs leading-4 tracking-thin font-bold uppercase">
                    <div className="h-4 w-28 rounded-xl bg-marginalGray-800"></div>

                    <div className="flex justify-between w-full">
                      <div className="h-8 w-28 rounded-xl bg-marginalGray-800"></div>

                      <div className="flex flex-col items-end space-y-1 text-marginalGray-200">
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                        <div className="w-20 h-4 rounded-xl bg-marginalGray-800"></div>
                      </div>
                    </div>
                    <div className="w-full h-10 rounded-xl bg-marginalGray-800"></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <PositionHeader
                token0={token0}
                token1={token1}
                isLong={undefined}
                leverageCurrentFormatted={undefined}
                handlePrimaryButton={() => onNavigateToAddLiquidity(poolAddress)}
                handleSecondaryButton={() => onNavigateToRemoveLiquidity(poolAddress)}
                primaryText="Add Liquidity"
                secondaryText="Remove Liquidity"
              />

              <div className="flex flex-col w-full p-2 space-x-0 md:flex-row md:space-x-2 md:p-4">
                <div className="flex flex-col w-full space-y-1 min-w-80 rounded-3xl">
                  <PoolDetailsUtilization
                    token0={token0}
                    token1={token1}
                    token0BalanceParsed={token0BalanceFormatted}
                    token1BalanceParsed={token1BalanceFormatted}
                    poolUtilizationPercentage={parseFloat(poolUtilizationPercentage)}
                    lpTokenSymbol={lpTokenSymbol}
                    poolSupplyTotal={poolSupplyTotal?.parsedTotalSupply}
                    userPoolBalance={
                      isUndefined(formattedAPR)
                        ? userPoolBalances?.[0].parsedBalance
                        : userPoolBalances?.[0].parsedBalanceWithStaked
                    }
                    token0BalanceTotalFormatted={token0BalanceFormatted}
                    token0BalanceTotalParsed={token0LiquidityTotalParsed}
                    token0BalanceAvailableParsed={token0LiquidityAvailableParsed}
                    token0BalanceLockedParsed={token0LiquidityLockedParsed}
                    token1BalanceTotalFormatted={token1BalanceFormatted}
                    token1BalanceTotalParsed={token1LiquidityTotalParsed}
                    token1BalanceAvailableParsed={token1LiquidityAvailableParsed}
                    token1BalanceLockedParsed={token1LiquidityLockedParsed}
                  />

                  <div className="flex flex-col w-full max-w-lg p-4 space-y-4 text-xs font-bold leading-4 uppercase bg-marginalBlack rounded-xl md:rounded-lg tracking-thin">
                    <div className="text-sm text-marginalGray-200">Pool Details</div>

                    <div className="space-y-1 text-marginalGray-600">
                      <ListRow
                        item="Leverage"
                        value={
                          <div className="text-marginalGray-200">{leverageCap}x</div>
                        }
                      />
                      <ListRow
                        item="TVL"
                        value={<div className="text-marginalGray-200">-</div>}
                      />
                    </div>
                  </div>
                </div>

                <div className="min-w-[347px] w-min space-y-1">
                  <div className="max-w-[347px] h-fit flex flex-col bg-marginalBlack mt-2 md:mt-0 space-y-3 p-4 rounded-xl md:rounded-lg w-full text-xs leading-4 tracking-thin font-bold uppercase">
                    <div className="text-sm text-marginalGray-200">My Share</div>

                    <div className="flex justify-between w-full">
                      <div className="text-3xl text-marginalGray-100">
                        {userOwnedPoolSharePercentage.toFixed(2)}%
                      </div>

                      <div className="flex flex-col items-end space-y-1 text-marginalGray-200">
                        <div className="flex items-center space-x-1">
                          <div>{formatNumberAmount(token0UserBalanceParsed)}</div>

                          <div className="flex items-center space-x-1 ">
                            <CurrencyLogo token={token0} size={4} />
                            <pre>{token0?.symbol}</pre>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <div>{formatNumberAmount(token1UserBalanceParsed)}</div>

                          <div className="flex items-center space-x-1 ">
                            <CurrencyLogo token={token1} size={4} />
                            <pre>{token1?.symbol}</pre>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-marginalGray-200/20" />

                    <div className="space-y-3">
                      <div className="text-sm text-marginalGray-600">Staked</div>
                      <div className="flex items-center justify-between text-marginalGray-600">
                        <div className="flex items-center text-base font-bold uppercase gap-x-2 tracking-thin text-marginalGray-200">
                          {parsedUserStakeBalance} MARGV1-LP
                        </div>

                        <div className="flex items-center text-sm font-bold uppercase gap-x-2 tracking-thin text-marginalGray-200">
                          <span className="text-marginalGray-600">APR</span>
                          {formattedAPR || "-"}%
                        </div>
                      </div>

                      <div className="flex space-x-4">
                        <ActionButton
                          action="Stake"
                          onClick={() => {
                            onNavigateToStake(poolAddress)
                          }}
                          primary={false}
                          size="sm"
                        />
                        <ActionButton
                          action="Unstake"
                          onClick={() => {
                            onNavigateToUnstake(poolAddress)
                          }}
                          primary={false}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TODO: Add Rewards */}
                  {!showRewards && (
                    <div className="max-w-[347px] h-fit flex flex-col bg-marginalBlack mt-4 md:mt-0 space-y-3 p-4 rounded-xl md:rounded-lg w-full text-xs leading-4 tracking-thin font-bold uppercase">
                      <div className="text-sm text-marginalGray-600">Rewards</div>

                      <div className="flex justify-between w-full">
                        <div className="text-3xl text-marginalGray-100">$0.00</div>

                        <div className="flex flex-col items-end space-y-1 text-marginalGray-200">
                          <div className="flex items-center space-x-1">
                            <div>0.00</div>

                            <div className="flex items-center space-x-1 ">
                              <CurrencyLogo token={token0} size={4} />
                              <pre>{token0?.symbol}</pre>
                              <pre>≈</pre>
                              <pre>0.00</pre>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <div>0.00</div>

                            <div className="flex items-center space-x-1 ">
                              <CurrencyLogo token={token1} size={4} />
                              <pre>{token1?.symbol}</pre>
                              <pre>≈</pre>
                              <pre>0.00</pre>
                            </div>
                          </div>
                        </div>
                      </div>
                      <ActionButton
                        action="Claim"
                        onClick={() => {
                          handleClaimCallback()
                          console.log("Claiming Rewards...")
                        }}
                        primary={false}
                        size="sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {isLoading ? (
          <div className="space-y-4 md:px-4 md:pb-4">
            <div className="h-6 w-28 rounded-xl bg-marginalGray-800"></div>
            <div className="flex flex-col space-y-6 sm:flex-row md:space-y-0">
              <div className="flex flex-col w-full space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-6 rounded-xl bg-marginalGray-800"></div>
                    <div className="w-20 h-8 rounded-xl bg-marginalGray-800"></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-8 rounded-xl bg-marginalGray-800"></div>
                    <div className="w-8 h-8 rounded-xl bg-marginalGray-800"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-xl bg-marginalGray-800"></div>
                    <div className="w-20 h-8 rounded-xl bg-marginalGray-800"></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-8 rounded-xl bg-marginalGray-800"></div>
                    <div className="w-8 h-8 rounded-xl bg-marginalGray-800"></div>
                  </div>
                </div>
              </div>

              <div className="hidden md:block mx-6 w-[1px] h-[88px] bg-marginalGray-200/20" />

              <div className="flex flex-col w-full space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-xl bg-marginalGray-800"></div>
                    <div className="w-20 h-8 rounded-xl bg-marginalGray-800"></div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-8 rounded-xl bg-marginalGray-800"></div>
                    <div className="w-8 h-8 rounded-xl bg-marginalGray-800"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 md:px-4 md:pb-4">
            <div className="text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
              Links
            </div>
            <div className="flex flex-col space-y-6 sm:flex-row md:space-y-0">
              <div className="flex flex-col w-full space-y-6">
                <PoolDetailsLink
                  chainId={chain?.id ?? DEFAULT_CHAIN_ID}
                  address={poolAddress}
                  tokens={[token0, token1]}
                />
                <PoolDetailsLink
                  chainId={chain?.id ?? DEFAULT_CHAIN_ID}
                  address={token0?.address}
                  tokens={[token0]}
                />
              </div>

              <div className="hidden md:block mx-6 w-[1px] h-[88px] bg-marginalGray-200/20" />

              <div className="flex flex-col w-full space-y-6">
                <PoolDetailsLink
                  chainId={chain?.id ?? DEFAULT_CHAIN_ID}
                  address={token1?.address}
                  tokens={[token1]}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Pool

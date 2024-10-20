import { useParams } from "react-router-dom"
import { useCallback, useRef } from "react"
import { useAccount, Address } from "wagmi"
import { usePositionsQuery } from "../hooks/usePositionsQuery"
import { filterPositionsByKey } from "../functions/filterPositionsByIndexedId"
import { usePositionQuery } from "../hooks/usePositionQuery"
import { useTokenUri } from "../hooks/useTokenUri"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { isNull, isUndefined } from "lodash"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { convertMaintenanceToLeverage } from "../functions/convertMaintenanceToLeverage"
import { calculatePositionLeverage } from "../functions/calculatePositionLeverage"
import { constructIgniteParams } from "../functions/constructQuoteIgniteParams"
import { useViewQuoteIgnite } from "../hooks/useViewQuoteIgnite"
import {
  V1_NFT_POSITION_MANAGER_ADDRESS,
  V1_QUOTER_ADDRESS,
} from "../constants/addresses"
import { WRAPPED_GAS_TOKEN_MAP } from "src/constants/tokens"
import { calculatePositionRawPnL } from "../functions/calculatePnL"
import { calculatePnLByPercentage } from "../functions/calculatePnL"
import { useLiquidationPrice } from "../hooks/useLiquidationPrice"
import { useOraclePoolPrices } from "../hooks/useOraclePoolPrices"
import { convertX96FundingRate } from "../functions/convertX96FundingRate"
import { convertX96Prices } from "../functions/convertX96Prices"
import { DoubleCurrencyLogo } from "./Pools"
import { NFT, LoadingNFT } from "../components/NFT/NFT"
import CurrencyLogo from "../components/Logo/CurrencyLogo"
import { shortenAddress } from "../utils/shortenAddress"
import { type Token } from "../types"
import { InfoTip, MouseoverTooltip } from "../components/ToolTip/ToolTip"
import { Link } from "react-router-dom"
import { EtherscanLogo } from "../components/Icons/Etherscan"
import { getExplorerLink, ExplorerDataType } from "../utils/getExplorerLink"
import useCopyClipboard from "../hooks/useCopyClipboard"
import { getValidAddress } from "../utils/getValidAddress"
import { PoolDetailsLink } from "./Pool"
import { useContainerDimensions } from "../hooks/useContainerDimensions"
import { usePositionData } from "../hooks/usePositionData"
import { calculateHealthFactor } from "../functions/calculateHealthFactor"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"
import { useApplicationState } from "src/state/application/hooks"
import { CaretLeftIcon } from "src/components/Icons/CaretLeftIcon"
import { HealthFactorIcon } from "src/components/Icons/HealthFactorIcon"
import { SquareStackIcon } from "src/components/Icons/SquareStackIcon"
import { useMobileView } from "src/hooks/useMobileView"
import { ActionButton } from "src/components/ActionButton"
import { AssetPairPriceRatio } from "src/components/Trade/TradeDetailList"
import { useInversePrice } from "src/hooks/useInversePrice"
import { calculateInversablePrices } from "src/functions/calculateInversablePrices"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"
import { useNetworkChangeRedirect } from "src/hooks/useNetworkChangeRedirect"

const Position = () => {
  const { isMobileView } = useMobileView()
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const { positionKey } = useParams()
  const { positionQueryData } = usePositionQuery(positionKey)
  const { positions, isLoading: isLoadingQuery } = usePositionsQuery(address)
  const position = filterPositionsByKey(positionKey, positions)
  const tokenId = position?.tokenId
  const [useInverse, onToggleInverse] = useInversePrice()

  const {
    onNavigateToPositions,
    onNavigateToPool,
    onNavigateToManagePosition,
    onNavigateToClosePosition,
  } = useNavigateRoutes()

  useNetworkChangeRedirect(onNavigateToPositions)

  const { position: positionData, isLoading: isLoadingData } = usePositionData(
    tokenId,
    positionQueryData,
    chainId,
  )

  const pool = positionData?.pool
  const metadata = useTokenUri(tokenId, chainId)

  const zeroForOne: boolean | undefined = positionData?.zeroForOne
  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(pool?.token0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(pool?.token1, defaultTokensList)

  const [marginToken, debtToken] = zeroForOne ? [token1, token0] : [token0, token1]
  const isLong = !isUndefined(zeroForOne)
    ? (!zeroForOne && isWrappedGasToken(token1, chainId)) ||
      (zeroForOne && isWrappedGasToken(token0, chainId))
    : undefined

  const sizeRaw = positionData?.size
  const sizeParsed = sizeRaw && formatBigIntToString(sizeRaw, marginToken?.decimals)
  const sizeFormatted = formatNumberAmount(sizeParsed, true)

  const marginRaw = positionData?.margin
  const marginParsed = marginRaw && formatBigIntToString(marginRaw, marginToken?.decimals)
  const marginFormatted = formatNumberAmount(marginParsed)

  const totalSize = marginRaw && sizeRaw && marginRaw + sizeRaw
  const totalSizeParsed =
    totalSize && formatBigIntToString(totalSize, marginToken?.decimals)
  const totalSizeFormatted = formatNumberAmount(totalSizeParsed, true)

  const debtRaw = positionData?.debt
  const debtParsed = debtRaw && formatBigIntToString(debtRaw, debtToken?.decimals)
  const debtFormatted = formatNumberAmount(debtParsed, true)

  const safeMarginMinRaw = positionData?.safeMarginMinimum
  const safeMarginMinParsed =
    safeMarginMinRaw && formatBigIntToString(safeMarginMinRaw, marginToken?.decimals)
  const safeMarginMinFormatted = formatNumberAmount(safeMarginMinParsed, true)

  const rewardsRaw = positionData?.rewards
  const rewardsParsed = rewardsRaw && formatBigIntToString(rewardsRaw, 18)
  const rewardsFormatted = formatNumberAmount(rewardsParsed, true)

  const poolMaintenance = positionData?.pool?.maintenance
  const leverageMax = poolMaintenance && convertMaintenanceToLeverage(poolMaintenance)
  const leverageCurrent = calculatePositionLeverage(marginRaw, sizeRaw)
  const leverageCurrentFormatted = formatNumberAmount(leverageCurrent, true)

  const igniteParams = constructIgniteParams(
    pool?.token0,
    pool?.token1,
    pool?.maintenance,
    pool?.oracle,
    tokenId,
    "0", // TODO: Create function to calculate via slippage
    address,
    undefined,
    "0",
  )
  const [igniteQuote] = useViewQuoteIgnite(
    V1_QUOTER_ADDRESS[chainId],
    igniteParams,
    marginToken,
    chainId,
  )
  const quotedAmountOut: bigint | undefined = igniteQuote?.amountOut
  const quotedRewards: bigint | undefined = igniteQuote?.rewards
  // @dev useViewQuoteIgnite already removes rewards if margin is WETH so no need here
  let netQuotedAmountOut: bigint | undefined = quotedAmountOut

  const profitLossRaw = calculatePositionRawPnL(netQuotedAmountOut, marginRaw)
  const profitLossParsed =
    profitLossRaw && formatBigIntToString(BigInt(profitLossRaw), marginToken?.decimals)
  const profitLossFormatted = formatNumberAmount(profitLossParsed, true)

  const profitLossPercentage = calculatePnLByPercentage(profitLossRaw, marginRaw)
  const profitLossPercentageFormatted = formatNumberAmount(
    profitLossPercentage?.toString(),
    true,
  )

  const isPositionInProfit = profitLossPercentage ? profitLossPercentage > 0 : undefined

  const liquidationPriceX96 = useLiquidationPrice(
    chainId,
    positionData?.zeroForOne,
    positionData?.size,
    positionData?.debt,
    positionData?.margin,
    positionData?.pool?.maintenance,
  )

  const { sqrtPriceX96, oracleSqrtPriceX96, fundingRatioX96 } = useOraclePoolPrices(
    chainId,
    token0?.address as Address,
    token1?.address as Address,
    poolMaintenance,
    pool?.oracle as Address,
  )

  const oraclePriceParsed = convertX96Prices(
    oracleSqrtPriceX96,
    pool?.token0,
    pool?.token1,
  )
  const oraclePriceFormatted = formatNumberAmount(oraclePriceParsed, true)

  const liquidationPriceParsed = convertX96Prices(
    liquidationPriceX96 as string,
    pool?.token0,
    pool?.token1,
  )
  const liquidationPriceFormatted = formatNumberAmount(liquidationPriceParsed, true)

  const fundingRateParsed = convertX96FundingRate(fundingRatioX96)
  const fundingRateParsedSigned =
    fundingRateParsed && !isWrappedGasToken(token1, chainId)
      ? -fundingRateParsed
      : fundingRateParsed
  const fundingRateFormatted = formatNumberAmount(
    fundingRateParsedSigned?.toString(),
    true,
  )

  const poolPriceParsed = convertX96Prices(sqrtPriceX96, pool?.token0, pool?.token1)
  const poolPriceFormatted = formatNumberAmount(poolPriceParsed, true)

  const { oraclePrice, poolPrice, liquidationPrice } = calculateInversablePrices(
    useInverse,
    oracleSqrtPriceX96,
    sqrtPriceX96,
    liquidationPriceX96,
    pool?.token0,
    pool?.token1,
  )

  const healthFactor = calculateHealthFactor(
    positionData?.margin,
    positionData?.safeMarginMinimum,
  )

  let healthFactorIndicator

  if (isNull(healthFactor)) {
    healthFactorIndicator = "text-white"
  } else if (healthFactor <= 1.25) {
    healthFactorIndicator = "text-error-500"
  } else if (healthFactor <= 1.5) {
    healthFactorIndicator = "text-warning-500"
  } else if (1.5 < healthFactor) {
    healthFactorIndicator = "text-success-500"
  }

  const isLoading = isLoadingData || isLoadingQuery

  const componentRef = useRef(null)
  const { width, height } = useContainerDimensions(componentRef, !isLoading)

  const nftWidth = isMobileView ? 327 : width > 0 ? width : 350
  const nftHeight = isMobileView ? 327 : height > 0 ? height : 350

  if (isLoading) {
    return (
      <div className="max-w-[343px] md:max-w-none w-[343px] sm:w-fit xl:w-[900px] mb-[96px] md:mb-0 md:mt-16 mx-auto space-y-4 md:space-y-0 md:space-x-4 flex flex-col lg:flex-row lg:justify-between shadow-outerBlack rounded-3xl">
        <div className="flex justify-center">
          <LoadingNFT height={nftWidth > 0 ? nftWidth : 400} />
        </div>
        <div className="flex flex-col items-center justify-start w-full p-4 bg-marginalBlack rounded-xl md:rounded-lg">
          <PositionDetailsLoading />
          <PositionDetailsLoading />
          <PositionDetailsLoading />
          <PositionDetailsLoading />
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[343px] w-[343px] md:max-w-none sm:w-fit xl:w-[900px] mb-[96px] md:mb-0 md:mt-8 mx-auto space-y-4 md:space-y-6">
      <div
        onClick={() => onNavigateToPositions()}
        className="flex items-center justify-start space-x-1 cursor-pointer text-marginalGray-200"
      >
        <CaretLeftIcon />
        <span className="text-sm font-bold leading-4 uppercase tracking-thin">
          Back to Positions
        </span>
      </div>

      <div className="border shadow-outerBlack rounded-3xl bg-marginalGray-900 border-marginalGray-800">
        <PositionHeader
          token0={token0}
          token1={token1}
          isLong={isLong}
          leverageCurrentFormatted={leverageCurrentFormatted}
          handlePrimaryButton={() => onNavigateToManagePosition(positionKey)}
          handleSecondaryButton={() => onNavigateToClosePosition(positionKey)}
        />
        <div className="flex flex-col w-full p-2 space-y-4 md:flex-row rounded-3xl md:p-4 md:space-y-0 md:space-x-2">
          <div className="flex w-full overflow-hidden">
            {metadata?.image ? (
              <NFT image={metadata.image} height={nftHeight > 0 ? nftHeight : 400} />
            ) : (
              <LoadingNFT height={400} />
            )}
          </div>
          <PositionDetailsOverview
            childRef={componentRef}
            chainId={chainId}
            tokenId={tokenId}
            marginToken={marginToken}
            debtToken={debtToken}
            totalSizeFormatted={totalSizeFormatted}
            marginFormatted={marginFormatted}
            debtFormatted={debtFormatted}
            leverageCurrentFormatted={leverageCurrentFormatted}
            profitLossFormatted={profitLossFormatted}
            profitLossPercentageFormatted={profitLossPercentageFormatted}
            isPositionInProfit={isPositionInProfit}
            liquidationPriceFormatted={liquidationPriceFormatted}
            escrowRewardsFormatted={rewardsFormatted}
            token0={token0}
            token1={token1}
            oraclePriceFormatted={oraclePriceFormatted}
            poolPriceFormatted={poolPriceFormatted}
            fundingRateFormatted={fundingRateFormatted}
            safeMarginMinFormatted={safeMarginMinFormatted}
            healthFactor={healthFactor}
            healthFactorIndicator={healthFactorIndicator}
            liquidationPrice={formatNumberAmount(liquidationPrice, true)}
            oraclePrice={formatNumberAmount(oraclePrice, true)}
            poolPrice={formatNumberAmount(poolPrice, true)}
            useInverse={useInverse}
            onToggleInverse={onToggleInverse}
          />
        </div>
      </div>

      <div className="space-y-4 md:px-4 md:pb-4">
        <div className="text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
          Links
        </div>
        <div className="flex flex-col space-y-6 md:flex-row md:space-y-0">
          <div className="flex flex-col w-full space-y-6">
            <PoolDetailsLink
              chainId={chainId}
              address={pool?.address}
              tokens={[token0, token1]}
            />
            <PoolDetailsLink
              chainId={chainId}
              address={token0?.address}
              tokens={[token0]}
            />
          </div>

          <div className="hidden md:block mx-6 w-[1px] h-[88px] bg-marginalGray-200/20" />

          <div className="flex flex-col w-full space-y-6">
            <PoolDetailsLink
              chainId={chainId}
              address={token1?.address}
              tokens={[token1]}
            />
            <ContractDetailsLink
              chainId={chainId}
              address={V1_NFT_POSITION_MANAGER_ADDRESS[chainId]}
              contractName="NFT Position Manager"
              contractDescription="Position contract"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Position

export const PositionHeader = ({
  token0,
  token1,
  isLong,
  leverageCurrentFormatted,
  handlePrimaryButton,
  handleSecondaryButton,
  primaryText = "Manage Position",
  secondaryText = "Close Position",
}: {
  token0: Token | null
  token1: Token | null
  isLong: boolean | null | undefined
  leverageCurrentFormatted: string | null | undefined
  handlePrimaryButton: () => void
  handleSecondaryButton: () => void
  primaryText?: string
  secondaryText?: string
}) => {
  return (
    <div className="flex flex-col items-start w-full px-4 py-4 space-y-4 border-b md:space-y-0 md:flex-row md:justify-between md:gap-4 md:items-center md:px-4 md:py-4 border-marginalGray-800 rounded-t-3xl">
      <div className="flex items-center space-x-2">
        <DoubleCurrencyLogo token0={token0} token1={token1} size={8} />

        <div className="flex flex-col">
          <div className="flex items-center space-x-2 text-lg font-bold leading-5 uppercase tracking-thin text-marginalGray-200">
            <pre>{token0?.symbol}</pre>
            <div className="my-auto">/</div>
            <pre>{token1?.symbol}</pre>

            {leverageCurrentFormatted && !isUndefined(isLong) ? (
              <div
                className={`${
                  isLong
                    ? "text-success-500 bg-success-800"
                    : "text-error-500 bg-error-800"
                } my-auto py-1 px-1.5 gap-2 rounded-lg text-sm font-bold leading-4 uppercase tracking-thin`}
              >
                {isLong ? `LONG` : `SHORT`} {leverageCurrentFormatted}X
              </div>
            ) : (
              <div></div>
            )}
          </div>

          <div className="flex items-center text-xs font-bold leading-4 uppercase flex-nowrap md:flex-wrap lg:flex-nowrap md:text-sm tracking-thin text-marginalGray-600">
            <pre>{token0?.name}</pre>
            <div className="px-0.5 my-auto">∙</div>
            <pre>{token1?.name}</pre>
          </div>
        </div>
      </div>
      <div className="flex justify-center w-full space-x-2 md:w-fit md:justify-end md:space-x-4">
        <ActionButton action={primaryText} onClick={handlePrimaryButton} size="sm" />
        <ActionButton
          action={secondaryText}
          onClick={handleSecondaryButton}
          primary={false}
          size="sm"
        />
      </div>
    </div>
  )
}

const PositionDetailsOverview = ({
  childRef,
  chainId,
  tokenId,
  marginToken,
  debtToken,
  profitLossFormatted,
  isPositionInProfit,
  profitLossPercentageFormatted,
  totalSizeFormatted,
  marginFormatted,
  debtFormatted,
  leverageCurrentFormatted,
  liquidationPriceFormatted,
  escrowRewardsFormatted,

  token0,
  token1,
  oraclePriceFormatted,
  poolPriceFormatted,
  fundingRateFormatted,
  safeMarginMinFormatted,
  healthFactor,
  healthFactorIndicator,

  liquidationPrice,
  oraclePrice,
  poolPrice,
  useInverse,
  onToggleInverse,
}: {
  childRef: React.MutableRefObject<null>
  chainId: number | undefined
  tokenId: string | undefined | null
  marginToken: Token | null
  debtToken: Token | null
  profitLossFormatted: string | null | undefined
  isPositionInProfit: boolean | undefined
  profitLossPercentageFormatted: string | null | undefined
  totalSizeFormatted: string | null | undefined
  marginFormatted: string | null | undefined
  debtFormatted: string | null | undefined
  leverageCurrentFormatted: string | null | undefined
  liquidationPriceFormatted: string | null | undefined
  escrowRewardsFormatted: string | null | undefined

  token0: Token | null
  token1: Token | null
  oraclePriceFormatted: string | null | undefined
  poolPriceFormatted: string | null | undefined
  fundingRateFormatted: string | null | undefined
  safeMarginMinFormatted: string | null | undefined

  healthFactor: number | null
  healthFactorIndicator: string | undefined

  liquidationPrice: string | null | undefined
  oraclePrice: string | null | undefined
  poolPrice: string | null | undefined
  useInverse: boolean
  onToggleInverse: () => void
}) => {
  return (
    <div
      ref={childRef}
      className="flex flex-col w-full space-y-2 text-xs font-bold leading-4 uppercase tracking-thin"
    >
      <div className="p-4 bg-marginalBlack rounded-xl md:rounded-lg w-[327px] md:w-full lg:w-[448px] max-h-68 md:max-h-48">
        <div className="flex flex-col md:flex-row">
          <div className="flex flex-col">
            <div className="mb-2 text-marginalGray-200">P&L</div>
            <div
              className={`mb-1 text-3xl leading-8 tracking-thin font-bold uppercase ${isPositionInProfit ? "text-green-500" : "text-red-500"}`}
            >
              {profitLossPercentageFormatted?.slice(0, 6)}%
            </div>
            <div className="flex items-center space-x-1 text-marginalGray-200">
              <pre
                className={`${isPositionInProfit ? "text-green-500" : "text-red-500"}`}
              >
                {profitLossFormatted}
              </pre>
              <CurrencyLogo token={marginToken} size={4} />
              <pre>{marginToken?.symbol}</pre>
            </div>
          </div>

          <div className="mx-6 w-[1px] bg-marginalGray-200/20" />

          <div className="flex flex-col justify-center w-full mt-4 space-y-2 md:mt-0 text-marginalGray-600">
            {/* <div className="flex items-center justify-between">
              <div>Entry Price</div>

              <div className="flex items-center space-x-1 text-marginalGray-200">
                <pre>-</pre>
                <div className="flex items-center">
                  <pre>{token1?.symbol}</pre>
                  <div>/</div>
                  <pre>{token0?.symbol}</pre>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>Current Price</div>

              <div className="flex items-center space-x-1 text-marginalGray-200">
                <pre>-</pre>
                <div className="flex items-center">
                  <pre>{token1?.symbol}</pre>
                  <div>/</div>
                  <pre>{token0?.symbol}</pre>
                </div>
              </div>
            </div> */}

            <div className="flex justify-start">
              <AssetPairPriceRatio
                token0={token0}
                token1={token1}
                price={poolPrice}
                useInverse={useInverse}
                onToggleInverse={onToggleInverse}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div className="my-3 h-[1px] bg-marginalGray-200/20" />

        <div className="space-y-1 text-marginalGray-600">
          <div className="flex items-center justify-between">
            <div>Oracle price</div>
            <div className="flex items-center space-x-1 text-marginalGray-200">
              <pre>{oraclePrice}</pre>
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
          </div>
          <div className="flex items-center justify-between">
            <div>Liq. price</div>

            <div className="flex items-center space-x-1 text-marginalGray-200">
              <pre>{liquidationPrice}</pre>
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
          </div>

          <div className="flex items-center justify-between">
            <div>Health factor</div>
            <div className={`flex items-center space-x-1 ${healthFactorIndicator}`}>
              <HealthFactorIcon />
              <pre>{healthFactor?.toFixed(2)}</pre>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-marginalBlack rounded-xl md:rounded-lg w-[327px] md:w-full lg:w-[448px] max-h-52">
        <div className="mb-2 text-marginalGray-200">Details</div>

        <div className="space-y-1 text-marginalGray-600">
          <div className="flex items-center justify-between">
            <div>Token ID</div>
            <pre className="text-marginalGray-200">{tokenId}</pre>
          </div>

          <div className="flex items-center justify-between">
            <div>Size</div>

            <div className="flex space-x-1 text-marginalGray-200">
              <pre>{totalSizeFormatted}</pre>
              <pre>{marginToken?.symbol}</pre>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>Debt</div>

            <div className="flex space-x-1 text-marginalGray-200">
              <pre>{debtFormatted}</pre>
              <pre>{debtToken?.symbol}</pre>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>Collateral</div>

            <div className="flex space-x-1 text-marginalGray-200">
              <pre>{marginFormatted}</pre>
              <pre>{marginToken?.symbol}</pre>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>Funding rate</div>
            <pre className="text-marginalGray-200">{fundingRateFormatted}% weekly</pre>
          </div>
        </div>

        <div className="my-3 h-[1px] bg-marginalGray-200/20" />

        <div className="flex items-center justify-between">
          <div className="text-marginalGray-600">Escrow rewards</div>

          <div className="flex space-x-1 text-marginalGray-200">
            <pre>{escrowRewardsFormatted}</pre>
            <CurrencyLogo
              token={chainId ? WRAPPED_GAS_TOKEN_MAP[chainId] : null}
              size={4}
            />
            <pre>ETH</pre>
          </div>
        </div>
      </div>
    </div>
  )
}

const ContractDetailsLink = ({
  chainId,
  address,
  contractName,
  contractDescription,
}: {
  chainId: number | undefined
  address: string | undefined
  contractName: string
  contractDescription: string
}) => {
  const [isCopied, setCopied] = useCopyClipboard()
  const copy = useCallback(() => {
    const checksummedAddress = getValidAddress(address)
    checksummedAddress && setCopied(checksummedAddress)
  }, [address, setCopied])

  const explorerUrl =
    address && chainId
      ? getExplorerLink(chainId, address, ExplorerDataType.ADDRESS)
      : undefined

  return (
    <div className="flex items-center justify-between text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          <div className="flex items-center">
            <pre>{contractName}</pre>
          </div>

          <div className="text-xs text-marginalGray-600">{contractDescription}</div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <MouseoverTooltip
          hoverContent={<div>{isCopied ? "Copied" : "Copy"}</div>}
          timeoutInMs={isCopied ? 500 : 0}
        >
          <div
            onClick={copy}
            className="flex items-center pl-2.5 pr-2 py-2 space-x-1 cursor-pointer bg-marginalGray-800 rounded-lg"
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

export const Button = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode
  onClick?: () => any
  className?: string
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-3 md:px-4 md:py-3 w-full md:w-fit text-sm leading-4 tracking-thin font-bold uppercase 
        duration-200 rounded-xl ${className}
      `}
    >
      {children}
    </button>
  )
}

const PositionDetailsLoading = () => {
  return (
    <div className="flex flex-col w-full p-2 space-y-4 md:flex-row rounded-3xl md:p-4 md:space-y-0 md:space-x-2">
      <div className="flex justify-between space-x-10">
        <div className="w-24 h-4 rounded bg-marginalGray-200 animate-pulse"></div>
        <div className="h-4 rounded w-36 bg-marginalGray-200 animate-pulse"></div>
      </div>
    </div>
  )
}

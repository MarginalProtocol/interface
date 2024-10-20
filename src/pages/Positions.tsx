import _, { isString, isEmpty, isArray, isUndefined, isNull } from "lodash"
import { useState, useEffect, useMemo } from "react"
import { useAccount, useNetwork } from "wagmi"
import { usePositionsQuery } from "../hooks/usePositionsQuery"
import { getPositionsState } from "../functions/getPositionsState"
import { mergePositionDataByTokenId } from "../functions/mergePositionDataByTokenId"
import { TableRow, TableHeaderCell, TableCell, MobileTableCell } from "./Pools"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { DoubleCurrencyLogo } from "./Pools"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { calculatePositionRawPnL } from "../functions/calculatePnL"
import { calculatePnLByPercentage } from "../functions/calculatePnL"
import { getPoolMaxLeverage } from "../functions/getPoolMaxLeverage"
import { CustomConnectButton } from "../components/Header/CustomConnectButton"
import { useMobileView } from "../hooks/useMobileView"
import Pagination from "src/components/Pagination"
import { getMulticallQuoteIgnite } from "src/hooks/getMulticallQuoteIgnite"
import { V1_QUOTER_ADDRESS } from "src/constants/addresses"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"
import { calculateHealthFactor } from "src/functions/calculateHealthFactor"
import { useApplicationState } from "src/state/application/hooks"
import { DirectionToggle } from "src/components/DirectionToggle"
import { CircleStackIcon } from "src/components/Icons/CircleStackIcon"
import { CaretRightIcon } from "src/components/Icons/CaretRightIcon"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"

enum PositionView {
  OPEN = "Open",
  CLOSED = "Closed",
}

const Positions = () => {
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const { isMobileView } = useMobileView()
  const { positions, isLoading } = usePositionsQuery(address)

  const [openPositions, setOpenPositions] = useState<any[] | null>(null)
  const [closedPositions, setClosedPositions] = useState<any[] | null>(null)
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true)
  const [view, setView] = useState<PositionView>(PositionView.OPEN)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [currentPageClosedPositions, setCurrentPageClosedPositions] = useState<
    any[] | null
  >(null)
  const [currentPageOpenPositions, setCurrentPageOpenPositions] = useState<any[] | null>(
    null,
  )

  const handleView = (view: PositionView) => {
    setView(view)
    setCurrentPage(1)
  }

  useEffect(() => {
    if (!address) {
      if (openPositions) setOpenPositions(null)
      if (closedPositions) setClosedPositions(null)
    }
  }, [address, chainId])

  useEffect(() => {
    const activeTokenIds: string[] = []
    const { closedPositions, openPositions } = filterPositionsByStatus(positions)

    if (openPositions) {
      openPositions?.forEach((position: any) => {
        if (isString(position?.tokenId)) {
          activeTokenIds.push(position?.tokenId)
        }
      })
    }

    if (closedPositions) {
      const validClosedPositions = closedPositions.filter(
        (closedPosition) => closedPosition?.marginAmountOut !== null,
      )
      setClosedPositions(validClosedPositions)

      const reversedClosedPositions = validClosedPositions.slice(0).reverse()
      setCurrentPageClosedPositions(
        reversedClosedPositions.slice(
          (currentPage - 1) * 10,
          (currentPage - 1) * 10 + 10,
        ),
      )
    }

    if (!isEmpty(activeTokenIds)) {
      ;(async () => {
        const data = await getPositionsState({ tokenIds: activeTokenIds, chainId })
        const mergedData = mergePositionDataByTokenId(openPositions, data)
        const mergedDataWithIgniteQuotes = await getMulticallQuoteIgnite(
          address,
          V1_QUOTER_ADDRESS[chainId],
          mergedData,
        )
        setOpenPositions(mergedDataWithIgniteQuotes)
        const sortedOpenPositions = mergedDataWithIgniteQuotes
          ?.sort((a, b) => Number(a?.timestamp) - Number(b?.timestamp))
          .reverse()
        setCurrentPageOpenPositions(
          sortedOpenPositions.slice((currentPage - 1) * 10, (currentPage - 1) * 10 + 10),
        )
        setIsDataLoading(false)
      })()
    } else {
      setOpenPositions(null)
    }

    if (!address || (isArray(positions) && isEmpty(activeTokenIds))) {
      setIsDataLoading(false)
    }
  }, [positions, address, currentPage, chainId])

  const hasOpenPositions = isArray(openPositions) && !isEmpty(openPositions)
  const hasClosedPositions = isArray(closedPositions) && !isEmpty(closedPositions)

  return (
    <div className="w-[343px] md:w-[720px] lg:w-[900px] xl:w-[1000px] mb-[96px] md:mb-0 md:mt-12 min-w-max mx-auto shadow-none md:shadow-outerBlack rounded-3xl border border-marginalGray-800 md:border-none">
      <div className="flex flex-col items-start w-full px-4 py-4 space-y-4 border-b md:space-y-0 md:flex-row md:justify-between md:items-center md:px-4 md:py-3 bg-marginalGray-900 border-marginalGray-800 rounded-t-3xl">
        <span className="text-xl leading-6 tracking-thin font-bold uppercase text-[#CACACA]">
          Positions
        </span>
        <div className="w-full md:max-w-48">
          <DirectionToggle
            view={view}
            handlePrimaryClick={() => handleView(PositionView.OPEN)}
            handleSecondaryClick={() => handleView(PositionView.CLOSED)}
          />
        </div>
      </div>

      {/* <div className="h-[1px] bg-marginalGray-800" /> */}

      <table
        className={
          isMobileView
            ? "w-full p-2 text-marginalGray-200 bg-marginalGray-900 rounded-b-3xl border-separate border-spacing-0"
            : "w-full md:w-[720px] lg:w-[900px] xl:w-[1000px] p-2 overflow-hidden bg-marginalGray-900 rounded-b-3xl border-separate border-spacing-0 table-auto"
        }
      >
        <thead className={isMobileView ? "" : ""}>
          {view === "Open" ? (
            <>
              {!hasOpenPositions || isMobileView ? (
                <></>
              ) : (
                <TableRow>
                  <TableHeaderCell align="left">Token</TableHeaderCell>
                  <TableHeaderCell align="left">Pool</TableHeaderCell>
                  <TableHeaderCell>Size</TableHeaderCell>
                  <TableHeaderCell>Collateral</TableHeaderCell>
                  <TableHeaderCell>Health Factor</TableHeaderCell>
                  <TableHeaderCell>Profit/Loss (ROI)</TableHeaderCell>
                </TableRow>
              )}
            </>
          ) : (
            <>
              {!hasClosedPositions || isMobileView ? (
                <></>
              ) : (
                <TableRow>
                  <TableHeaderCell align="left">Token</TableHeaderCell>
                  <TableHeaderCell align="left">Pool</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Closing Payout</TableHeaderCell>
                  <TableHeaderCell>Profit/Loss (ROI)</TableHeaderCell>
                </TableRow>
              )}
            </>
          )}
        </thead>
        {view === "Open" ? (
          <tbody>
            {address && isDataLoading ? (
              <>
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={true}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={true}
                />
              </>
            ) : hasOpenPositions && currentPageOpenPositions ? (
              currentPageOpenPositions.map((positionData: any) => {
                if (positionData) {
                  return (
                    <OpenPositionRow
                      chainId={chainId}
                      positionData={positionData}
                      isMobile={isMobileView}
                      isOnlyPosition={currentPageOpenPositions.length === 1}
                      isFirst={
                        currentPageOpenPositions[0]?.tokenId === positionData?.tokenId
                      }
                      isLast={
                        currentPageOpenPositions[currentPageOpenPositions.length - 1]
                          ?.tokenId === positionData?.tokenId
                      }
                    />
                  )
                }
              })
            ) : (
              <EmptyPositionsContainer isOpen={true} showConnect={!!address} />
            )}
          </tbody>
        ) : (
          <tbody>
            {address && isDataLoading ? (
              <>
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={true}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={false}
                />
                <PositionRowLoading
                  isMobile={isMobileView}
                  isOnlyPosition={false}
                  isFirst={false}
                  isLast={true}
                />
              </>
            ) : hasClosedPositions && currentPageClosedPositions ? (
              currentPageClosedPositions.map((positionData: any) => {
                return (
                  <ClosedPositionRow
                    chainId={chainId}
                    positionData={positionData}
                    isMobile={isMobileView}
                    isOnlyPosition={currentPageClosedPositions.length === 1}
                    isFirst={
                      currentPageClosedPositions[0]?.tokenId === positionData?.tokenId
                    }
                    isLast={
                      currentPageClosedPositions[currentPageClosedPositions.length - 1]
                        ?.tokenId === positionData?.tokenId
                    }
                  />
                )
              })
            ) : (
              <EmptyPositionsContainer isOpen={false} showConnect={!!address} />
            )}
          </tbody>
        )}
      </table>
      {view === "Open" ? (
        <>
          {hasOpenPositions && (
            <Pagination
              totalCount={openPositions?.length}
              pageSize={10}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      ) : (
        <>
          {hasClosedPositions && (
            <Pagination
              totalCount={closedPositions?.length}
              pageSize={10}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  )
}

const EmptyPositionsContainer = ({
  isOpen,
  showConnect,
}: {
  isOpen: boolean
  showConnect: boolean
}) => {
  return (
    <tr className="w-full h-[416px] md:h-72 flex justify-center items-center bg-marginalGray-900 rounded-b-2xl md:bg-none md:rounded-b-3xl p-2">
      <td className="flex flex-col items-center justify-center w-full h-full space-y-6 bg-marginalGray-950 rounded-xl md:bg-marginalBlack md:rounded-3xl">
        <div className="flex flex-col items-center space-y-4 max-w-52 text-marginalGray-200">
          <CircleStackIcon />
          <div className="text-sm font-bold leading-4 text-center uppercase tracking-thin text-marginalGray-400">
            Your {isOpen ? "open" : "closed"} positions will appear here.
          </div>
        </div>
        {!showConnect && <CustomConnectButton />}
      </td>
    </tr>
  )
}

const OpenPositionRow = ({
  chainId,
  positionData,
  isMobile,
  isOnlyPosition,
  isFirst,
  isLast,
}: {
  chainId: number
  positionData: any
  isMobile: boolean
  isOnlyPosition: boolean
  isFirst: boolean
  isLast: boolean
}) => {
  const positionKey = positionData?.id
  const tokenId = positionData?.tokenId
  const pool = positionData?.pool
  const { onNavigateToPosition } = useNavigateRoutes()
  const handleNavigateToPosition = () => onNavigateToPosition(positionKey)

  const zeroForOne: boolean | undefined = positionData?.zeroForOne
  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(pool?.token0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(pool?.token1, defaultTokensList)
  const leverageCap = getPoolMaxLeverage(pool?.maintenance)

  const [marginToken, debtToken] = zeroForOne ? [token1, token0] : [token0, token1]

  const sizeRaw = positionData?.size && BigInt(positionData?.size)
  const sizeParsed = sizeRaw && formatBigIntToString(sizeRaw, marginToken?.decimals)
  const sizeFormatted = formatNumberAmount(sizeParsed)

  const marginRaw = positionData?.margin && BigInt(positionData?.margin)
  const marginParsed = sizeRaw && formatBigIntToString(marginRaw, marginToken?.decimals)
  const marginFormatted = formatNumberAmount(marginParsed)

  const totalSize = marginRaw && sizeRaw && marginRaw + sizeRaw
  const totalSizeParsed =
    totalSize && formatBigIntToString(totalSize, marginToken?.decimals)
  const totalSizeFormatted = formatNumberAmount(totalSizeParsed, true)

  const debtRaw = positionData?.debt
  const debtParsed = debtRaw && formatBigIntToString(debtRaw, debtToken?.decimals)
  const debtFormatted = formatNumberAmount(debtParsed)

  const safeMarginMinRaw = positionData?.safeMarginMinimum
  const safeMarginMinParsed =
    safeMarginMinRaw && formatBigIntToString(safeMarginMinRaw, marginToken?.decimals)
  const safeMarginMinFormatted = formatNumberAmount(safeMarginMinParsed)

  const quotedAmountOut: bigint | undefined = positionData?.quotedMarginAmountOut
  const quotedRewards: bigint | undefined = positionData?.quotedRewards
  let netQuotedAmountOut: bigint | undefined = quotedAmountOut

  if (isWrappedGasToken(marginToken, chainId)) {
    netQuotedAmountOut =
      quotedAmountOut && quotedRewards && quotedAmountOut - quotedRewards
  }

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

  const profitLossIndicator = !isUndefined(isPositionInProfit)
    ? isPositionInProfit
      ? "text-green-500"
      : "text-red-500"
    : "text-white"

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

  return (
    <>
      {isMobile ? (
        <tr onClick={handleNavigateToPosition}>
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
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 text-xs font-bold leading-4 uppercase tracking-thin">
                <DoubleCurrencyLogo token0={token0} token1={token1} size={6} />
                <div>
                  <div className="flex items-center">
                    <pre>{token0?.symbol}</pre>
                    <div className="px-0.5 my-auto">/</div>
                    <pre>{token1?.symbol}</pre>
                    <div className="px-1 my-auto">∙</div>
                    <div>{leverageCap}X MAX</div>
                  </div>
                  <div className="flex items-center text-marginalGray-600">
                    <pre>{token0?.name}</pre>
                    <div className="px-0.5 my-auto">∙</div>
                    <pre>{token1?.name}</pre>
                  </div>
                </div>
              </div>
              <CaretRightIcon />
            </div>

            <div className="flex">
              <MobileTableCell label="Token">{tokenId}</MobileTableCell>

              <MobileTableCell label="Collateral">
                {marginFormatted} {marginToken?.symbol}
              </MobileTableCell>
            </div>

            <div className="flex">
              <MobileTableCell label="Size">
                {totalSizeFormatted} {marginToken?.symbol}
              </MobileTableCell>
              <MobileTableCell label="Health Factor">
                <div className={`flex items-baseline space-x-1 ${healthFactorIndicator}`}>
                  <pre>{healthFactor?.toFixed(2)}</pre>
                </div>
              </MobileTableCell>
            </div>

            <MobileTableCell label="Profit/Loss (ROI)">
              <div className={`flex justify-start space-x-2 ${profitLossIndicator}`}>
                <pre>
                  {profitLossFormatted} {marginToken?.symbol}
                </pre>
                <div className={profitLossIndicator}>
                  ({profitLossPercentage?.toFixed(2)}%)
                </div>
              </div>
            </MobileTableCell>
          </div>
          {/* {!isLast && <div className="h-[1px] bg-marginalGray-800" />} */}
        </tr>
      ) : (
        <tr
          onClick={handleNavigateToPosition}
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
          <TableCell>{tokenId}</TableCell>

          <TableCell>
            <div className="flex items-center space-x-2 text-xs">
              <DoubleCurrencyLogo token0={token0} token1={token1} />

              <div>
                <div className="flex items-center">
                  <pre>{token0?.symbol}</pre>
                  <div className="px-0.5 my-auto">/</div>
                  <pre>{token1?.symbol}</pre>
                  <div className="px-1 my-auto">∙</div>
                  <div>{leverageCap}X MAX</div>
                </div>
                <div className="hidden xl:flex xl:items-center text-marginalGray-600">
                  <pre>{token0?.name}</pre>
                  <div className="px-0.5 my-auto">∙</div>
                  <pre>{token1?.name}</pre>
                </div>
              </div>
            </div>
          </TableCell>

          <TableCell>
            {totalSizeFormatted} {marginToken?.symbol}
          </TableCell>

          <TableCell>
            {marginFormatted} {marginToken?.symbol}
          </TableCell>

          <TableCell>
            <div className={healthFactorIndicator}>
              <pre>{healthFactor?.toFixed(2)}</pre>
            </div>
          </TableCell>

          <TableCell>
            <div className={profitLossIndicator}>
              <pre>
                {profitLossFormatted} {marginToken?.symbol}
              </pre>
              <div className={profitLossIndicator}>
                ({profitLossPercentage?.toFixed(2)}%)
              </div>
            </div>
          </TableCell>
        </tr>
      )}
    </>
  )
}

const ClosedPositionRow = ({
  chainId,
  positionData,
  isMobile,
  isOnlyPosition,
  isFirst,
  isLast,
}: {
  chainId: number
  positionData: any
  isMobile: boolean
  isOnlyPosition: boolean
  isFirst: boolean
  isLast: boolean
}) => {
  const tokenId = positionData?.tokenId
  const pool = positionData?.pool
  const isLiquidated = positionData?.isLiquidated
  const zeroForOne: boolean | undefined = positionData?.zeroForOne

  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(pool?.token0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(pool?.token1, defaultTokensList)
  const leverageCap = getPoolMaxLeverage(pool?.maintenance)

  const [marginToken, debtToken] = zeroForOne ? [token1, token0] : [token0, token1]

  const marginAmountOut = positionData?.marginAmountOut
  const marginAmountOutParsed =
    marginAmountOut && formatBigIntToString(marginAmountOut, marginToken?.decimals)
  const marginAmountOutFormatted = formatNumberAmount(marginAmountOutParsed, true)

  let netAmountOut: bigint | undefined = marginAmountOut
  const rewards: bigint | undefined = positionData?.rewards

  if (isWrappedGasToken(marginToken, chainId)) {
    netAmountOut = marginAmountOut && rewards && marginAmountOut - rewards
  }

  const endingMargin = positionData?.margin
  const endingMarginParsed =
    endingMargin && formatBigIntToString(endingMargin, marginToken?.decimals)
  const endingMarginFormatted = formatNumberAmount(endingMarginParsed, true)

  const profitLossRaw = calculatePositionRawPnL(netAmountOut, endingMargin)
  const profitLossParsed =
    profitLossRaw && formatBigIntToString(BigInt(profitLossRaw), marginToken?.decimals)
  const profitLossFormatted = formatNumberAmount(profitLossParsed, true)

  const profitLossPercentage = calculatePnLByPercentage(profitLossRaw, endingMargin)
  const profitLossPercentageFormatted = formatNumberAmount(
    profitLossPercentage?.toString(),
    false,
  )

  const isPositionInProfit = profitLossPercentage ? profitLossPercentage > 0 : undefined

  const profitLossIndicator = !isUndefined(isPositionInProfit)
    ? isPositionInProfit
      ? "text-success-500"
      : "text-error-500"
    : "text-marginalGray-200"

  // Different position manager contract used if value is null
  if (!marginAmountOut) {
    return null
  }

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
            <div className="flex items-center justify-between">
              <div className="flex space-x-2 text-xs font-bold leading-4 uppercase tracking-thin">
                <DoubleCurrencyLogo token0={token0} token1={token1} size={6} />
                <div>
                  <div className="flex items-center">
                    <pre>{token0?.symbol}</pre>
                    <div className="px-0.5 my-auto">/</div>
                    <pre>{token1?.symbol}</pre>
                    <div className="px-1 my-auto">∙</div>
                    <div>{leverageCap}X MAX</div>
                  </div>
                  <div className="flex items-center text-marginalGray-600">
                    <pre>{token0?.name}</pre>
                    <div className="px-0.5 my-auto">∙</div>
                    <pre>{token1?.name}</pre>
                  </div>
                </div>
              </div>
              <CaretRightIcon />
            </div>

            <div className="flex">
              <MobileTableCell label="Token">{tokenId}</MobileTableCell>
              <MobileTableCell label="Status">
                {isLiquidated ? "Liquidated" : "Closed"}
              </MobileTableCell>
            </div>

            <MobileTableCell label="Closing Payout">
              {marginAmountOutFormatted} {marginToken?.symbol}
            </MobileTableCell>

            <MobileTableCell label="Profit/Loss (ROI)">
              <div className={`flex justify-start space-x-2 ${profitLossIndicator}`}>
                <pre>
                  {profitLossFormatted} {marginToken?.symbol}
                </pre>
                <div className={profitLossIndicator}>
                  ({profitLossPercentage?.toFixed(2)}%)
                </div>
              </div>
            </MobileTableCell>
          </div>
          {/* {!isLast && <div className="h-[1px] bg-marginalGray-800" />} */}
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
          <TableCell>{tokenId}</TableCell>

          <TableCell>
            <div className="flex items-center space-x-2 text-xs">
              <DoubleCurrencyLogo token0={token0} token1={token1} />

              <div>
                <div className="flex items-center">
                  <pre>{token0?.symbol}</pre>
                  <div className="px-0.5 my-auto">/</div>
                  <pre>{token1?.symbol}</pre>
                  <div className="px-1 my-auto">∙</div>
                  <div>{leverageCap}X MAX</div>
                </div>
                <div className="hidden xl:flex xl:items-center text-marginalGray-600">
                  <pre>{token0?.name}</pre>
                  <div className="px-0.5 my-auto">∙</div>
                  <pre>{token1?.name}</pre>
                </div>
              </div>
            </div>
          </TableCell>

          <TableCell>{isLiquidated ? "Liquidated" : "Closed"}</TableCell>

          <TableCell>
            {marginAmountOutFormatted} {marginToken?.symbol}
          </TableCell>

          <TableCell>
            <div className={profitLossIndicator}>
              <pre>
                {profitLossFormatted} {marginToken?.symbol}
              </pre>
              <div className={profitLossIndicator}>
                ({profitLossPercentage?.toFixed(2)}%)
              </div>
            </div>
          </TableCell>
        </tr>
      )}
    </>
  )
}

export const PositionRowLoading = ({
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
        <tr className="block px-3 mb-3 tracking-wide border cursor-pointer animate-pulse rounded-2xl border-borderGray">
          <td className="flex items-center justify-between py-2">
            <div className="flex space-x-2">
              <div className="w-5 h-5 rounded-full bg-marginalGray-200"></div>
              <div className="w-8 h-5 rounded bg-marginalGray-200"></div>
            </div>
            <div className="h-5 rounded w-14 bg-marginalGray-200"></div>
          </td>
          <td className="flex items-center justify-between py-2">
            <div className="w-8 h-5 rounded bg-marginalGray-200"></div>
            <div className="flex space-x-2">
              <div className="w-20 h-5 rounded bg-marginalGray-200"></div>
              <div className="w-5 h-5 rounded-full bg-marginalGray-200"></div>
            </div>
          </td>
          <td className="flex items-center justify-between py-2">
            <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
            <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
          </td>
          <td className="flex items-center justify-between py-2">
            <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
            <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
          </td>
          <td className="flex items-center justify-between py-2">
            <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
            <div className="w-16 h-5 rounded bg-marginalGray-200"></div>
          </td>
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
            <div className="flex items-center space-x-2">
              <div className="rounded-full w-7 h-7 bg-marginalGray-200"></div>
              <div className="w-10 h-4 rounded bg-marginalGray-200"></div>
            </div>
          </TableCell>
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
            <div className="w-20 h-4 ml-auto rounded bg-marginalGray-200"></div>
          </TableCell>
          <TableCell>
            <div className="w-20 h-4 ml-auto rounded bg-marginalGray-200"></div>
          </TableCell>
          <TableCell>
            <div className="w-20 h-4 ml-auto rounded bg-marginalGray-200"></div>
          </TableCell>
        </tr>
      )}
    </>
  )
}

export default Positions

export const filterPositionsByStatus = (positions: any) => {
  if (!positions || !isArray(positions))
    return { closedPositions: null, openPositions: null }
  const closedPositions = positions.filter((position: any) => position.isClosed === true)
  const openPositions = positions.filter((position: any) => position.isClosed === false)
  return { closedPositions, openPositions }
}

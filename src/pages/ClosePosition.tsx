import { useState } from "react"
import { useParams } from "react-router-dom"
import { isNull, isUndefined } from "lodash"
import { useAccount, Address, useNetwork } from "wagmi"
import { usePositionsQuery } from "../hooks/usePositionsQuery"
import { filterPositionsByKey } from "../functions/filterPositionsByIndexedId"
import { usePositionQuery } from "../hooks/usePositionQuery"
import { trimTrailingZeroes } from "../utils/trimTrailingZeroes"
import {
  IgniteParams,
  constructIgniteParams,
} from "../functions/constructQuoteIgniteParams"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { useViewQuoteIgnite } from "../hooks/useViewQuoteIgnite"
import {
  calculatePositionRawPnL,
  calculatePnLByPercentage,
} from "../functions/calculatePnL"
import { V1_QUOTER_ADDRESS } from "../constants/addresses"
import { useIgniteCallback } from "../hooks/useIgniteCallback"
import { getTransactionError } from "../utils/getTransactionError"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { PositionContainer } from "../components/Position/PositionContainer"
import { ListRow } from "../components/List/ListRow"
import { ClosePositionButton } from "../components/Position/ClosePositionButton"
import { useSettingsToggle } from "../hooks/useSettingsToggle"
import { useSettingsState } from "../state/settings/hooks"
import { TokenAsset } from "../components/Token/TokenAsset"
import { waitForTransaction } from "@wagmi/core"
import { usePoolOracle } from "../hooks/usePoolOracle"
import { useUniswapPoolPrices } from "../hooks/useUniswapPoolPrices"
import { useUniswapPoolFee } from "../hooks/useUniswapPoolFee"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { usePositionData } from "../hooks/usePositionData"
import { isTransactionReceiptError } from "../utils/isTransactionReceiptError"
import { ConfirmTransactionModal } from "../components/Modals/ConfirmTransactionModal"
import { DEFAULT_CHAIN_ID } from "../constants/chains"
import { SlippageButton } from "src/components/Settings/SlippageButton"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { convertX96PricesToBigInt } from "src/functions/convertX96Prices"
import { formatStringToBigInt } from "src/utils/formatStringToBigInt"
import { useApplicationState } from "src/state/application/hooks"
import { PositionWrapper } from "src/components/Position/PositionWrapper"
import { CaretLeftIcon } from "src/components/Icons/CaretLeftIcon"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"

const ClosePosition = () => {
  const { chainId } = useApplicationState()
  const { indexedId } = useParams()
  const { address } = useAccount()
  const { positions: indexedPositions } = usePositionsQuery(address)
  const matchedPosition = filterPositionsByKey(indexedId, indexedPositions)
  const { positionQueryData } = usePositionQuery(indexedId)

  const { maxSlippage, transactionDeadline } = useSettingsState()
  const { showSettings, onOpenSettings, onCloseSettings } = useSettingsToggle()
  const { onNavigateToPositions, onNavigateToPosition } = useNavigateRoutes()

  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)

  const tokenId = matchedPosition?.tokenId
  const {
    position,
    isLoading: isLoadingData,
    fetchPositionData: getPositionData,
  } = usePositionData(tokenId, positionQueryData, chainId)

  const oracle = usePoolOracle(position?.pool?.address)
  const poolToken0 = position?.pool?.token0
  const poolToken1 = position?.pool?.token1
  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(poolToken0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(poolToken1, defaultTokensList)

  const { sqrtPriceX96: uniswapPoolSqrtPriceX96 } = useUniswapPoolPrices(
    oracle as Address,
  )

  const uniswapV3PoolPrice = convertX96PricesToBigInt(uniswapPoolSqrtPriceX96)

  const uniV3Fee = useUniswapPoolFee(oracle as Address)

  const zeroForOne: boolean | undefined = position?.zeroForOne
  const [marginToken, debtToken] = zeroForOne ? [token1, token0] : [token0, token1]

  // Reward in ETH
  const rewards = position?.rewards
    ? trimTrailingZeroes(formatBigIntToString(position?.rewards, 18))
    : undefined

  const igniteParams = constructIgniteParams(
    position?.pool?.token0,
    position?.pool?.token1,
    position?.pool?.maintenance,
    position?.pool?.oracle,
    position?.tokenId,
    "0",
    address,
    currentBlockTimestamp,
    transactionDeadline,
  )

  const [igniteQuote, igniteError] = useViewQuoteIgnite(
    V1_QUOTER_ADDRESS[chainId],
    igniteParams,
    marginToken,
    chainId,
  )
  const marginRaw = position?.margin
  const quotedAmountOut: bigint | undefined = igniteQuote?.amountOut
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

  const derivedIgniteParams = deriveIgniteParamsWithSlippage(
    igniteParams,
    maxSlippage,
    position?.margin,
    position?.debt,
    position?.size,
    zeroForOne,
    uniswapV3PoolPrice,
    uniV3Fee as string,
    igniteQuote?.amountOut,
  )

  const { igniteCallback } = useIgniteCallback(derivedIgniteParams, chainId)

  const minReceivedCollateral = formatBigIntToString(
    derivedIgniteParams?.amountOutMinimum,
    marginToken?.decimals,
  )

  const impact = calculateIgniteSlippage(
    position?.margin,
    position?.debt,
    position?.size,
    zeroForOne,
    uniswapV3PoolPrice,
    uniV3Fee as string,
    igniteQuote?.amountOut,
  )

  const priceImpact = formatNumberAmount(impact, true)

  const [
    {
      showConfirm,
      isPendingWallet,
      isPendingApprove,
      isPendingTx,
      isTxSubmitted,
      txHash,
      txError,
    },
    setTransactionState,
  ] = useState<{
    showConfirm: boolean
    isPendingWallet: boolean
    isPendingApprove: boolean
    isPendingTx: boolean
    isTxSubmitted: boolean
    txHash: string | null
    txError: any
  }>({
    showConfirm: false,
    isPendingWallet: false,
    isPendingApprove: false,
    isPendingTx: false,
    isTxSubmitted: false,
    txHash: null,
    txError: null,
  })

  const handleOpenConfirmModal = () => {
    setTransactionState((prevState) => ({
      ...prevState,
      showConfirm: true,
    }))
  }

  const handleCloseConfirmModal = () => {
    setTransactionState((prevState) => ({
      ...prevState,
      showConfirm: false,
    }))
  }

  const handleResetTransactionState = () => {
    setTransactionState({
      showConfirm: false,
      isPendingWallet: false,
      isPendingApprove: false,
      isPendingTx: false,
      isTxSubmitted: false,
      txHash: null,
      txError: null,
    })
  }

  const onSuccessTx = () => {
    handleResetTransactionState()
    onNavigateToPositions()
  }

  const handleIgniteCallback = async () => {
    try {
      if (!position?.tokenId) {
        return new Error("Missing Token Id")
      }
      if (!igniteCallback) {
        return new Error("Missing ignite callback")
      }

      setTransactionState({
        showConfirm: true,
        isPendingWallet: true,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: false,
        txHash: null,
        txError: null,
      })

      const transaction = await igniteCallback()

      setTransactionState({
        showConfirm: true,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: true,
        isTxSubmitted: false,
        txHash: transaction.hash,
        txError: null,
      })

      const receipt = await waitForTransaction({
        hash: transaction.hash,
        timeout: 100_000,
      })

      console.log("receipt: ", receipt)

      await getPositionData()

      setTransactionState({
        showConfirm: true,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: true,
        txHash: transaction.hash,
        txError: null,
      })

      return transaction.hash
    } catch (error) {
      if (isTransactionReceiptError(error)) {
        await getPositionData()
      }

      const isRejectedByUser =
        getTransactionError(error) === "Wallet rejected transaction."
      if (txHash) {
        setTransactionState({
          showConfirm: false,
          isPendingWallet: false,
          isPendingApprove: false,
          isPendingTx: false,
          isTxSubmitted: true,
          txHash: txHash,
          txError: null,
        })
      } else if (isRejectedByUser) {
        setTransactionState((prevState) => ({
          ...prevState,
          showConfirm: false,
          isPendingWallet: false,
          isPendingApprove: false,
          isPendingTx: false,
        }))
      } else {
        setTransactionState((prevState) => ({
          ...prevState,
          txError: getTransactionError(error, "close"),
        }))
      }
    }
  }

  const isPriceImpactSevere = priceImpact
    ? Math.floor(Number(priceImpact) * 100) >= 500
    : undefined

  const isPriceImpactModerate = priceImpact
    ? Math.floor(Number(priceImpact) * 100) >= 100 && !isPriceImpactSevere
    : undefined

  const priceImpactIndicator =
    priceImpact && (isPriceImpactModerate || isPriceImpactSevere)
      ? isPriceImpactSevere
        ? "text-error-500"
        : "text-warning-500"
      : "text-marginalGray-200"

  let isSlippageMoreThanToleranceError = undefined

  if (priceImpact && maxSlippage) {
    isSlippageMoreThanToleranceError =
      parseFloat(priceImpact.toString()) > parseFloat(maxSlippage)
        ? "Slippage exceeds tolerance"
        : undefined
  }

  const isPositionClosed: boolean =
    Boolean(position && position?.isClosed) || Boolean(!isPendingTx && txHash)

  if (!position) {
    return (
      <PositionContainer>
        <div className="text-lg text-center text-marginalGray-200">
          Loading position...
        </div>
      </PositionContainer>
    )
  }

  return (
    <PositionWrapper>
      <div className="flex items-center justify-between my-6">
        <div
          onClick={indexedId ? () => onNavigateToPosition(indexedId) : () => null}
          className="flex items-center justify-start space-x-1 cursor-pointer text-marginalGray-200"
        >
          <CaretLeftIcon />
          <span className="text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
            Back to Token
          </span>
        </div>
        <SlippageButton
          maxSlippage={maxSlippage}
          showSettings={showSettings}
          onClose={onCloseSettings}
          onOpen={onOpenSettings}
        />
      </div>
      {isPositionClosed ? (
        <div className="p-3 border rounded-lg text-marginalGray-200 border-borderGray bg-marginalBlack">
          Position is closed.
        </div>
      ) : (
        <div className="relative mx-auto w-full max-w-[343px] sm:max-w-[440px] mt-12 bg-marginalGray-900 border border-marginalGray-800 rounded-3xl shadow-outerBlack">
          <div className="flex items-center p-4 text-lg font-bold leading-5 uppercase border-b md:text-xl md:leading-6 tracking-thin text-marginalGray-200 border-b-marginalGray-800">
            Close Position
          </div>
          <div className="p-2 space-y-2 sm:p-4 sm:space-y-4">
            <div className="p-4 space-y-2 text-xs font-bold leading-4 uppercase tracking-thin text-marginalGray-600 bg-marginalBlack rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex flex-col space-y-1">
                  Token ID
                  {position && (
                    <div className="text-sm text-marginalGray-200">
                      <div>{position?.tokenId}</div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col">
                  Profit/Loss (Without Impact)
                  {profitLossFormatted && (
                    <div
                      className={`flex flex-wrap justify-end space-x-1 ${profitLossPercentage ? (isPositionInProfit ? "text-success-500" : "text-error-500") : ""}`}
                    >
                      <div className="flex text-sm">
                        <pre>
                          {profitLossFormatted} {marginToken?.symbol}
                        </pre>
                      </div>
                      <pre className="text-sm">({profitLossPercentageFormatted}%)</pre>
                    </div>
                  )}
                </div>
              </div>

              <div className="my-4 h-[1px] bg-marginalGray-100/20" />
              <div className="space-y-2 text-marginalGray-600">
                <ListRow
                  item="Impact"
                  value={
                    <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-600">
                      <div className={`${priceImpactIndicator}`}>{priceImpact}%</div>
                    </div>
                  }
                />
                <ListRow
                  item="Max slippage"
                  value={
                    <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                      <div>{maxSlippage}%</div>
                    </div>
                  }
                />
                <ListRow
                  item="Escrow rewards"
                  value={
                    <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                      <div>{`${rewards ?? "-"} ETH`}</div>
                    </div>
                  }
                />
                <ListRow
                  item="Minimum received"
                  value={
                    minReceivedCollateral && (
                      <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                        <div>
                          {trimTrailingZeroes(
                            parseFloat(minReceivedCollateral)?.toPrecision(6),
                          )}
                        </div>
                        <TokenAsset token={marginToken} className="!w-4 !h-4" />
                      </div>
                    )
                  }
                />
              </div>
            </div>
            <ClosePositionButton
              igniteCallback={handleIgniteCallback}
              isPendingWallet={isPendingWallet}
              isPendingTx={isPendingTx}
              error={isSlippageMoreThanToleranceError}
            />
          </div>
        </div>
      )}
      <ConfirmTransactionModal
        chainId={chainId ?? DEFAULT_CHAIN_ID}
        open={showConfirm}
        onOpen={handleOpenConfirmModal}
        onClose={handleCloseConfirmModal}
        onReset={onSuccessTx}
        onCallback={handleIgniteCallback}
        isPendingWallet={isPendingWallet}
        isPendingApprove={isPendingApprove}
        isPendingTx={isPendingTx}
        isTxSubmitted={isTxSubmitted}
        txHash={txHash}
        txError={txError}
        hasConfirmModal={false}
        onSuccessText="Position Closed"
      />
    </PositionWrapper>
  )
}

export default ClosePosition

const calculateAmountOutRawOnIgnite = (
  margin?: string,
  debt?: string,
  size?: string,
  zeroForOne?: boolean,
  uniswapV3PoolPrice?: string | null,
  uniswapV3Fee?: string,
  quotedAmountOut?: string,
): bigint | undefined => {
  if (
    isUndefined(margin) ||
    isUndefined(size) ||
    isUndefined(debt) ||
    isUndefined(quotedAmountOut) ||
    isUndefined(zeroForOne) ||
    isUndefined(uniswapV3PoolPrice) ||
    isNull(uniswapV3PoolPrice) ||
    isUndefined(uniswapV3Fee)
  ) {
    return undefined
  }

  const oneWei = formatStringToBigInt("1", 18)
  const oneMwei = formatStringToBigInt("1", 6)

  if (isUndefined(oneWei) || isUndefined(oneMwei)) {
    return undefined
  }

  const margin_BI: bigint = BigInt(margin)
  const debt_BI: bigint = BigInt(debt)
  const size_BI: bigint = BigInt(size)
  const uniswapV3PoolPrice_BI: bigint = BigInt(uniswapV3PoolPrice)
  const uniswapV3Fee_BI: bigint = BigInt(uniswapV3Fee)
  const totalSize_BI: bigint = margin_BI + size_BI

  let debtInMarginToken_BI

  if (zeroForOne) {
    debtInMarginToken_BI = (debt_BI * uniswapV3PoolPrice_BI) / oneWei
  } else {
    debtInMarginToken_BI = (debt_BI * oneWei) / uniswapV3PoolPrice_BI
  }

  const uniV3FeeInMwei: bigint = uniswapV3Fee_BI + oneMwei
  const debtInMarginTokenWithUniV3Fee: bigint =
    (debtInMarginToken_BI * uniV3FeeInMwei) / oneMwei

  const amountOutRaw: bigint = totalSize_BI - debtInMarginTokenWithUniV3Fee

  return amountOutRaw
}

const calculateIgniteSlippage = (
  margin?: string,
  debt?: string,
  size?: string,
  zeroForOne?: boolean,
  uniswapV3PoolPrice?: string | null,
  uniswapV3Fee?: string,
  quotedAmountOut?: string,
) => {
  const amountOutRaw = calculateAmountOutRawOnIgnite(
    margin,
    debt,
    size,
    zeroForOne,
    uniswapV3PoolPrice,
    uniswapV3Fee,
    quotedAmountOut,
  )

  const oneWei = formatStringToBigInt("1", 18)

  if (isUndefined(quotedAmountOut) || isUndefined(amountOutRaw) || isUndefined(oneWei)) {
    return undefined
  }

  const quotedAmountOut_BI: bigint = BigInt(quotedAmountOut)
  const amountOutDiff: bigint = quotedAmountOut_BI - amountOutRaw
  const impact_BI: bigint = (amountOutDiff * oneWei) / amountOutRaw

  const impact = formatBigIntToString(impact_BI, 18)

  return impact
}

const deriveIgniteParamsWithSlippage = (
  igniteParams: IgniteParams | null,
  maxSlippage: string,
  margin?: string,
  debt?: string,
  size?: string,
  zeroForOne?: boolean,
  uniswapV3PoolPrice?: string | null,
  uniswapV3Fee?: string,
  quotedAmountOut?: string,
) => {
  const amountOutRaw = calculateAmountOutRawOnIgnite(
    margin,
    debt,
    size,
    zeroForOne,
    uniswapV3PoolPrice,
    uniswapV3Fee,
    quotedAmountOut,
  )

  if (!igniteParams || !uniswapV3PoolPrice || !amountOutRaw) {
    return null
  }

  const oneWei = formatStringToBigInt("1", 18)

  if (isUndefined(oneWei)) {
    return null
  }

  const effectiveSlippage: string = (100 - parseFloat(maxSlippage)).toString()
  const slippageNumerator = formatStringToBigInt(effectiveSlippage, 18)
  const slippageDenominator = formatStringToBigInt("100", 18)

  const bumpedEffectiveSlippage: bigint | undefined =
    oneWei &&
    slippageNumerator &&
    slippageDenominator &&
    (slippageNumerator * oneWei) / slippageDenominator

  const minReceivedCollateral =
    bumpedEffectiveSlippage && (bumpedEffectiveSlippage * amountOutRaw) / oneWei

  return {
    ...igniteParams,
    amountOutMinimum: minReceivedCollateral ?? 0n,
  }
}

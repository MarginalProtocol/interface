import { isNull } from "lodash"
import { useAccount } from "wagmi"
import { Address } from "viem"
import { useState } from "react"
import { constructFreeParams } from "src/hooks/useFreeCallback"
import { useFreeCallback } from "src/hooks/useFreeCallback"
import { waitForTransaction } from "@wagmi/core"
import { TransactionReceipt } from "viem"
import { isTransactionReceiptError } from "src/utils/isTransactionReceiptError"
import { getTransactionError } from "src/utils/getTransactionError"
import { PercentageSlider } from "./PercentageSlider"
import { RemoveMarginButton } from "./RemoveMarginButton"
import { InputContainer } from "../Containers/InputContainer"
import { RemoveMarginInput } from "./RemoveMarginInput"
import { TokenSelected } from "./TokenSelected"
import { formatBigIntToString } from "src/utils/formatBigIntToString"
import { trimTrailingZeroes } from "src/utils/trimTrailingZeroes"
import { useLiquidationPrice } from "src/hooks/useLiquidationPrice"
import { calculatePositionLeverage } from "src/functions/calculatePositionLeverage"
import { TokenAsset } from "../Token/TokenAsset"
import { ListRow } from "../List/ListRow"
import { convertX96Prices } from "src/functions/convertX96Prices"
import { useOraclePoolPrices } from "src/hooks/useOraclePoolPrices"
import JSBI from "jsbi"
import { useDefaultActiveTokens } from "src/hooks/Tokens"
import { useDefaultTokenWhenPossible } from "src/hooks/useDefaultTokenWhenPossible"
import { formatNumberAmount } from "src/utils/formatNumberAmount"
import { AssetPairPriceRatio } from "../Trade/TradeDetailList"
import { ConfirmTransactionModal } from "../Modals/ConfirmTransactionModal"
import { DEFAULT_CHAIN_ID } from "src/constants/chains"
import { useNavigateRoutes } from "src/hooks/useNavigateRoutes"
import { calculateHealthFactor } from "src/functions/calculateHealthFactor"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { useSettingsState } from "src/state/settings/hooks"
import { useApplicationState } from "src/state/application/hooks"
import { useInversePrice } from "src/hooks/useInversePrice"
import { calculateInversablePrices } from "src/functions/calculateInversablePrices"
import { CaretUpIcon } from "../Icons/CaretUpIcon"
import { HealthFactorIcon } from "../Icons/HealthFactorIcon"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"

const calculateMarginOutWithPercentage = (
  rawPositionMargin?: string,
  percentage?: number,
) => {
  if (!rawPositionMargin || !percentage) return undefined

  const percentageMultipliedBy100 = percentage * 100
  const positionMargin = JSBI.BigInt(rawPositionMargin.toString())
  const numerator = JSBI.multiply(
    JSBI.BigInt(percentageMultipliedBy100.toString()),
    positionMargin,
  )
  const denominator = JSBI.BigInt("10000")
  const quotient = JSBI.divide(numerator, denominator)
  return quotient.toString()
}

const calculateMaxRemovableBeforeUnsafeMargin = (
  rawMargin?: any,
  rawSafeMarginMinimum?: any,
) => {
  if (!rawMargin || !rawSafeMarginMinimum) return null
  const currentMargin = JSBI.BigInt(rawMargin.toString())
  const safeMarginMinimum = JSBI.BigInt(rawSafeMarginMinimum.toString())
  const maxRemovable = JSBI.subtract(currentMargin, safeMarginMinimum)
  return maxRemovable.toString()
}

const RemoveMargin = ({
  position,
  fetchPositionState,
}: {
  position: any
  fetchPositionState: (tokenId: string) => Promise<void>
}) => {
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)
  const { transactionDeadline } = useSettingsState()
  const [useInverse, onToggleInverse] = useInversePrice()

  // TODO: Lift up to Store
  const [inputValue, setInputValue] = useState("")
  const [freePercentage, setFreePercentage] = useState<number>(0)

  const { onNavigateToPosition } = useNavigateRoutes()
  const handleReturnToPosition = (positionKey: string) =>
    onNavigateToPosition(positionKey)

  const pool = position?.pool
  const tokenId = position?.tokenId
  const zeroForOne: boolean | undefined = position?.zeroForOne
  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(pool?.token0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(pool?.token1, defaultTokensList)
  const [marginToken, debtToken] = zeroForOne ? [token1, token0] : [token0, token1]
  const [percentError, setPercentError] = useState(false)

  const [showDetailList, setShowDetailList] = useState(false)

  const formattedBalance = formatBigIntToString(position?.margin, marginToken?.decimals)

  const inputtedMarginOut = calculateMarginOutWithPercentage(
    position?.margin,
    freePercentage,
  )

  const safeMarginMinRaw = position?.safeMarginMinimum
  const safeMarginMinParsed =
    safeMarginMinRaw && formatBigIntToString(safeMarginMinRaw, marginToken?.decimals)
  const safeMarginMinFormatted = formatNumberAmount(safeMarginMinParsed, true)

  const marginRaw = position?.margin
  const marginParsed = marginRaw && formatBigIntToString(marginRaw, marginToken?.decimals)
  const marginFormatted = formatNumberAmount(marginParsed)

  let isUnsafeMargin = false

  const maxRemovableMarginBeforeUnsafe = calculateMaxRemovableBeforeUnsafeMargin(
    position?.margin,
    position?.safeMarginMinimum,
  )

  if (inputtedMarginOut && maxRemovableMarginBeforeUnsafe) {
    isUnsafeMargin = JSBI.greaterThan(
      JSBI.BigInt(inputtedMarginOut),
      JSBI.BigInt(maxRemovableMarginBeforeUnsafe),
    )
  }

  const freeParams = constructFreeParams(
    pool?.token0,
    pool?.token1,
    pool?.maintenance,
    pool?.oracle,
    tokenId,
    inputtedMarginOut,
    address,
    currentBlockTimestamp,
    transactionDeadline,
  )

  const { freeCallback } = useFreeCallback(freeParams, chainId)

  const updatedPositionMargin =
    position?.margin && freeParams?.marginOut
      ? JSBI.subtract(
          JSBI.BigInt(position.margin.toString()),
          JSBI.BigInt(freeParams?.marginOut.toString()),
        ).toString()
      : undefined

  const newLiquidationPriceX96 = useLiquidationPrice(
    chainId,
    zeroForOne,
    position?.size,
    position?.debt,
    updatedPositionMargin ? BigInt(updatedPositionMargin) : undefined,
    pool?.maintenance,
  )

  const newLiquidationPrice = convertX96Prices(
    newLiquidationPriceX96 as string,
    pool?.token0,
    pool?.token1,
  )

  const newLeverage =
    updatedPositionMargin &&
    calculatePositionLeverage(BigInt(updatedPositionMargin), position?.size)
  const newLeverageFormatted = formatNumberAmount(newLeverage, true)

  const currentLeverage = calculatePositionLeverage(position?.margin, position?.size)
  const currentLeverageFormatted = formatNumberAmount(currentLeverage, true)

  const liquidationPriceX96 = useLiquidationPrice(
    chainId,
    zeroForOne,
    position?.size,
    position?.debt,
    position?.margin,
    pool?.maintenance,
  )

  const { sqrtPriceX96, oracleSqrtPriceX96 } = useOraclePoolPrices(
    chainId,
    pool?.token0?.address as Address,
    pool?.token1?.address as Address,
    pool?.maintenance,
    pool?.oracle as Address,
  )

  const { oraclePrice, poolPrice, liquidationPrice } = calculateInversablePrices(
    useInverse,
    oracleSqrtPriceX96,
    sqrtPriceX96,
    liquidationPriceX96,
    pool?.token0,
    pool?.token1,
  )

  const oraclePriceParsed = convertX96Prices(
    oracleSqrtPriceX96,
    pool?.token0,
    pool?.token1,
  )
  const liquidationPriceParsed = convertX96Prices(
    liquidationPriceX96 as string,
    pool?.token0,
    pool?.token1,
  )

  const healthFactor = calculateHealthFactor(
    updatedPositionMargin ?? position?.margin,
    position?.safeMarginMinimum,
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
    setFreePercentage(0)
    handleReturnToPosition(position?.id)
  }

  const handleFreeCallback = async () => {
    try {
      if (!position.tokenId) {
        throw new Error("Missing Token Id")
      }
      if (!freePercentage) {
        throw new Error("Amount must be greater than 0")
      }
      if (!freeCallback) {
        throw new Error("Missing free callback")
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

      const transaction = await freeCallback()

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

      await fetchPositionState(position?.id)

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
      console.error(error)
      if (isTransactionReceiptError(error)) {
        await fetchPositionState(position?.id)
      }

      const isRejectedByUser =
        getTransactionError(error) === "Wallet rejected transaction."
      if (txHash) {
        setTransactionState({
          showConfirm: true,
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
          txError: getTransactionError(error, "handleFreeCallback"),
        }))
      }
    }
  }

  const isInputValid: boolean = freePercentage > 0
  const isInputGreaterThanBalance =
    formattedBalance && parseFloat(inputValue) > parseFloat(formattedBalance)

  return (
    <div className="relative">
      <div className="p-2 space-y-2 border border-t-0 sm:space-y-4 sm:p-4 bg-marginalGray-900 border-marginalGray-800 rounded-b-3xl">
        <div className="space-y-2">
          <InputContainer id="remove-margin-input-container">
            <RemoveMarginInput
              title="Collateral"
              inputValue={inputValue}
              totalBalance={formattedBalance}
              setPercentage={setFreePercentage}
              onChange={setInputValue}
              setPercentError={setPercentError}
            />
            <div className="flex flex-col items-end justify-center gap-1.5">
              <TokenSelected selectedToken={marginToken} />

              <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                <div className="text-marginalGray-600 whitespace-nowrap">
                  Balance: {trimTrailingZeroes(formattedBalance)}
                </div>
                <div
                  className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                  onClick={() => {
                    setInputValue(formattedBalance ? formattedBalance : "")
                    setFreePercentage(100)
                  }}
                >
                  Max
                </div>
              </div>
            </div>
          </InputContainer>
          <PercentageSlider
            userInput={inputValue}
            isInputValid={isInputValid}
            formattedBalance={formattedBalance}
            margin={position?.margin}
            decimals={marginToken?.decimals}
            onUserInput={setInputValue}
            selectedPercentage={freePercentage}
            setPercentage={setFreePercentage}
            setPercentError={setPercentError}
            percentError={percentError}
          />
        </div>
        <RemoveMarginButton
          chainId={chainId}
          isInputValid={isInputValid}
          freeCallback={handleFreeCallback}
          isPendingWallet={isPendingWallet}
          isPendingTx={isPendingTx}
          error={
            isUnsafeMargin
              ? "Not enough margin."
              : isInputGreaterThanBalance
                ? "Input greater than balance."
                : null
          }
        />
      </div>

      <div className="absolute w-full px-0 mx-auto mt-4 sm:px-4">
        <div
          id="manage-position-detail-list"
          className="px-2 py-2 rounded-lg transform-gpu duration-175"
        >
          <div className="flex items-center justify-between">
            <AssetPairPriceRatio
              token0={token0}
              token1={token1}
              price={formatNumberAmount(poolPrice, true)}
              useInverse={useInverse}
              onToggleInverse={onToggleInverse}
            />

            <div
              onClick={() => setShowDetailList(!showDetailList)}
              className="flex items-center ml-auto space-x-1 cursor-pointer hover:opacity-60"
            >
              <CaretUpIcon
                width={16}
                height={16}
                className={
                  showDetailList
                    ? "transition-transform duration-200 ease-in-out"
                    : "transform rotate-180 transition-transform duration-200 ease-in-out"
                }
              />
            </div>
          </div>

          <div
            className={`
              text-sm leading-4 tracking-thin font-bold uppercase transition-max-height ease-in-out 
              text-marginalGray-600 transform-gpu duration-500 overflow-y-hidden
              ${showDetailList ? "max-h-[600px]" : "max-h-0"}
        `}
          >
            <div className="py-4 space-y-2">
              <div className="h-[1px] bg-marginalGray-200/20" />
              <ListRow
                item="Margin"
                value={
                  <div className={`flex items-center space-x-1 text-marginalGray-200`}>
                    <pre>
                      {marginFormatted} {marginToken?.symbol}
                    </pre>
                  </div>
                }
              />
              <ListRow
                item="Maintenance margin"
                value={
                  <div className={`flex items-center space-x-1 text-marginalGray-200`}>
                    <pre>
                      {safeMarginMinFormatted} {marginToken?.symbol}
                    </pre>
                  </div>
                }
              />

              <ListRow
                item="Health factor"
                value={
                  <div className={`flex items-center space-x-1 ${healthFactorIndicator}`}>
                    <HealthFactorIcon />
                    <pre>{healthFactor?.toFixed(2)}</pre>
                  </div>
                }
              />
              <ListRow
                item="Leverage"
                value={
                  newLeverage ? (
                    <div className="text-marginalGray-200">{newLeverageFormatted}x</div>
                  ) : currentLeverage ? (
                    <div className="text-marginalGray-200">
                      {currentLeverageFormatted}x
                    </div>
                  ) : (
                    "-"
                  )
                }
              />
              <ListRow
                item="Oracle price"
                value={
                  oraclePrice && (
                    <div className="flex flex-wrap items-center space-x-1 text-marginalGray-200">
                      <div>{formatNumberAmount(oraclePrice, true)}</div>
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
                  <div className="flex flex-wrap items-center space-x-1 text-marginalGray-200">
                    {newLiquidationPrice ? (
                      <div>{formatNumberAmount(newLiquidationPrice, true)}</div>
                    ) : liquidationPrice ? (
                      <div>{formatNumberAmount(liquidationPrice, true)}</div>
                    ) : (
                      <div>-</div>
                    )}
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
                }
              />
            </div>
          </div>
        </div>
      </div>
      <ConfirmTransactionModal
        chainId={chainId ?? DEFAULT_CHAIN_ID}
        open={showConfirm}
        onOpen={handleOpenConfirmModal}
        onClose={handleCloseConfirmModal}
        onReset={onSuccessTx}
        onCallback={handleFreeCallback}
        isPendingWallet={isPendingWallet}
        isPendingApprove={isPendingApprove}
        isPendingTx={isPendingTx}
        isTxSubmitted={isTxSubmitted}
        txHash={txHash}
        txError={txError}
        hasConfirmModal={false}
        onSuccessText="Withdraw Executed"
      />
    </div>
  )
}

export default RemoveMargin

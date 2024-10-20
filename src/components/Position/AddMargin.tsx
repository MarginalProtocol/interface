import _, { isNull } from "lodash"
import { useMemo, useEffect, useState } from "react"
import { maxUint256 } from "viem"
import { useAccount, Address } from "wagmi"
import { InputContainer } from "../Containers/InputContainer"
import { TradeInput } from "../Trade/TradeInput"
import {
  useAddMarginActionHandlers,
  useAddMarginState,
  useAddMarginStatus,
} from "../../state/addMargin/hooks"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "src/constants/addresses"
import { useErc20TokenBalances } from "src/hooks/useErc20TokenBalances"
import { isBlank } from "src/utils/isBlank"
import { formatStringToBigInt } from "src/utils/formatStringToBigInt"
import { TokenSelected } from "src/components/Token/TokenSelected"
import { AddMarginButton } from "./AddMarginButton"
import { useErc20ApproveCallback } from "src/hooks/useErc20ApproveCallback"
import { constructLockParams, useLockCallback } from "src/hooks/useLockCallback"
import { waitForTransaction } from "@wagmi/core"
import { isTransactionReceiptError } from "src/utils/isTransactionReceiptError"
import { approveErc20Token } from "src/functions/approveErc20Token"
import { TransactionReceipt } from "viem"
import { useErc20TokenAllowance } from "src/functions/getErc20TokenAllowance"
import { useLiquidationPrice } from "src/hooks/useLiquidationPrice"
import JSBI from "jsbi"
import { convertX96Prices } from "src/functions/convertX96Prices"
import { ListRow } from "../List/ListRow"
import { calculatePositionLeverage } from "src/functions/calculatePositionLeverage"
import { useOraclePoolPrices } from "src/hooks/useOraclePoolPrices"
import { useDefaultActiveTokens } from "src/hooks/Tokens"
import { useDefaultTokenWhenPossible } from "src/hooks/useDefaultTokenWhenPossible"
import { formatNumberAmount } from "src/utils/formatNumberAmount"
import { AssetPairPriceRatio } from "../Trade/TradeDetailList"
import { getTransactionError } from "src/utils/getTransactionError"
import { ConfirmTransactionModal } from "../Modals/ConfirmTransactionModal"
import { useNavigateRoutes } from "src/hooks/useNavigateRoutes"
import { calculateHealthFactor } from "src/functions/calculateHealthFactor"
import { formatBigIntToString } from "src/utils/formatBigIntToString"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { useSettingsState } from "src/state/settings/hooks"
import { useApplicationState } from "src/state/application/hooks"
import { CaretUpIcon } from "../Icons/CaretUpIcon"
import { HealthFactorIcon } from "../Icons/HealthFactorIcon"
import { AnimatePresence } from "framer-motion"
import { useInversePrice } from "src/hooks/useInversePrice"
import { calculateInversablePrices } from "src/functions/calculateInversablePrices"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"
import { useNativeTokenBalance } from "src/hooks/useNativeTokenBalance"
import { UseGasTokenDropdown } from "../UseGasTokenDropdown"
import { isGasToken } from "src/utils/isGasToken"

const AddMargin = ({
  position,
  fetchPositionState,
}: {
  position: any
  fetchPositionState: (tokenId: string) => Promise<void>
}) => {
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const { inputValue } = useAddMarginState()
  const { transactionDeadline } = useSettingsState()
  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)
  const [useInverse, onToggleInverse] = useInversePrice()

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

  const [useGasToken, setUseGasToken] = useState<boolean>(true)
  const isTokenWrappedGasToken = isWrappedGasToken(marginToken, chainId)

  const inputValueGas = useGasToken
    ? (isTokenWrappedGasToken && inputValue) || undefined
    : undefined

  const [showDetailList, setShowDetailList] = useState(false)

  const { isInputValid, isMarginTokenValid, isAddMarginInputsValid } =
    useAddMarginStatus()
  const { onUserInput, onSetTokenId } = useAddMarginActionHandlers()

  const { allowance, fetchAllowance } = useErc20TokenAllowance(
    marginToken?.address as Address,
    Number(marginToken?.decimals),
    address,
    V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    chainId,
  )

  const formattedInput = !isBlank(inputValue)
    ? formatStringToBigInt(inputValue, marginToken?.decimals)
    : 0n

  useEffect(() => {
    if (chainId && marginToken && address) {
      ;(async () => {
        await fetchAllowance()
      })()
    }
  }, [chainId, marginToken, address, fetchAllowance])

  const {
    balance: gasBalance,
    parsedBalance: parsedGasBalance,
    shortenedParsedBalance: shortenedParsedGasBalance,
  } = useNativeTokenBalance(address, chainId)

  const { balances: tokenBalance, refetch: fetchTokenBalances } = useErc20TokenBalances(
    [marginToken],
    address,
  )

  const {
    balance: marginTokenBalance,
    parsedBalance: parsedMarginTokenBalance,
    shortenedParsedBalance: shortenedParsedMarginTokenBalance,
  } = tokenBalance?.[0] || {}

  const isApproved = useMemo(() => {
    if (useGasToken && isTokenWrappedGasToken) return true
    if (_.isUndefined(allowance) || _.isUndefined(formattedInput)) return false
    // if (marginToken && isGasToken(marginToken)) return true
    return allowance >= formattedInput
  }, [allowance, formattedInput, marginToken, useGasToken, isTokenWrappedGasToken])

  const isBalanceSufficient = useMemo(() => {
    if (!parsedMarginTokenBalance || !parsedGasBalance) return true

    const parsedValue = parseFloat(inputValue || "0")

    if (useGasToken && isTokenWrappedGasToken) {
      if (isTokenWrappedGasToken) {
        return parsedValue <= parseFloat(parsedGasBalance)
      } else {
        return parsedValue <= parseFloat(parsedMarginTokenBalance)
      }
    } else {
      return parsedValue <= parseFloat(parsedMarginTokenBalance)
    }
  }, [
    inputValue,
    parsedMarginTokenBalance,
    parsedGasBalance,
    isTokenWrappedGasToken,
    useGasToken,
  ])

  const lockParams = constructLockParams(
    pool?.token0,
    pool?.token1,
    pool?.maintenance,
    pool?.oracle,
    tokenId,
    inputValue,
    marginToken,
    currentBlockTimestamp,
    transactionDeadline,
  )

  const { lockCallback, refetch: refetchLockCallback } = useLockCallback(
    lockParams,
    inputValueGas,
    isApproved,
    chainId,
  )

  const safeMarginMinRaw = position?.safeMarginMinimum
  const safeMarginMinParsed =
    safeMarginMinRaw && formatBigIntToString(safeMarginMinRaw, marginToken?.decimals)
  const safeMarginMinFormatted = formatNumberAmount(safeMarginMinParsed, true)

  const marginRaw = position?.margin
  const marginParsed = marginRaw && formatBigIntToString(marginRaw, marginToken?.decimals)
  const marginFormatted = formatNumberAmount(marginParsed)

  const updatedPositionMargin =
    position?.margin && lockParams?.marginIn
      ? JSBI.add(
          JSBI.BigInt(position.margin.toString()),
          JSBI.BigInt(lockParams.marginIn.toString()),
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

  const newLiquidationPriceParsed = convertX96Prices(
    newLiquidationPriceX96 as string,
    pool?.token0,
    pool?.token1,
  )
  const newLiquidationPriceFormatted = formatNumberAmount(newLiquidationPriceParsed, true)

  const currentLeverage = calculatePositionLeverage(position?.margin, position?.size)
  const currentLeverageFormatted = formatNumberAmount(currentLeverage, true)

  const newLeverage =
    updatedPositionMargin &&
    calculatePositionLeverage(BigInt(updatedPositionMargin), position?.size)
  const newLeverageFormatted = formatNumberAmount(newLeverage, true)

  const liquidationPriceX96 = useLiquidationPrice(
    chainId,
    zeroForOne,
    position?.size,
    position?.debt,
    position?.margin,
    pool?.maintenance,
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
  const oraclePriceFormatted = formatNumberAmount(oraclePriceParsed, true)

  const poolPriceParsed = convertX96Prices(sqrtPriceX96, pool?.token0, pool?.token1)
  const poolPriceFormatted = formatNumberAmount(poolPriceParsed, true)

  const liquidationPriceParsed = convertX96Prices(
    liquidationPriceX96 as string,
    pool?.token0,
    pool?.token1,
  )
  const liquidationPriceFormatted = formatNumberAmount(liquidationPriceParsed, true)

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
    onUserInput("")
    // handleReturnToPosition(position?.id)
  }

  const approveToken = async (
    amount: bigint | undefined,
    spenderAddress: Address,
    tokenAddress: Address,
  ) => {
    if (!amount) {
      throw new Error("Require amount to approve")
    }
    if (!spenderAddress) {
      throw new Error("Require spender address to approve")
    }
    if (!tokenAddress) {
      throw new Error("Require token address to approve")
    }
    try {
      setTransactionState({
        showConfirm: false,
        isPendingWallet: true,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: false,
        txHash: null,
        txError: null,
      })

      const txHash = await approveErc20Token({
        amount: maxUint256,
        spenderAddress,
        tokenAddress,
      })

      setTransactionState({
        showConfirm: false,
        isPendingWallet: false,
        isPendingApprove: true,
        isPendingTx: false,
        isTxSubmitted: false,
        txHash: null,
        txError: null,
      })

      const receipt: TransactionReceipt = await waitForTransaction({
        hash: txHash,
        timeout: 60_000,
      })

      setTransactionState({
        showConfirm: false,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: false,
        txHash: null,
        txError: null,
      })

      await fetchAllowance()
      refetchLockCallback()
    } catch (error) {
      if (isTransactionReceiptError(error)) {
        fetchTokenBalances()
        refetchLockCallback()
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
          showConfirm: false,
          txError: getTransactionError(error, "handleLockCallback"),
        }))
      }
    }
  }

  const handleLockCallback = async () => {
    let txHash = undefined
    try {
      if (!position.tokenId) {
        throw new Error("Missing Token Id")
      }
      if (!lockCallback) {
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

      const transaction = await lockCallback()

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

      await fetchTokenBalances()

      setTransactionState({
        showConfirm: true,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: true,
        txHash: transaction.hash,
        txError: null,
      })

      await fetchPositionState(position?.id)

      return transaction.hash
    } catch (error) {
      console.error(error)
      if (isTransactionReceiptError(error)) {
        await fetchTokenBalances()
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
          txError: getTransactionError(error, "handleLockCallback"),
        }))
      }
    }
  }

  return (
    <div className="relative">
      <div className="p-2 space-y-2 border border-t-0 sm:space-y-4 sm:p-4 bg-marginalGray-900 border-marginalGray-800 rounded-b-3xl">
        <InputContainer id="add-margin-input-container">
          <TradeInput title="Collateral" inputValue={inputValue} onChange={onUserInput} />
          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-1 text-xl tracking-thin font-bold mb-1.5">
              <TokenSelected
                selectedToken={marginToken}
                useGasToken={isTokenWrappedGasToken && useGasToken}
                chainId={chainId}
              />

              {address && isTokenWrappedGasToken && (
                <>
                  <UseGasTokenDropdown
                    useGas={useGasToken}
                    setUseGas={setUseGasToken}
                    chainId={chainId}
                  />
                </>
              )}
            </div>

            {isTokenWrappedGasToken && useGasToken ? (
              <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                <div className="text-marginalGray-600 whitespace-nowrap">
                  Balance: {shortenedParsedGasBalance}
                </div>
                <div
                  className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                  onClick={() => onUserInput(parsedGasBalance ? parsedGasBalance : "")}
                >
                  Max
                </div>
              </div>
            ) : (
              <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                <div className="text-marginalGray-600 whitespace-nowrap">
                  Balance:{" "}
                  {shortenedParsedMarginTokenBalance
                    ? parseFloat(shortenedParsedMarginTokenBalance).toFixed(4).trim()
                    : "0.0"}
                </div>
                <div
                  className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                  onClick={() =>
                    onUserInput(parsedMarginTokenBalance ? parsedMarginTokenBalance : "")
                  }
                >
                  Max
                </div>
              </div>
            )}
          </div>
        </InputContainer>

        <AddMarginButton
          chainId={chainId}
          marginToken={marginToken}
          isInputValid={isInputValid}
          isTokenValid={!isBlank(marginToken)}
          isApproved={isApproved}
          onApprove={() =>
            approveToken(
              formattedInput,
              V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
              marginToken?.address as Address,
            )
          }
          lockCallback={handleLockCallback}
          isPendingWallet={isPendingWallet}
          isPendingApprove={isPendingApprove}
          isBalanceSufficient={isBalanceSufficient}
          isPendingTx={isPendingTx}
          error={null}
          disabled={
            isTokenWrappedGasToken && useGasToken
              ? Number(shortenedParsedGasBalance) === 0
              : Number(shortenedParsedMarginTokenBalance) === 0
          }
          useGasToken={isTokenWrappedGasToken && useGasToken}
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
                    {newLiquidationPriceParsed ? (
                      <div>{formatNumberAmount(newLiquidationPriceParsed, true)}</div>
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
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showConfirm && (
          <ConfirmTransactionModal
            chainId={chainId}
            open={showConfirm}
            onOpen={handleOpenConfirmModal}
            onClose={handleCloseConfirmModal}
            onReset={onSuccessTx}
            onCallback={handleLockCallback}
            isPendingWallet={isPendingWallet}
            isPendingApprove={isPendingApprove}
            isPendingTx={isPendingTx}
            isTxSubmitted={isTxSubmitted}
            txHash={txHash}
            txError={txError}
            hasConfirmModal={false}
            onSuccessText="Deposit Executed"
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default AddMargin

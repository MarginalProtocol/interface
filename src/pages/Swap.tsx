import _, { isUndefined } from "lodash"
import { useMemo, useEffect, useState } from "react"
import { InputContainer } from "../components/Containers/InputContainer"
import { SwapInput } from "../components/Swap/SwapInput"
import { useSwapState, useSwapActionHandlers, useSwapStatus } from "../state/swap/hooks"
import { usePoolsData } from "../hooks/usePoolsData"
import { useDerivePoolsFromTokens } from "../hooks/useDerivePoolsFromTokens"
import { type PoolData } from "../types"
import { TokenSelector } from "../components/Trade/TokenSelector"
import { filterTokenFromList } from "../utils/filterTokenFromList"
import { SwapOutput } from "../components/Swap/SwapOutput"
import { useAccount, Address } from "wagmi"
import { maxUint256, zeroAddress } from "viem"
import { useErc20TokenBalances } from "../hooks/useErc20TokenBalances"
import { useViewQuoteExactInputSingle } from "../hooks/useViewQuoteExactInputSingle"
import { constructExactInputSingleParams } from "src/hooks/constructExactInputSingleParams"
import { trimTrailingZeroes } from "../utils/trimTrailingZeroes"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { useExactInputSingleCallback } from "../hooks/useExactInputSingleCallback"
import { V1_ROUTER_ADDRESS, V1_QUOTER_ADDRESS } from "../constants/addresses"
import { isBlank } from "../utils/isBlank"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"
import { ConfirmSwapButton } from "../components/Swap/ConfirmSwapButton"
import { waitForTransaction } from "@wagmi/core"
import { getTransactionError } from "../utils/getTransactionError"
import { useErc20ApproveCallback } from "../hooks/useErc20ApproveCallback"
import { useErc20TokenAllowance } from "../functions/getErc20TokenAllowance"
import { isTransactionReceiptError } from "../utils/isTransactionReceiptError"
import { approveErc20Token } from "../functions/approveErc20Token"
import { TransactionReceipt } from "viem"
import { ConfirmSwapModal } from "../components/Swap/ConfirmSwapModal"
import { useSettingsToggle } from "../hooks/useSettingsToggle"
import { useSettingsState } from "../state/settings/hooks"
import { SlippageButton } from "../components/Settings/SlippageButton"
import { AnimatePresence } from "framer-motion"
import { useModalIsOpen, useOpenModal, useCloseModal } from "../state/application/hooks"
import { ApplicationModal } from "../state/application/reducer"
import Dialog from "../components/Dialog/Dialog"
import { CurrencySearch } from "../components/Modals/CurrencySearch"
import { deduplicateTokenOptions } from "../functions/deduplicateTokenOptions"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { createTokenList } from "../functions/createTokenList"
import { Token } from "../types"
import { TokenInfo } from "@uniswap/token-lists"
import { DEFAULT_CHAIN_ID } from "../constants/chains"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"
import { isGasToken } from "src/utils/isGasToken"
import { GAS_TOKEN_MAP, WRAPPED_GAS_TOKEN_MAP } from "src/constants/tokens"
import { useOraclePoolPrices } from "src/hooks/useOraclePoolPrices"
import { convertX96PricesToBigInt } from "src/functions/convertX96Prices"
import { formatNumberAmount } from "src/utils/formatNumberAmount"
import { SwapDetailList } from "src/components/Swap/SwapDetailList"
import { deriveSwapParamsWithSlippage } from "../hooks/deriveSwapParamsWithSlippage"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { getValidAddress } from "src/utils/getValidAddress"
import { calculatePriceImpact } from "src/hooks/calculatePriceImpact"
import { getPoolMaxLeverage } from "src/functions/getPoolMaxLeverage"
import { useApplicationState } from "src/state/application/hooks"
import { calculateInversablePrices } from "src/functions/calculateInversablePrices"
import { useInversePrice } from "src/hooks/useInversePrice"
import { DownArrowIcon } from "src/components/DownArrow"
import { usePoolTokenPricesInUSD } from "src/hooks/usePoolTokenPricesInUSD"
import { extrapolateTokenPair } from "src/functions/extrapolateTokenPair"
import { formatUSDCurrency } from "src/utils/formatUSDCurrency"

const Swap = () => {
  const { address, isConnected } = useAccount()
  const { chainId } = useApplicationState()
  const { inputValue, swapToken, inputToken, outputToken } = useSwapState()
  const {
    onUserInput,
    onSelectSwapToken,
    onSelectInputToken,
    onSelectOutputToken,
    onResetSwapState,
  } = useSwapActionHandlers()
  const { showSettings, onOpenSettings, onCloseSettings } = useSettingsToggle()
  const { maxSlippage, transactionDeadline } = useSettingsState()
  const { isInputValid, isInputTokenValid, isOutputTokenValid, isSwapInputsValid } =
    useSwapStatus()
  const [useInverse, onToggleInverse] = useInversePrice()

  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)

  const isInputOpen = useModalIsOpen(ApplicationModal.SWAP_INPUT_LIST)
  const isOutputOpen = useModalIsOpen(ApplicationModal.SWAP_OUTPUT_LIST)

  const openInputTokenListModal = useOpenModal(ApplicationModal.SWAP_INPUT_LIST)
  const openOutputTokenListModal = useOpenModal(ApplicationModal.SWAP_OUTPUT_LIST)
  const closeInputModal = useCloseModal()
  const closeOutputModal = useCloseModal()

  const WRAPPED_GAS_TOKEN = WRAPPED_GAS_TOKEN_MAP[chainId]
  const GAS_TOKEN = GAS_TOKEN_MAP[chainId]

  useEffect(() => {
    onUserInput("")
    onSelectSwapToken(null)
    onSelectInputToken(null)
    onSelectOutputToken(null)
  }, [chainId])

  const handleSelectInputToken = (token: any) => {
    if (isGasToken(token)) {
      onSelectInputToken(token)
      onSelectSwapToken(WRAPPED_GAS_TOKEN)

      if (isWrappedGasToken(outputToken, chainId)) {
        onSelectOutputToken(null)
      }
    } else {
      onSelectInputToken(token)
      onSelectSwapToken(token)

      if (outputToken === token) {
        onSelectOutputToken(null)
      }
    }

    closeInputModal()
  }

  const handleSelectOutputToken = (token: any) => {
    if (isWrappedGasToken(token, chainId) && isGasToken(inputToken)) {
      onSelectInputToken(null)
    }
    onSelectOutputToken(token)
    closeOutputModal()
  }

  const isInputWrappedGasToken = isWrappedGasToken(inputToken, chainId)
  const isInputGasToken = isGasToken(inputToken)

  const defaultTokens = useDefaultActiveTokens(chainId ?? DEFAULT_CHAIN_ID)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const { pools, tokensFromPools: tokenOptions } = usePoolsData()
  const allTokenOptions: Token[] = deduplicateTokenOptions(
    defaultTokensList,
    tokenOptions,
  )
  const leverageCap = getPoolMaxLeverage(pools[0]?.maintenance)

  const includeGasTokenOptionWhenWethAvailable = (tokenList: Token[]) => {
    const list = [...tokenList]
    const hasWrappedGasToken = list.some(
      (token: Token) => token.symbol === WRAPPED_GAS_TOKEN.symbol,
    )

    if (hasWrappedGasToken) {
      list.push(GAS_TOKEN)
    }

    return list
  }

  const inputTokenOptions = includeGasTokenOptionWhenWethAvailable(allTokenOptions)

  const outputTokenOptions = isInputWrappedGasToken || isInputGasToken

  const handleSwitchTokens = (prevInputToken: any, prevOutputToken: any) => {
    // inputToken
    if (isGasToken(prevOutputToken)) {
      onSelectInputToken(prevOutputToken)
      onSelectSwapToken(WRAPPED_GAS_TOKEN)

      if (isWrappedGasToken(outputToken, chainId)) {
        onSelectOutputToken(null)
      }
    } else {
      onSelectInputToken(prevOutputToken)
      onSelectSwapToken(prevOutputToken)

      if (outputToken === prevOutputToken) {
        onSelectOutputToken(null)
      }
    }
    // outputToken
    if (isWrappedGasToken(prevInputToken, chainId) && isGasToken(inputToken)) {
      onSelectInputToken(null)
    }
    if (isGasToken(prevInputToken)) {
      // onSelectOutputToken(wethToken)
    } else {
      onSelectOutputToken(prevInputToken)
    }

    // Set inputValue to quotedOutput
    if (quotedOutput) {
      onUserInput(quotedOutput)
    }
  }

  const derivedPools: PoolData[] = useDerivePoolsFromTokens(swapToken, outputToken, pools)
  const selectedPool = derivedPools[0]
  const zeroForOne =
    getValidAddress(swapToken?.address) === getValidAddress(selectedPool?.token0?.address)
  const { quoteToken } = extrapolateTokenPair(
    selectedPool?.token0,
    selectedPool?.token1,
    chainId,
  )

  const { sqrtPriceX96, oracleSqrtPriceX96 } = useOraclePoolPrices(
    chainId,
    selectedPool?.token0?.address as Address,
    selectedPool?.token1?.address as Address,
    selectedPool?.maintenance,
    selectedPool?.oracleAddress as Address,
  )

  const { token0PriceInUSD, token1PriceInUSD } = usePoolTokenPricesInUSD(
    chainId,
    quoteToken,
    selectedPool?.token0,
    selectedPool?.token1,
    sqrtPriceX96,
  )

  const inputTokenPriceInUSD =
    getValidAddress(swapToken?.address) === getValidAddress(selectedPool?.token0?.address)
      ? token0PriceInUSD
      : token1PriceInUSD

  const outputTokenPriceInUSD =
    getValidAddress(outputToken?.address) ===
    getValidAddress(selectedPool?.token0?.address)
      ? token0PriceInUSD
      : token1PriceInUSD

  const { poolPrice, oraclePrice } = calculateInversablePrices(
    useInverse,
    oracleSqrtPriceX96,
    sqrtPriceX96,
    undefined,
    selectedPool?.token0,
    selectedPool?.token1,
  )

  const { allowance, parsedAllowance, fetchAllowance } = useErc20TokenAllowance(
    inputToken?.address as Address,
    Number(inputToken?.decimals),
    address,
    V1_ROUTER_ADDRESS[chainId],
    chainId,
  )

  useEffect(() => {
    if (chainId && inputToken && address) {
      ;(async () => {
        await fetchAllowance()
      })()
    }
  }, [chainId, inputToken, address, fetchAllowance])

  const formattedInput = !isBlank(inputValue)
    ? formatStringToBigInt(inputValue, inputToken?.decimals)
    : 0n

  const { balances: tokenBalances, refetch: fetchTokenBalances } = useErc20TokenBalances(
    [inputToken],
    address,
  )

  const {
    balance: inputTokenBalance,
    parsedBalance: parsedInputTokenBalance,
    shortenedParsedBalance: shortenedParsedInputTokenBalance,
  } = _.find(tokenBalances, { token: inputToken }) || {}

  const isBalanceSufficient = useMemo(() => {
    if (!isUndefined(inputTokenBalance) && !isUndefined(formattedInput)) {
      return inputTokenBalance >= formattedInput
    } else {
      return true
    }
  }, [inputTokenBalance, formattedInput])

  const showBalance = address && inputToken

  const isApproved = useMemo(() => {
    if (_.isUndefined(allowance) || _.isUndefined(formattedInput)) return false
    if (inputToken && isGasToken(inputToken)) return true
    return allowance >= formattedInput
  }, [allowance, formattedInput, inputToken])

  const showAllowance = useMemo(() => {
    if (_.isUndefined(allowance)) return false
    if (_.isUndefined(inputTokenBalance)) return false
    if (isGasToken(inputToken)) return false
    return inputTokenBalance >= allowance
  }, [inputToken, inputTokenBalance, allowance])

  const quoteExactInputSingleArgs = constructExactInputSingleParams(
    swapToken,
    outputToken,
    selectedPool?.maintenance,
    selectedPool?.oracleAddress,
    isConnected ? address : zeroAddress,
    inputValue,
    currentBlockTimestamp,
    transactionDeadline,
  )

  const [exactInputSingleQuote, error] = useViewQuoteExactInputSingle(
    V1_QUOTER_ADDRESS[chainId],
    quoteExactInputSingleArgs,
  )

  const priceImpact = calculatePriceImpact(
    exactInputSingleQuote?.sqrtPriceX96After,
    sqrtPriceX96,
    zeroForOne,
  )

  const derivedSwapParamsWithSlippage = deriveSwapParamsWithSlippage(
    quoteExactInputSingleArgs,
    exactInputSingleQuote,
    zeroForOne,
    convertX96PricesToBigInt(sqrtPriceX96),
    maxSlippage,
  )

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
      : "text-marginalGray-600"

  let isSlippageMoreThanToleranceError = undefined

  if (priceImpact && maxSlippage) {
    isSlippageMoreThanToleranceError =
      Math.abs(parseFloat(priceImpact.toString())) > Math.abs(parseFloat(maxSlippage))
        ? "Slippage exceeds tolerance"
        : undefined
  }

  const { exactInputSingleCallback, exactInputSingleError } = useExactInputSingleCallback(
    inputValue,
    derivedSwapParamsWithSlippage,
    isApproved,
    isInputGasToken,
    chainId,
  )

  const quotedOutput = useMemo(() => {
    if (inputValue && exactInputSingleQuote?.amountOut) {
      return trimTrailingZeroes(
        formatBigIntToString(
          BigInt(exactInputSingleQuote?.amountOut.toString()),
          outputToken?.decimals,
        ),
      )
    } else {
      return ""
    }
  }, [outputToken, exactInputSingleQuote, inputValue])

  // TODO: Switch back to approving input amount when RPC stable
  const {
    approveCallback,
    isSuccess: isSuccessApprove,
    data,
  } = useErc20ApproveCallback(
    inputToken?.address as Address,
    V1_ROUTER_ADDRESS[chainId],
    maxUint256,
    // formattedInput,
  )

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

  const onSuccessReset = () => {
    handleResetTransactionState()
    onResetSwapState()
    onUserInput("")
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

      await waitForTransaction({
        hash: txHash,
        timeout: 100_000,
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
    } catch (error) {
      console.error("Error approving token: ", error)
      if (isTransactionReceiptError(error)) {
        setTransactionState({
          showConfirm: false,
          isPendingWallet: false,
          isPendingApprove: false,
          isPendingTx: false,
          isTxSubmitted: false,
          txHash: null,
          txError: null,
        })

        fetchAllowance()
      }
    }
  }

  const handleSwapCallback = async () => {
    let txHash = undefined
    try {
      if (!exactInputSingleCallback) {
        return new Error("Missing swap callback")
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

      const transaction = await exactInputSingleCallback()

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

      setTransactionState({
        showConfirm: true,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: true,
        txHash: transaction.hash,
        txError: null,
      })

      await fetchAllowance()
      await fetchTokenBalances()

      return transaction.hash
    } catch (error) {
      if (isTransactionReceiptError(error)) {
        await fetchAllowance()
        await fetchTokenBalances()
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
          isPendingWallet: false,
          isPendingApprove: false,
          isPendingTx: false,
        }))
      } else {
        setTransactionState((prevState) => ({
          ...prevState,
          txError: getTransactionError(error, "handleSwapCallback"),
        }))
      }
    }
  }

  return (
    <>
      <div className="origin-top md:scale-90 md:mt-16">
        <div className="relative mx-auto bg-marginalGray-900 border border-marginalGray-800 max-w-[381px] sm:max-w-[488px] rounded-3xl drop-shadow-black">
          <div className="flex items-center justify-between p-4">
            <div className="relative text-lg sm:text-xl tracking-thin font-bold uppercase text-[#CACACA]">
              Swap
            </div>
            <SlippageButton
              maxSlippage={maxSlippage}
              showSettings={showSettings}
              onClose={onCloseSettings}
              onOpen={onOpenSettings}
            />
          </div>

          <div className="h-[1px] bg-marginalGray-800" />

          <div className="p-2 space-y-1 md:p-4">
            <div>
              <InputContainer id="swap-input-container">
                <div className="flex flex-col w-full">
                  <SwapInput
                    title="You Pay"
                    inputValue={inputValue}
                    onChange={onUserInput}
                  />
                  {inputValue && inputTokenPriceInUSD && (
                    <div className="flex items-center justify-between mt-1">
                      <div
                        className={`text-xs tracking-thin text-marginalGray-400 uppercase md:text-sm`}
                      >
                        {formatUSDCurrency(inputTokenPriceInUSD * parseFloat(inputValue))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end justify-center">
                  <TokenSelector
                    onClick={openInputTokenListModal}
                    selectedToken={inputToken}
                    tokenOptions={filterTokenFromList(inputTokenOptions, inputToken)}
                    onSelect={onSelectInputToken}
                    showSwapStyles={true}
                  />
                  <Dialog
                    id="swap-input"
                    isOpen={isInputOpen}
                    onClose={closeInputModal}
                    title="Select input token"
                  >
                    <CurrencySearch
                      isOpen={isInputOpen}
                      onDismiss={closeInputModal}
                      onSelectToken={handleSelectInputToken}
                      allTokens={inputTokenOptions}
                      tradeableTokens={tokenOptions}
                      className="w-full"
                    />
                  </Dialog>

                  {showBalance && (
                    <div className="flex mt-3 space-x-2 text-xs font-bold uppercase sm:text-sm tracking-thin">
                      <div className="text-marginalGray-600 whitespace-nowrap">
                        Balance: {shortenedParsedInputTokenBalance}
                      </div>
                      <div
                        className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                        onClick={() => {
                          onUserInput(
                            parsedInputTokenBalance ? parsedInputTokenBalance : "",
                          )
                        }}
                      >
                        Max
                      </div>
                    </div>
                  )}
                </div>
              </InputContainer>

              <div
                id="switch-token-button"
                className="relative flex items-end justify-center mx-auto -my-6 cursor-pointer"
                onClick={() => {
                  handleSwitchTokens(inputToken, outputToken)
                }}
              >
                <DownArrowIcon />
              </div>
            </div>

            <InputContainer id="swap-output-container">
              <div className="flex flex-col w-full">
                <SwapOutput title="You Receive" outputValue={quotedOutput} />
                {quotedOutput && outputTokenPriceInUSD && (
                  <div className="flex items-center justify-between mt-1">
                    <div
                      className={`text-xs tracking-thin text-marginalGray-400 uppercase md:text-sm`}
                    >
                      {formatUSDCurrency(
                        outputTokenPriceInUSD * parseFloat(quotedOutput),
                      )}
                    </div>
                  </div>
                )}

                {priceImpact && (
                  <div className="flex items-center justify-between mt-1">
                    <div
                      className={`text-xs tracking-thin font-bold uppercase ${priceImpactIndicator} md:text-sm`}
                    >
                      impact: (-{priceImpact?.toFixed(2)}%)
                    </div>
                  </div>
                )}
              </div>
              <TokenSelector
                onClick={openOutputTokenListModal}
                selectedToken={outputToken}
                tokenOptions={filterTokenFromList(tokenOptions, inputToken)}
                onSelect={onSelectInputToken}
                showSwapStyles={true}
              />
              <Dialog
                id="swap-output"
                isOpen={isOutputOpen}
                onClose={closeOutputModal}
                title="Select output token"
              >
                <CurrencySearch
                  isOpen={isOutputOpen}
                  onDismiss={closeOutputModal}
                  onSelectToken={handleSelectOutputToken}
                  allTokens={filterTokenFromList(allTokenOptions, inputToken)}
                  tradeableTokens={tokenOptions}
                  className="w-full"
                />
              </Dialog>
            </InputContainer>
            <div className="pt-1">
              <ConfirmSwapButton
                chainId={chainId}
                inputToken={inputToken}
                isInputValid={isInputValid}
                isTokensValid={isInputTokenValid && isOutputTokenValid}
                isApproved={isApproved}
                isBalanceSufficient={isBalanceSufficient}
                onApprove={() =>
                  approveToken(
                    formattedInput,
                    V1_ROUTER_ADDRESS[chainId],
                    inputToken?.address as Address,
                  )
                }
                onConfirm={handleOpenConfirmModal}
                swapCallback={handleSwapCallback}
                isPendingWallet={isPendingWallet}
                isPendingApprove={isPendingApprove}
                isPendingTx={isPendingTx}
                error={error || isSlippageMoreThanToleranceError}
              />
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-[381px] sm:max-w-[488px] mb-[96px] md:mb-0 mt-4 px-0 md:px-4">
          <SwapDetailList
            pool={selectedPool}
            token0={selectedPool?.token0}
            token1={selectedPool?.token1}
            poolPrice={formatNumberAmount(poolPrice, true)}
            maxSlippage={maxSlippage}
            leverageTier={leverageCap}
            useInverse={useInverse}
            onToggleInverse={onToggleInverse}
          />
          {isInputGasToken && (
            <span className="flex justify-end">
              <a
                href="https://app.uniswap.org/swap"
                target="_blank"
                rel="noreferrer"
                className="text-sm font-bold uppercase tracking-thin text-marginalOrange-500 hover:underline"
              >
                Wrap your {GAS_TOKEN.symbol}
              </a>
            </span>
          )}
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showConfirm && (
          <ConfirmSwapModal
            chainId={chainId}
            pool={selectedPool}
            inputToken={inputToken}
            outputToken={outputToken}
            open={showConfirm}
            onOpen={handleOpenConfirmModal}
            onClose={handleResetTransactionState}
            onReset={onSuccessReset}
            quotedInput={inputValue}
            quotedOutput={quotedOutput}
            swapQuote={exactInputSingleQuote}
            swapCallback={handleSwapCallback}
            isPendingWallet={isPendingWallet}
            isPendingApprove={isPendingApprove}
            isPendingTx={isPendingTx}
            isTxSubmitted={isTxSubmitted}
            txHash={txHash}
            txError={txError}
            poolPrice={formatNumberAmount(poolPrice, true)}
            maxSlippage={maxSlippage}
            useInverse={useInverse}
            onToggleInverse={onToggleInverse}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Swap

import { useState, useEffect, useMemo } from "react"
import { useAccount, Address, useNetwork } from "wagmi"
import { maxUint256, zeroAddress } from "viem"
import {
  useTradeActionHandlers,
  useTradeState,
  useTradeStatus,
} from "../state/trade/hooks"
import _, { isUndefined } from "lodash"
import { TokenSelector } from "../components/Trade/TokenSelector"
import { TradeInput } from "../components/Trade/TradeInput"
import { TradeOutput } from "../components/Trade/TradeOutput"
import { ConfirmTradeButton } from "../components/Trade/ConfirmTradeButton"
import { TradeDetailList } from "../components/Trade/TradeDetailList"
import { useViewQuoteMint } from "../hooks/useViewQuoteMint"
import { usePoolsData } from "../hooks/usePoolsData"
import { PoolData } from "../types"
import { constructQuoteMintParams } from "../functions/constructQuoteMintParams"
import { useDerivePoolsFromToken } from "../hooks/useDerivePoolsFromTokens"
import { useMintCallback } from "../hooks/useMintCallback"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"
import {
  V1_NFT_POSITION_MANAGER_ADDRESS,
  V1_QUOTER_ADDRESS,
} from "../constants/addresses"
import { TransactionReceipt } from "viem"
import { waitForTransaction } from "@wagmi/core"
import { Token } from "../types"
import { filterTokenFromListWithoutWrappedGasToken } from "../utils/filterTokenFromList"
import { ConfirmTradeModal } from "../components/Trade/ConfirmTradeModal"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { isBlank } from "../utils/isBlank"
import { useErc20TokenBalances } from "../hooks/useErc20TokenBalances"
import { LeverageSlider } from "../components/Trade/LeverageSlider"
import { InputContainer } from "../components/Containers/InputContainer"
import { getTransactionError } from "../utils/getTransactionError"
import { AnimatePresence } from "framer-motion"
import { useErc20TokenAllowance } from "../functions/getErc20TokenAllowance"
import { approveErc20Token } from "../functions/approveErc20Token"
import { isTransactionReceiptError } from "../utils/isTransactionReceiptError"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import { TokenSelected } from "../components/Token/TokenSelected"
import { TradeDirectionButtons } from "../components/Trade/TradeDirectionButtons"
import { getValidAddress } from "../utils/getValidAddress"
import { useLiquidationPrice } from "../hooks/useLiquidationPrice"
import { useOraclePoolPrices } from "../hooks/useOraclePoolPrices"
import { convertX96FundingRate } from "../functions/convertX96FundingRate"
import { convertX96PricesToBigInt } from "../functions/convertX96Prices"
import { getPoolMaxLeverage } from "../functions/getPoolMaxLeverage"
import { calculateRelativeSqrtPriceDiff } from "../functions/calculateRelativeSqrtPriceDiff"
import { calculatePriceImpact } from "../hooks/calculatePriceImpact"
import { useSettingsToggle } from "../hooks/useSettingsToggle"
import { useSettingsState } from "../state/settings/hooks"
import { SlippageButton } from "../components/Settings/SlippageButton"
import { deriveMintParamsWithSlippage } from "../functions/deriveMintParamsWithSlippage"
import Dialog from "../components/Dialog/Dialog"
import { useOpenModal, useModalIsOpen, useCloseModal } from "../state/application/hooks"
import { ApplicationModal } from "../state/application/reducer"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { TokenInfo } from "@uniswap/token-lists"
import { CurrencySearch } from "../components/Modals/CurrencySearch"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { TokenAsset } from "../components/Token/TokenAsset"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { DEFAULT_CHAIN_ID } from "../constants/chains"
import { useEscrowRewards } from "../hooks/useEscrowRewards"
import { deduplicateTokenOptions } from "../functions/deduplicateTokenOptions"
import { createTokenList } from "../functions/createTokenList"
import { calculateHealthFactor } from "../functions/calculateHealthFactor"
import { UseGasTokenDropdown } from "../components/UseGasTokenDropdown"
import { usePoolsState } from "../hooks/usePoolsState"
import { usePoolLiquidityLocked } from "src/hooks/usePoolLiquidityLocked"
import { GAS_TOKEN_MAP, WRAPPED_GAS_TOKEN_MAP } from "src/constants/tokens"
import { useNativeTokenBalance } from "src/hooks/useNativeTokenBalance"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { extrapolateTokenPair } from "../functions/extrapolateTokenPair"
import { useApplicationState } from "src/state/application/hooks"
import { calculateInversablePrices } from "src/functions/calculateInversablePrices"
import { useInversePrice } from "../hooks/useInversePrice"
import { DownArrowIcon } from "src/components/DownArrow"
import JSBI from "jsbi"
import { formatUSDCurrency } from "src/utils/formatUSDCurrency"
import { usePoolTokenPricesInUSD } from "../hooks/usePoolTokenPricesInUSD"

export const mergePoolsData = (poolsState?: any[], poolsLiquidityLocked?: any[]) => {
  const mergedData = poolsState?.map((state) => {
    const matchingLiquidity = poolsLiquidityLocked?.find(
      (liquidity) => liquidity?.pool?.poolAddress === state?.pool?.poolAddress,
    )
    return {
      ...state,
      liquidityLocked: matchingLiquidity?.liquidityLocked,
      parsedLockedLiquidity: matchingLiquidity?.parsedLockedLiquidity,
      liquidityFree:
        parseFloat(state?.liquidity?.toString()) -
        parseFloat(matchingLiquidity?.liquidityLocked?.toString()),
    }
  })

  return mergedData
}

export const rankPoolsByLiquidityAvailable = (mergedPoolsState?: any[]) => {
  return _.sortBy(mergedPoolsState, ["liquidityFree"]).reverse()
}

const Trade = () => {
  const { chainId } = useApplicationState()
  const { address, isConnected } = useAccount()
  const { inputValue, leverage, tradeToken, marginToken, debtToken, isLong } =
    useTradeState()
  const {
    onSelectLeverage,
    onUserInput,
    onSelectTradeToken,
    onSelectMarginToken,
    onSelectDebtToken,
    onSetIsLong,
    onResetTradeState,
  } = useTradeActionHandlers()
  const { showSettings, onOpenSettings, onCloseSettings } = useSettingsToggle()
  const { maxSlippage, transactionDeadline } = useSettingsState()
  const { isTradeInputsValid, isInputValid, isMarginTokenValid, isDebtTokenValid } =
    useTradeStatus()
  const [useInverse, onToggleInverse] = useInversePrice()

  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)

  const isOpen = useModalIsOpen(ApplicationModal.TOKEN_LIST)
  const openTokenListModal = useOpenModal(ApplicationModal.TOKEN_LIST)
  const closeModal = useCloseModal()

  const handleSelectTradeToken = (token: any) => {
    onSelectTradeToken(token)
    closeModal()
  }
  const { pools, tokensFromPools: tokenOptions } = usePoolsData()

  const derivedPools: PoolData[] = useDerivePoolsFromToken(tradeToken, pools)

  const [useGasToken, setUseGasToken] = useState<boolean>(true)
  const displayGasToken: boolean = !isLong && useGasToken
  const isMarginTokenWrappedGasToken = isWrappedGasToken(marginToken, chainId)

  const poolsState = usePoolsState(derivedPools, chainId)
  const poolsLiquidityLocked = usePoolLiquidityLocked(derivedPools)

  const mergedPoolsState = mergePoolsData(poolsState, poolsLiquidityLocked)
  const rankedPools = rankPoolsByLiquidityAvailable(mergedPoolsState)
  const selectedPool = rankedPools?.[0]?.pool

  const GAS_TOKEN = GAS_TOKEN_MAP[chainId]

  const defaultTokens = useDefaultActiveTokens(chainId ?? DEFAULT_CHAIN_ID)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(selectedPool?.token0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(selectedPool?.token1, defaultTokensList)
  const { baseToken, quoteToken } = extrapolateTokenPair(token0, token1, chainId)

  const zeroForOne =
    getValidAddress(marginToken?.address) ===
    getValidAddress(selectedPool?.token1?.address)

  const allTokenOptions: Token[] = deduplicateTokenOptions(
    defaultTokensList,
    tokenOptions,
  )

  const formattedInput = !isBlank(inputValue)
    ? formatStringToBigInt(inputValue, marginToken?.decimals)
    : 0n

  const { allowance, parsedAllowance, fetchAllowance } = useErc20TokenAllowance(
    marginToken?.address as Address,
    Number(marginToken?.decimals),
    address,
    V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    chainId,
  )

  useEffect(() => {
    onUserInput("")
    onSelectTradeToken(null)
    onSelectMarginToken(null)
    onSelectDebtToken(null)
  }, [chainId])

  useEffect(() => {
    if (chainId && marginToken && address) {
      if (!isOnlyZeroes(inputValue)) {
        ;(async () => {
          await fetchAllowance()
        })()
      }
    }
  }, [chainId, marginToken, address, fetchAllowance, inputValue])

  useEffect(() => {
    if (selectedPool && tradeToken && baseToken && quoteToken) {
      if (isLong) {
        if (marginToken !== baseToken) {
          onSelectMarginToken(baseToken)
        }
        if (debtToken !== quoteToken) {
          onSelectDebtToken(quoteToken)
        }
      } else {
        if (marginToken !== quoteToken) {
          onSelectMarginToken(quoteToken)
        }
        if (debtToken !== baseToken) {
          onSelectDebtToken(baseToken)
        }
      }
    }
  }, [selectedPool, isLong, tradeToken, baseToken, quoteToken])

  const {
    balance: gasBalance,
    parsedBalance: parsedGasBalance,
    shortenedParsedBalance: shortenedParsedGasBalance,
  } = useNativeTokenBalance(address, chainId)
  const { balances: tokenBalances, refetch: fetchTokenBalances } = useErc20TokenBalances(
    [marginToken, debtToken, GAS_TOKEN],
    address,
  )

  const {
    balance: marginTokenBalance,
    parsedBalance: parsedMarginTokenBalance,
    shortenedParsedBalance: shortenedParsedMarginTokenBalance,
  } = _.find(tokenBalances, { token: marginToken }) || {}

  const isApproved = useMemo(() => {
    if (displayGasToken) return true
    if (isUndefined(allowance) || isUndefined(formattedInput)) return false
    return allowance >= formattedInput
  }, [allowance, formattedInput, displayGasToken])

  const isBalanceSufficient = useMemo(() => {
    if (displayGasToken) {
      if (isUndefined(gasBalance)) return false
      if (isUndefined(formattedInput)) return true

      if (formattedInput && gasBalance) {
        return gasBalance >= formattedInput
      }
    } else {
      if (isUndefined(marginTokenBalance)) return false
      if (isUndefined(formattedInput)) return true

      if (formattedInput && marginTokenBalance) {
        return marginTokenBalance >= formattedInput
      }
    }
    return false
  }, [marginTokenBalance, formattedInput, displayGasToken, gasBalance])

  const showMarginTokenBalance = !address || !marginToken ? false : true

  const quoteMintArgs = constructQuoteMintParams(
    marginToken,
    debtToken,
    selectedPool?.token0?.address,
    selectedPool?.token1?.address,
    selectedPool?.oracleAddress,
    inputValue,
    leverage,
    selectedPool?.maintenance,
    isConnected ? address : zeroAddress, // Allow for quotes without wallet connected
    currentBlockTimestamp,
    transactionDeadline,
  )

  const [mintQuote, mintQuoteError, refetchMintQuote] = useViewQuoteMint(
    inputValue,
    V1_QUOTER_ADDRESS[chainId],
    quoteMintArgs,
  )

  const liquidationPriceX96 = useLiquidationPrice(
    chainId,
    zeroForOne,
    mintQuote?.size,
    mintQuote?.debt,
    mintQuote?.margin,
    selectedPool?.maintenance,
  )

  const { sqrtPriceX96, oracleSqrtPriceX96, fundingRatioX96 } = useOraclePoolPrices(
    chainId,
    selectedPool?.token0?.address as Address,
    selectedPool?.token1?.address as Address,
    selectedPool?.maintenance,
    selectedPool?.oracleAddress as Address,
  )

  const { oraclePrice, poolPrice, liquidationPrice } = calculateInversablePrices(
    useInverse,
    oracleSqrtPriceX96,
    sqrtPriceX96,
    liquidationPriceX96,
    selectedPool?.token0,
    selectedPool?.token1,
  )

  const { token0PriceInUSD, token1PriceInUSD } = usePoolTokenPricesInUSD(
    chainId,
    quoteToken,
    selectedPool?.token0,
    selectedPool?.token1,
    sqrtPriceX96,
  )

  const marginTokenPriceInUSD =
    getValidAddress(marginToken?.address) === getValidAddress(token0?.address)
      ? token0PriceInUSD
      : token1PriceInUSD

  const fundingRateParsed = convertX96FundingRate(fundingRatioX96)
  const fundingRateParsedSigned =
    fundingRateParsed && !isWrappedGasToken(token1, chainId)
      ? -fundingRateParsed
      : fundingRateParsed
  const fundingRateFormatted = formatNumberAmount(
    fundingRateParsedSigned?.toString(),
    true,
  )

  const relativeSqrtPriceDiff = calculateRelativeSqrtPriceDiff(
    oracleSqrtPriceX96,
    liquidationPriceX96 as string,
    zeroForOne,
  )

  const priceImpact = calculatePriceImpact(
    mintQuote?.sqrtPriceX96After,
    sqrtPriceX96,
    zeroForOne,
  )

  const derivedMintParamsWithSlippage = deriveMintParamsWithSlippage(
    quoteMintArgs,
    mintQuote,
    zeroForOne,
    convertX96PricesToBigInt(sqrtPriceX96),
    maxSlippage,
  )

  const { escrowRewards, fetchEscrowRewards } = useEscrowRewards(chainId)
  const escrowRewardsParsed =
    escrowRewards && formatBigIntToString(BigInt(escrowRewards), 18)
  const escrowRewardsFormatted = formatNumberAmount(escrowRewardsParsed, true)

  const fees = mintQuote?.fees
  const feesParsed = fees && formatBigIntToString(fees, 18)

  const escrowRewardsIncludingWrappedGasInput =
    escrowRewardsParsed && inputValue
      ? parseFloat(escrowRewardsParsed) + parseFloat(inputValue)
      : escrowRewardsParsed

  const isEscrowInGas = useGasToken && isMarginTokenWrappedGasToken

  const mintEscrowRewards = isEscrowInGas
    ? escrowRewardsIncludingWrappedGasInput?.toString()
    : escrowRewardsParsed

  const mintEscrowRewardsWithFees =
    mintEscrowRewards &&
    feesParsed &&
    parseFloat(mintEscrowRewards) + parseFloat(feesParsed)

  const mintEscrowRewardsWithBuffer = isEscrowInGas
    ? mintEscrowRewardsWithFees && (mintEscrowRewardsWithFees * 1.001).toString()
    : mintEscrowRewards && (parseFloat(mintEscrowRewards) * 1.001).toString()

  const {
    mintCallback,
    mintParams,
    mintError,
    refetch: refetchMintCallback,
  } = useMintCallback(
    inputValue,
    derivedMintParamsWithSlippage,
    mintEscrowRewardsWithBuffer,
    isApproved,
    chainId,
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
    fetchEscrowRewards()
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
    onResetTradeState()
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
      refetchMintCallback()
      refetchMintQuote()
      fetchEscrowRewards()
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

      refetchMintCallback()
      refetchMintQuote()
    }
  }

  if (txError) {
    console.log("txError in Trade: ", txError)
  }

  const handleMintCallback = async () => {
    let txHash = undefined
    try {
      if (!mintCallback) {
        return new Error("Missing mint callback")
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

      const transaction = await mintCallback()

      setTransactionState({
        showConfirm: true,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: true,
        isTxSubmitted: false,
        txHash: transaction.hash,
        txError: null,
      })

      await waitForTransaction({
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

      return transaction.hash
    } catch (error) {
      if (isTransactionReceiptError(error)) {
        fetchTokenBalances()
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
          txError: getTransactionError(error, "handleMintCallback"),
        }))
      }
    }
  }

  const quotedMargin = mintQuote?.margin
  const quotedMarginParsed =
    quotedMargin && formatBigIntToString(quotedMargin?.toString(), marginToken?.decimals)
  const quotedMarginFormatted = formatNumberAmount(quotedMarginParsed, true)

  const quotedDebt = mintQuote?.debt
  const quotedDebtParsed =
    quotedDebt && formatBigIntToString(quotedDebt?.toString(), debtToken?.decimals)
  const quotedDebtFormatted = formatNumberAmount(quotedDebtParsed, true)

  const quotedSize = mintQuote?.size
  const quotedSizeParsed =
    quotedSize && formatBigIntToString(quotedSize?.toString(), marginToken?.decimals)
  const quotedSizeFormatted = formatNumberAmount(quotedSizeParsed, true)

  const quotedTotalSize = quotedSize && quotedMargin && quotedSize + quotedMargin
  const quotedTotalSizeParsed =
    quotedTotalSize &&
    formatBigIntToString(quotedTotalSize?.toString(), marginToken?.decimals)
  const quotedTotalSizeFormatted = formatNumberAmount(quotedTotalSizeParsed, true)

  const quotedFees = mintQuote?.fees
  const quotedFeesParsed =
    quotedFees && formatBigIntToString(quotedFees?.toString(), marginToken?.decimals)
  const quotedFeesFormatted = formatNumberAmount(quotedFeesParsed, true)

  const poolLeverageMax = getPoolMaxLeverage(selectedPool?.maintenance)

  const isPriceImpactSevere = priceImpact
    ? Math.floor(Number(priceImpact) * 100) >= 500
    : undefined

  const isPriceImpactModerate = priceImpact
    ? Math.floor(Number(priceImpact) * 100) >= 100 && !isPriceImpactSevere
    : undefined

  const healthFactor = calculateHealthFactor(
    mintQuote?.margin,
    mintQuote?.safeMarginMinimum,
  )

  const priceImpactIndicator =
    priceImpact && (isPriceImpactModerate || isPriceImpactSevere)
      ? isPriceImpactSevere
        ? "text-error-500"
        : "text-warning-500"
      : "text-marginalGray-600"

  let isMarginUnsafeError = undefined
  let isSlippageMoreThanToleranceError = undefined

  if (mintQuote) {
    isMarginUnsafeError = mintQuote?.safe ? undefined : "Not enough margin."
  }

  if (priceImpact && maxSlippage) {
    isSlippageMoreThanToleranceError =
      parseFloat(priceImpact.toString()) > parseFloat(maxSlippage)
        ? "Slippage exceeds tolerance"
        : undefined
  }

  // parsedMarginTokenBalance - parsedMarginTokenBalance * quotedFeesParsed

  return (
    <>
      <div className="md:scale-[0.85] origin-top md:mt-12">
        <div className="relative mx-auto bg-marginalGray-900 border border-marginalGray-800 w-full max-w-[405px] sm:max-w-[520px] rounded-3xl">
          <div className="flex items-center justify-between p-4">
            {/* <TabSelector activePage="trade" /> */}
            <div className="relative text-lg font-bold uppercase md:text-xl tracking-thin text-marginalGray-200">
              Trade
            </div>
            <SlippageButton
              maxSlippage={maxSlippage}
              showSettings={showSettings}
              onClose={onCloseSettings}
              onOpen={onOpenSettings}
              textSize="lg"
            />
            <Dialog
              id="trade-input"
              isOpen={isOpen}
              onClose={closeModal}
              title="Select Token"
            >
              <CurrencySearch
                isOpen={isOpen}
                onDismiss={closeModal}
                onSelectToken={handleSelectTradeToken}
                allTokens={filterTokenFromListWithoutWrappedGasToken(
                  allTokenOptions,
                  chainId,
                )}
                tradeableTokens={tokenOptions}
                className="w-full"
              />
            </Dialog>
          </div>

          <div className="gap-2 px-2 pt-0 pb-2 space-y-2 md:px-4 md:pb-4">
            <div className="w-full p-4 text-xl font-bold uppercase rounded-lg tracking-thin bg-marginalBlack">
              <TokenSelector
                onClick={openTokenListModal}
                selectedToken={tradeToken}
                tokenOptions={filterTokenFromListWithoutWrappedGasToken(
                  allTokenOptions,
                  chainId,
                )}
                onSelect={onSelectTradeToken}
                showFullTokenName={true}
              />
            </div>
            <TradeDirectionButtons isLong={isLong} onSelect={onSetIsLong} />
          </div>

          <div className="h-[1px] bg-marginalGray-800" />

          <div className="p-2 space-y-2 md:p-4">
            <div>
              <InputContainer id="trade-input-container">
                <div className="flex flex-col w-full">
                  <TradeInput
                    title="Collateral"
                    inputValue={inputValue}
                    onChange={onUserInput}
                  />

                  {inputValue && marginTokenPriceInUSD && (
                    <div className="flex items-center justify-between mt-1">
                      <div
                        className={`text-xs tracking-thin text-marginalGray-400 uppercase md:text-sm`}
                      >
                        {formatUSDCurrency(
                          marginTokenPriceInUSD * parseFloat(inputValue),
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end justify-center">
                  {marginToken ? (
                    <>
                      <div className="flex items-center space-x-1 text-xl tracking-thin font-bold mb-1.5">
                        <TokenSelected
                          selectedToken={marginToken}
                          useGasToken={displayGasToken}
                          chainId={chainId}
                        />
                        {address && !isLong && (
                          <>
                            <UseGasTokenDropdown
                              useGas={useGasToken}
                              setUseGas={setUseGasToken}
                              chainId={chainId}
                            />
                          </>
                        )}
                      </div>
                      {showMarginTokenBalance &&
                        (displayGasToken ? (
                          <div className="flex space-x-2 text-sm font-bold uppercase tracking-thin">
                            <div className="text-marginalGray-600 whitespace-nowrap">
                              Balance: {shortenedParsedGasBalance}
                            </div>
                            <div
                              className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                              onClick={() => {
                                calculateMaxBalanceInput(
                                  gasBalance,
                                  poolLeverageMax,
                                  marginToken,
                                )
                              }}
                            >
                              Max
                            </div>
                          </div>
                        ) : (
                          <div className="flex space-x-2 text-xs font-bold uppercase tracking-thin md:text-sm">
                            <div className="text-marginalGray-600 whitespace-nowrap">
                              Balance: {shortenedParsedMarginTokenBalance}
                            </div>
                            <div
                              className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                              onClick={() => {
                                onUserInput(
                                  calculateMaxBalanceInput(
                                    marginTokenBalance,
                                    poolLeverageMax,
                                    marginToken,
                                  ),
                                )
                              }}
                            >
                              Max
                            </div>
                          </div>
                        ))}
                    </>
                  ) : null}
                </div>
              </InputContainer>
              <div className="relative -my-[26px] md:-my-6 mx-auto flex justify-center items-end">
                <DownArrowIcon />
              </div>
            </div>

            <InputContainer id="trade-output-container" secondaryColor={true}>
              <div className="flex flex-col w-full">
                <TradeOutput
                  title={`Size ${marginToken?.symbol ? `(in ${marginToken.symbol})` : ""}`}
                  outputValue={quotedTotalSizeFormatted ? quotedTotalSizeFormatted : "0"}
                  secondaryColor={true}
                />

                {quotedTotalSizeFormatted && marginTokenPriceInUSD && (
                  <div className="flex items-center justify-between mt-1">
                    <div
                      className={`text-xs tracking-thin text-marginalGray-400 uppercase md:text-sm`}
                    >
                      {formatUSDCurrency(
                        marginTokenPriceInUSD * parseFloat(quotedTotalSizeFormatted),
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
                    {quotedDebtFormatted && (
                      <div className="flex items-center space-x-1 text-xs font-bold uppercase tracking-thin text-marginalGray-400 md:text-sm">
                        <div>debt: </div>
                        <div>{quotedDebtFormatted}</div>
                        <TokenAsset token={debtToken} className="!w-4 !h-4" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </InputContainer>

            <LeverageSlider
              selectedLeverage={leverage}
              maxLeverage={poolLeverageMax}
              onSelect={onSelectLeverage}
              healthFactor={healthFactor}
            />
          </div>

          <div className="px-2 pb-2 md:px-4 md:pb-4">
            <ConfirmTradeButton
              chainId={chainId}
              marginToken={marginToken}
              isInputValid={isInputValid}
              isTokensValid={isMarginTokenValid && isDebtTokenValid}
              isApproved={isApproved}
              isBalanceSufficient={isBalanceSufficient}
              isPendingWallet={isPendingWallet}
              isPendingApprove={isPendingApprove}
              onApprove={() =>
                approveToken(
                  formattedInput,
                  V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
                  marginToken?.address as Address,
                )
              }
              onConfirm={handleOpenConfirmModal}
              mintQuote={mintQuote}
              mintCallback={handleMintCallback}
              error={
                mintQuoteError || isMarginUnsafeError || isSlippageMoreThanToleranceError
              }
            />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[405px] sm:max-w-[520px] mb-[96px] md:mb-0 mt-4 px-0 md:px-4">
          <TradeDetailList
            pool={selectedPool}
            token0={token0}
            token1={token1}
            marginToken={marginToken}
            debtToken={debtToken}
            poolMaxLeverage={poolLeverageMax}
            quotedDebt={quotedDebtFormatted}
            fundingRate={fundingRateFormatted}
            liquidationPrice={formatNumberAmount(liquidationPrice, true)}
            oraclePrice={formatNumberAmount(oraclePrice, true)}
            poolPrice={formatNumberAmount(poolPrice, true)}
            relativeSqrtPriceDiff={relativeSqrtPriceDiff}
            priceImpact={priceImpact?.toFixed(2)}
            maxSlippage={maxSlippage}
            escrowRewards={formatNumberAmount(mintEscrowRewardsWithBuffer, true)}
            isPriceImpactModerate={isPriceImpactModerate}
            isPriceImpactSevere={isPriceImpactSevere}
            healthFactor={healthFactor}
            useInverse={useInverse}
            onToggleInverse={onToggleInverse}
          />
        </div>
      </div>
      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        {showConfirm && (
          <ConfirmTradeModal
            chainId={chainId}
            pool={selectedPool}
            leverageMax={poolLeverageMax}
            useGas={displayGasToken}
            gasToken={GAS_TOKEN}
            token0={token0}
            token1={token1}
            open={showConfirm}
            onOpen={handleOpenConfirmModal}
            onClose={handleCloseConfirmModal}
            onReset={onSuccessReset}
            quotedMargin={quotedMarginFormatted}
            quotedDebt={quotedDebtFormatted}
            quotedSize={quotedTotalSizeFormatted}
            quotedFees={quotedFeesFormatted}
            marginToken={marginToken}
            debtToken={debtToken}
            leverage={leverage}
            mintQuote={mintQuote}
            mintCallback={handleMintCallback}
            isPendingWallet={isPendingWallet}
            isPendingApprove={isPendingApprove}
            isPendingTx={isPendingTx}
            isTxSubmitted={isTxSubmitted}
            txHash={txHash}
            txError={txError}
            fundingRate={fundingRateFormatted}
            liquidationPrice={formatNumberAmount(liquidationPrice, true)}
            oraclePrice={formatNumberAmount(oraclePrice, true)}
            poolPrice={formatNumberAmount(poolPrice, true)}
            priceImpact={priceImpact?.toFixed(2)}
            isPriceImpactModerate={isPriceImpactModerate}
            isPriceImpactSevere={isPriceImpactSevere}
            healthFactor={healthFactor}
            escrowRewards={mintEscrowRewardsWithBuffer}
            useInverse={useInverse}
            onToggleInverse={onToggleInverse}
          />
        )}
      </AnimatePresence>
    </>
  )
}

export default Trade

const calculateMaxBalanceInput = (
  tokenBalance: bigint | undefined,
  poolLeverageMax: number | undefined,
  marginToken: Token | null,
): string => {
  if (isUndefined(tokenBalance)) return ""

  const maxSize =
    !isUndefined(tokenBalance) && !isUndefined(poolLeverageMax)
      ? JSBI.multiply(
          JSBI.BigInt(tokenBalance.toString()),
          JSBI.BigInt(poolLeverageMax.toString()),
        )
      : undefined

  const scaledFee = 1000 * 0.001

  const maxSizeMultipliedByQuotedFees = !isUndefined(maxSize)
    ? JSBI.multiply(JSBI.BigInt(maxSize.toString()), JSBI.BigInt(scaledFee.toString()))
    : undefined

  const difference =
    !isUndefined(tokenBalance) && !isUndefined(maxSizeMultipliedByQuotedFees)
      ? JSBI.subtract(
          JSBI.BigInt(maxSizeMultipliedByQuotedFees.toString()),
          JSBI.BigInt(tokenBalance.toString()),
        )
      : undefined

  const unscaledDifference =
    !isUndefined(difference) && !isUndefined(maxSizeMultipliedByQuotedFees)
      ? JSBI.divide(JSBI.BigInt(difference.toString()), JSBI.BigInt((1000).toString()))
      : undefined

  const maxCollateralForUser =
    !isUndefined(tokenBalance) && !isUndefined(unscaledDifference)
      ? JSBI.subtract(
          JSBI.BigInt(tokenBalance.toString()),
          JSBI.BigInt(unscaledDifference.toString()),
        )
      : undefined

  if (!isUndefined(maxCollateralForUser)) {
    const formattedMaxBalance = formatBigIntToString(
      BigInt(maxCollateralForUser.toString()),
      marginToken?.decimals,
    )

    return !isUndefined(formattedMaxBalance) ? formattedMaxBalance : ""
  }
  return ""
}

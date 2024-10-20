import _ from "lodash"
import { useMemo, useEffect, useState } from "react"
import { useAccount, Address, useNetwork } from "wagmi"
import { useParams } from "react-router-dom"
import { usePoolsData, getPoolAddress, getPoolDataByAddress } from "../hooks/usePoolsData"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { InputContainer } from "../components/Containers/InputContainer"
import { V1_ROUTER_ADDRESS, V1_QUOTER_ADDRESS } from "../constants/addresses"
import { useRemoveLiquidityState } from "../state/removeLiquidity/hooks"
import { maxUint256 } from "viem"
import { useErc20TokenBalances } from "../hooks/useErc20TokenBalances"
import { Token } from "../types"
import { RemoveLiquidityInput } from "../components/RemoveLiquidity/RemoveLiquidityInput"
import {
  useRemoveLiquidityActionHandlers,
  useRemoveLiquidityStatus,
} from "../state/removeLiquidity/hooks"
import { constructRemoveLiquidityParams } from "../functions/constructRemoveLiquidityParams"
import { useRemoveLiquidityCallback } from "../hooks/useRemoveLiquidityCallback"
import { useViewQuoteRemoveLiquidity } from "../hooks/useViewQuoteRemoveLiquidity"
import { approveErc20Token } from "../functions/approveErc20Token"
import { waitForTransaction } from "@wagmi/core"
import { useErc20TokenAllowance } from "../functions/getErc20TokenAllowance"
import { isTransactionReceiptError } from "../utils/isTransactionReceiptError"
import { TransactionReceipt } from "viem"
import { getTransactionError } from "../utils/getTransactionError"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"
import { isBlank } from "../utils/isBlank"
import { trimTrailingZeroes } from "../utils/trimTrailingZeroes"
import { RemoveLiquidityDetailList } from "../components/RemoveLiquidity/RemoveLiquidityDetailList"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { ConfirmRemoveLiquidityButton } from "../components/RemoveLiquidity/ConfirmRemoveLiquidityButton"
import { AnimatePresence } from "framer-motion"
import { ConfirmRemoveLiquidityModal } from "../components/RemoveLiquidity/ConfirmRemoveLiquidityModal"
import { useErc20TokenSymbol } from "../hooks/useErc20TokenSymbol"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { useSettingsToggle } from "src/hooks/useSettingsToggle"
import { useSettingsState } from "src/state/settings/hooks"
import { SlippageButton } from "src/components/Settings/SlippageButton"
import { PercentageSlider } from "src/components/Position/PercentageSlider"
import { deriveRemoveLiquidityParamsWithSlippage } from "../functions/deriveRemoveLiquidityParamsWithSlippage"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { usePoolTotalSupply } from "src/hooks/usePoolTotalSupply"
import bigDecimal from "js-big-decimal"
import { usePoolLiquidityLocked } from "src/hooks/usePoolLiquidityLocked"
import { useViewPoolsState } from "src/hooks/useViewPoolsState"
import { DEFAULT_CHAIN_ID } from "src/constants/chains"
import { useApplicationState } from "src/state/application/hooks"
import { PositionWrapper } from "src/components/Position/PositionWrapper"
import { DoubleCurrencyLogo } from "./Pools"
import { CaretLeftIcon } from "src/components/Icons/CaretLeftIcon"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"
import { useNetworkChangeRedirect } from "src/hooks/useNetworkChangeRedirect"

const RemoveLiquidity = () => {
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const { poolAddress: poolAddressKey } = useParams()
  const { poolsDataByAddress } = usePoolsData()
  const { tokenA, tokenB, inputValue } = useRemoveLiquidityState()
  const { onUserInput, onSelectTokenA, onSelectTokenB } =
    useRemoveLiquidityActionHandlers()
  const { showSettings, onOpenSettings, onCloseSettings } = useSettingsToggle()
  const { maxSlippage, transactionDeadline } = useSettingsState()
  const { isTokensValid, isInputValid, isRemoveLiquidityInputsValid } =
    useRemoveLiquidityStatus()

  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)

  const { onNavigateToPools, onNavigateToPool } = useNavigateRoutes()

  useNetworkChangeRedirect(onNavigateToPools)

  const poolAddress = getPoolAddress(poolAddressKey)
  const lpTokenSymbol = useErc20TokenSymbol(poolAddress as Address)
  const poolData = getPoolDataByAddress(poolAddress, poolsDataByAddress)
  const [percentage, setPercentage] = useState<number>(0)
  const [percentError, setPercentError] = useState(false)

  const poolState = useViewPoolsState(poolAddress)
  const poolLiquidityLockedData = usePoolLiquidityLocked([poolData])

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

  const poolSupplyTotal = usePoolTotalSupply([poolData])?.[0]
  const userOwnedPoolSharePercentage = !isBlank(inputValue)
    ? calculatePercentageOfTotal(
        poolSupplyTotal?.parsedTotalSupply,
        String(Number(inputValue).toFixed(4)),
      )
    : 0

  const {
    token0: poolToken0,
    token1: poolToken1,
    oracleAddress,
    maintenance,
    decimals: lpTokenDecimals,
  } = poolData || {}

  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(poolToken0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(poolToken1, defaultTokensList)

  useEffect(() => {
    if (token0 && tokenA !== token0) {
      onSelectTokenA(token0)
    }
    if (token1 && tokenB !== token1) {
      onSelectTokenB(token1)
    }
  }, [token0, token1, tokenA, tokenB])

  /** TODO: Update subgraphs to include Pool Token */
  const poolLpToken = {
    address: poolAddress,
    name: "Marginal V1 LP Token",
    symbol: lpTokenSymbol,
    decimals: Number(lpTokenDecimals),
  }

  const formattedInput = !isBlank(inputValue)
    ? formatStringToBigInt(inputValue, lpTokenDecimals)
    : 0n

  const {
    allowance: lpTokenAllowance,
    parsedAllowance: parsedLpTokenAllowance,
    fetchAllowance,
  } = useErc20TokenAllowance(
    poolAddress as Address,
    Number(lpTokenDecimals),
    address,
    V1_ROUTER_ADDRESS[chainId],
    chainId,
  )

  useEffect(() => {
    if (chainId && poolAddress && address) {
      ;(async () => {
        await fetchAllowance()
      })()
    }
  }, [chainId, poolAddress, address, fetchAllowance])

  const isLpTokenApproved = useMemo(() => {
    if (_.isUndefined(parsedLpTokenAllowance)) return false
    return parseFloat(inputValue) <= parseFloat(parsedLpTokenAllowance)
  }, [parsedLpTokenAllowance, inputValue])

  const { balances: tokenBalances, refetch: fetchTokenBalances } = useErc20TokenBalances(
    [poolLpToken as Token],
    address,
  )

  const {
    balance: lpTokenBalance,
    parsedBalance: parsedLpTokenBalance,
    shortenedParsedBalance: shortenedParsedLpTokenBalance,
  } = tokenBalances?.[0] || {}

  const showBalance = useMemo(() => {
    if (!address || !poolAddress) return false
    return true
  }, [address, poolAddress])

  const removeLiquidityParams = constructRemoveLiquidityParams(
    inputValue,
    tokenA,
    tokenB,
    lpTokenDecimals,
    maintenance,
    oracleAddress,
    address as string,
    currentBlockTimestamp,
    transactionDeadline,
  )

  const [removeLiquidityQuote, removeLiquidityError] = useViewQuoteRemoveLiquidity(
    V1_QUOTER_ADDRESS[chainId],
    removeLiquidityParams,
  )

  const derivedRemoveLiquidityParamsWithSlippage =
    deriveRemoveLiquidityParamsWithSlippage(
      removeLiquidityParams,
      removeLiquidityQuote,
      maxSlippage,
    )

  const { removeLiquidityCallback } = useRemoveLiquidityCallback(
    inputValue,
    derivedRemoveLiquidityParamsWithSlippage,
    isLpTokenApproved,
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
    onUserInput("")
    setPercentage(0)
    onNavigateToPool(poolAddress)
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
      console.error(error)
      if (isTransactionReceiptError(error)) {
        await fetchAllowance()
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
          txError: getTransactionError(error, "approve"),
        }))
      }
    }
  }

  const handleRemoveLiquidityCallback = async () => {
    try {
      if (!removeLiquidityCallback) {
        return new Error("Missing remove liquidity callback")
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

      const transaction = await removeLiquidityCallback()

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

      await fetchTokenBalances()
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
          showConfirm: false,
          isPendingWallet: false,
          isPendingApprove: false,
          isPendingTx: false,
        }))
      } else {
        setTransactionState((prevState) => ({
          ...prevState,
          txError: getTransactionError(error, "handleRemoveLiquidityCallback"),
        }))
      }
    }
  }

  const quotedToken0Amount = removeLiquidityQuote?.amount0
  const quotedToken0AmountParsed =
    quotedToken0Amount &&
    formatBigIntToString(BigInt(quotedToken0Amount?.toString()), token0?.decimals)
  const quotedToken0AmountFormatted = formatNumberAmount(quotedToken0AmountParsed, true)

  const quotedToken1Amount = removeLiquidityQuote?.amount1
  const quotedToken1AmountParsed =
    quotedToken1Amount &&
    formatBigIntToString(BigInt(quotedToken1Amount?.toString()), token1?.decimals)
  const quotedToken1AmountFormatted = formatNumberAmount(quotedToken1AmountParsed, true)

  return (
    <PositionWrapper>
      <div className="flex justify-between">
        <div
          onClick={() => {
            setPercentage(0)
            onUserInput("")
            onNavigateToPool(poolAddress)
          }}
          className="flex items-center justify-start space-x-1 cursor-pointer text-marginalGray-200"
        >
          <CaretLeftIcon />
          <span className="text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
            Back to Pool
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[343px] sm:max-w-[440px] shadow-outerBlack">
        <div className="border bg-marginalGray-900 border-marginalGray-800 rounded-t-3xl ">
          <div className="flex items-center justify-between p-4">
            <div className="relative text-lg font-bold leading-5 uppercase md:text-xl md:leading-6 tracking-thin text-marginalGray-200">
              Remove Liquidity
            </div>
            <SlippageButton
              maxSlippage={maxSlippage}
              showSettings={showSettings}
              showSlippageHeader={false}
              onClose={onCloseSettings}
              onOpen={onOpenSettings}
            />
          </div>

          <div className="px-4 pt-0 pb-4">
            <div className="p-4 border bg-marginalGray-950 border-marginalGray-800 rounded-xl">
              <div className="flex items-center space-x-2">
                <DoubleCurrencyLogo token0={token0} token1={token1} size={8} />

                <div className="flex flex-col overflow-x-hidden">
                  <div className="flex items-center space-x-1 text-lg font-bold leading-5 uppercase tracking-thin text-marginalGray-200">
                    <pre>{token0?.symbol}</pre>
                    <div className="my-auto">/</div>
                    <pre>{token1?.symbol}</pre>
                  </div>

                  <div className="flex items-center text-xs font-bold leading-4 uppercase flex-nowrap md:text-sm tracking-thin text-marginalGray-600">
                    <pre>{token0?.name}</pre>

                    <div className="px-0.5 my-auto">∙</div>
                    <pre>{token1?.name}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="p-4 space-y-2 border border-t-0 bg-marginalGray-900 border-marginalGray-800 rounded-b-3xl">
            <InputContainer id="remove-liquidity-input-container">
              <RemoveLiquidityInput
                setPercentage={setPercentage}
                inputValue={inputValue}
                totalLiquidity={parsedLpTokenBalance}
                onChange={onUserInput}
                setPercentError={setPercentError}
              />
              <div className="flex flex-col items-end">
                <div className="text-white">{lpTokenSymbol}</div>

                <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                  <div className="text-marginalGray-600 whitespace-nowrap">
                    Balance: {trimTrailingZeroes(shortenedParsedLpTokenBalance)}
                  </div>
                  <div
                    className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                    onClick={() => {
                      if (Number(parsedLpTokenBalance) > 0) {
                        onUserInput(parsedLpTokenBalance ? parsedLpTokenBalance : "")
                        setPercentage(100)
                      }
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
              formattedBalance={parsedLpTokenBalance}
              margin={lpTokenBalance}
              decimals={Number(lpTokenDecimals)}
              onUserInput={onUserInput}
              selectedPercentage={percentage}
              setPercentage={setPercentage}
              setPercentError={setPercentError}
              percentError={percentError}
            />

            <RemoveLiquidityDetailList
              token0={token0}
              token1={token1}
              quotedToken0Amount={quotedToken0AmountFormatted}
              quotedToken1Amount={quotedToken1AmountFormatted}
              poolUtilizationPercentage={parseFloat(poolUtilizationPercentage)}
              userOwnedPoolSharePercentage={userOwnedPoolSharePercentage}
            />

            <ConfirmRemoveLiquidityButton
              chainId={chainId}
              isInputValid={isInputValid}
              isTokensValid={isTokensValid}
              isTokenApproved={isLpTokenApproved}
              isPendingWallet={isPendingWallet}
              isPendingApprove={isPendingApprove}
              onApprove={() =>
                approveToken(
                  formattedInput,
                  V1_ROUTER_ADDRESS[chainId],
                  poolAddress as Address,
                )
              }
              tokenA={tokenA}
              tokenB={tokenB}
              onConfirm={handleOpenConfirmModal}
              removeLiquidityCallback={handleRemoveLiquidityCallback}
              error={removeLiquidityError}
              disabled={Number(parsedLpTokenBalance) === 0}
            />
          </div>
        </div>

        <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
          {showConfirm && (
            <ConfirmRemoveLiquidityModal
              chainId={chainId}
              open={showConfirm}
              onOpen={handleOpenConfirmModal}
              onClose={handleCloseConfirmModal}
              onReset={onSuccessReset}
              quotedAmount0={quotedToken0AmountFormatted}
              quotedAmount1={quotedToken1Amount}
              token0={tokenA}
              token1={tokenB}
              removeLiquidityQuote={removeLiquidityQuote}
              removeLiquidityCallback={handleRemoveLiquidityCallback}
              isPendingWallet={isPendingWallet}
              isPendingApprove={isPendingApprove}
              isPendingTx={isPendingTx}
              isTxSubmitted={isTxSubmitted}
              txHash={txHash}
              txError={removeLiquidityError}
            />
          )}
        </AnimatePresence>
      </div>
    </PositionWrapper>
  )
}

export default RemoveLiquidity

function calculatePercentageOfTotal(
  totalAmount: string | null | undefined,
  partialAmount: string | null | undefined,
) {
  if (!totalAmount || !partialAmount) {
    return 0
  }

  const total = parseFloat(totalAmount)
  const available = parseFloat(partialAmount)

  if (isNaN(total) || isNaN(available) || total === 0) {
    return 0
  }

  return (available / total) * 100
}

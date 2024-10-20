import _, { isString } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { Address } from "viem"
import { useParams } from "react-router-dom"
import { InputContainer } from "../components/Containers/InputContainer"
import { AddLiquidityInput } from "../components/AddLiquidity/AddLiquidityInput"
import { useAddLiquidityState } from "../state/addLiquidity/hooks"
import { useAddLiquidityActionHandlers } from "../state/addLiquidity/hooks"
import { TokenSelected } from "../components/Token/TokenSelected"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { usePoolsData, getPoolAddress, getPoolDataByAddress } from "../hooks/usePoolsData"
import { isBlank } from "../utils/isBlank"
import { formatStringToBigInt } from "../utils/formatStringToBigInt"
import { useViewQuoteAddLiquidity } from "../hooks/useViewQuoteAddLiquidity"
import { constructAddLiquidityParams } from "../functions/constructAddLiquidityParams"
import { useAccount } from "wagmi"
import { V1_QUOTER_ADDRESS } from "../constants/addresses"
import { useViewPoolsState } from "../hooks/useViewPoolsState"
import { PoolState } from "src/types"
import { ListRow } from "../components/List/ListRow"
import { useAddLiquidityCallback } from "../hooks/useAddLiquidityCallback"
import { useErc20TokenBalances } from "../hooks/useErc20TokenBalances"
import { convertMaintenanceToLeverage } from "../functions/convertMaintenanceToLeverage"
import { ConfirmAddLiquidityButton } from "../components/AddLiquidity/ConfirmAddLiquidityButton"
import { useAddLiquidityStatus } from "../state/addLiquidity/hooks"
import { V1_ROUTER_ADDRESS } from "../constants/addresses"
import { maxUint256 } from "viem"
import { waitForTransaction } from "@wagmi/core"
import { getTransactionError } from "../utils/getTransactionError"
import { useErc20TokenAllowance } from "../functions/getErc20TokenAllowance"
import { approveErc20Token } from "../functions/approveErc20Token"
import { TransactionReceipt } from "viem"
import { isTransactionReceiptError } from "../utils/isTransactionReceiptError"
import { formatBigIntToString } from "../utils/formatBigIntToString"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import { deriveAddLiquidityInputsFromSingleInput } from "../functions/deriveAddLiquidityInputsFromSingleInput"
import { formatNumberAmount } from "../utils/formatNumberAmount"
import { DoubleCurrencyLogo } from "./Pools"
import { useDefaultActiveTokens } from "../hooks/Tokens"
import { useDefaultTokenWhenPossible } from "../hooks/useDefaultTokenWhenPossible"
import { useErc20TokenSymbol } from "../hooks/useErc20TokenSymbol"
import { ConfirmTransactionModal } from "../components/Modals/ConfirmTransactionModal"
import { DEFAULT_CHAIN_ID } from "../constants/chains"
import { useSettingsToggle } from "src/hooks/useSettingsToggle"
import { useSettingsState } from "src/state/settings/hooks"
import { SlippageButton } from "src/components/Settings/SlippageButton"
import { AssetPairPriceRatio } from "src/components/Trade/TradeDetailList"
import { useOraclePoolPrices } from "src/hooks/useOraclePoolPrices"
import { deriveAddLiquidityParamsWithSlippage } from "../functions/deriveAddLiquidityParamsWithSlippage"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { useUserPoolBalance } from "src/hooks/useUserPoolBalance"
import { useApplicationState } from "src/state/application/hooks"
import { calculateInversablePrices } from "src/functions/calculateInversablePrices"
import { useInversePrice } from "../hooks/useInversePrice"
import { PositionWrapper } from "src/components/Position/PositionWrapper"
import { CaretLeftIcon } from "src/components/Icons/CaretLeftIcon"
import { AnimatePresence } from "framer-motion"
import { TokenInfo } from "@uniswap/token-lists"
import { createTokenList } from "src/functions/createTokenList"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"
import { useNativeTokenBalance } from "src/hooks/useNativeTokenBalance"
import { UseGasTokenDropdown } from "src/components/UseGasTokenDropdown"
import { useNetworkChangeRedirect } from "src/hooks/useNetworkChangeRedirect"

const AddLiquidity = () => {
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const { poolAddress: poolAddressKey } = useParams()
  const { pools, poolsDataByAddress } = usePoolsData()
  const { tokenA, tokenB, inputValueA, inputValueB } = useAddLiquidityState()
  const {
    onUserInputA,
    onUserInputB,
    onSelectTokenA,
    onSelectTokenB,
    onResetAddLiquidityInput,
  } = useAddLiquidityActionHandlers()
  const { showSettings, onOpenSettings, onCloseSettings } = useSettingsToggle()
  const { maxSlippage, transactionDeadline } = useSettingsState()
  const { isValidInputs, isValidTokens, isValidAddLiquidityInputs } =
    useAddLiquidityStatus()
  const [useInverse, onToggleInverse] = useInversePrice()

  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)

  const { onNavigateToPool, onNavigateToPools } = useNavigateRoutes()
  const handleReturnToPool = (poolAddress: string) => onNavigateToPool(poolAddress)

  useNetworkChangeRedirect(onNavigateToPools)

  const { balances: userPoolBalances, refetch: fetchUserPoolBalance } =
    useUserPoolBalance(pools, address)

  const poolAddress = getPoolAddress(poolAddressKey)
  const poolData = getPoolDataByAddress(poolAddress, poolsDataByAddress)
  const lpTokenSymbol = useErc20TokenSymbol(poolAddress as Address)

  const poolState: PoolState = useViewPoolsState(poolAddress)

  const {
    token0: poolToken0,
    token1: poolToken1,
    oracleAddress,
    maintenance,
    decimals: poolDecimals,
  } = poolData || {}
  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(poolToken0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(poolToken1, defaultTokensList)

  const [useGasToken, setUseGasToken] = useState<boolean>(true)
  const isTokenAWrappedGasToken = isWrappedGasToken(tokenA, chainId)
  const isTokenBWrappedGasToken = isWrappedGasToken(tokenB, chainId)

  const inputValueGas = useGasToken
    ? (isTokenAWrappedGasToken && inputValueA) ||
      (isTokenBWrappedGasToken && inputValueB) ||
      undefined
    : undefined

  const leverageMax = maintenance && convertMaintenanceToLeverage(maintenance)

  const { sqrtPriceX96 } = useOraclePoolPrices(
    chainId,
    poolData?.token0?.address as Address,
    poolData?.token1?.address as Address,
    poolData?.maintenance,
    poolData?.oracleAddress as Address,
  )

  const { poolPrice } = calculateInversablePrices(
    useInverse,
    undefined,
    sqrtPriceX96,
    undefined,
    poolToken0,
    poolToken1,
  )

  const {
    allowance: tokenAAllowance,
    parsedAllowance: parsedTokenAAllowance,
    fetchAllowance: fetchTokenAAllowance,
  } = useErc20TokenAllowance(
    tokenA?.address as Address,
    Number(tokenA?.decimals),
    address,
    V1_ROUTER_ADDRESS[chainId],
    chainId,
  )

  const {
    allowance: tokenBAllowance,
    parsedAllowance: parsedTokenBAllowance,
    fetchAllowance: fetchTokenBAllowance,
  } = useErc20TokenAllowance(
    tokenB?.address as Address,
    Number(tokenB?.decimals),
    address,
    V1_ROUTER_ADDRESS[chainId],
    chainId,
  )

  const fetchTokenAllowances = async () => {
    await fetchTokenAAllowance()
    await fetchTokenBAllowance()
  }

  useEffect(() => {
    if (chainId && tokenA && tokenB && address) {
      ;(async () => {
        await fetchTokenAllowances()
      })()
    }
  }, [chainId, tokenA, tokenB, address, fetchTokenAAllowance, fetchTokenBAllowance])

  const isTokenAApproved = useMemo(() => {
    if (useGasToken && isTokenAWrappedGasToken) return true
    if (_.isUndefined(parsedTokenAAllowance)) return false

    return parseFloat(inputValueA) <= parseFloat(parsedTokenAAllowance)
  }, [parsedTokenAAllowance, inputValueA, useGasToken, isTokenAWrappedGasToken])

  const isTokenBApproved = useMemo(() => {
    if (useGasToken && isTokenBWrappedGasToken) return true
    if (_.isUndefined(parsedTokenBAllowance)) return false

    return parseFloat(inputValueB) <= parseFloat(parsedTokenBAllowance)
  }, [parsedTokenBAllowance, inputValueB, useGasToken, isTokenBWrappedGasToken])

  const {
    balance: gasBalance,
    parsedBalance: parsedGasBalance,
    shortenedParsedBalance: shortenedParsedGasBalance,
  } = useNativeTokenBalance(address, chainId)

  const { balances: tokenBalances, refetch: fetchTokenBalances } = useErc20TokenBalances(
    [token0, token1],
    address,
  )

  const {
    balance: tokenABalance,
    shortenedParsedBalance: shortenedParsedTokenABalance,
    parsedBalance: parsedTokenABalance,
  } = _.find(tokenBalances, { token: tokenA }) || {}

  const {
    balance: tokenBBalance,
    shortenedParsedBalance: shortenedParsedTokenBBalance,
    parsedBalance: parsedTokenBBalance,
  } = _.find(tokenBalances, { token: tokenB }) || {}

  const isBalanceSufficient = useMemo(() => {
    if (!parsedTokenABalance || !parsedTokenBBalance || !parsedGasBalance) return true

    const parsedA = parseFloat(inputValueA || "0")
    const parsedB = parseFloat(inputValueB || "0")

    if (useGasToken && (isTokenAWrappedGasToken || isTokenBWrappedGasToken)) {
      if (isTokenAWrappedGasToken) {
        return (
          parsedA <= parseFloat(parsedGasBalance) &&
          parsedB <= parseFloat(parsedTokenBBalance)
        )
      } else {
        return (
          parsedA <= parseFloat(parsedTokenABalance) &&
          parsedB <= parseFloat(parsedGasBalance)
        )
      }
    } else {
      return (
        parsedA <= parseFloat(parsedTokenABalance) &&
        parsedB <= parseFloat(parsedTokenBBalance)
      )
    }
  }, [
    inputValueA,
    inputValueB,
    parsedTokenABalance,
    parsedTokenBBalance,
    parsedGasBalance,
    isTokenAWrappedGasToken,
    isTokenBWrappedGasToken,
    useGasToken,
  ])

  useEffect(() => {
    if (token0 && tokenA !== token0) {
      onSelectTokenA(token0)
    }
    if (token1 && tokenB !== token1) {
      onSelectTokenB(token1)
    }
  }, [token0, token1, tokenA, tokenB])

  const formattedInputA = !isBlank(inputValueA)
    ? formatStringToBigInt(inputValueA, tokenA?.decimals)
    : 0n

  const formattedInputB = !isBlank(inputValueB)
    ? formatStringToBigInt(inputValueB, tokenB?.decimals)
    : 0n

  const addLiquidityParams = constructAddLiquidityParams(
    inputValueA,
    inputValueB,
    tokenA,
    tokenB,
    maintenance,
    oracleAddress,
    address as string,
    currentBlockTimestamp,
    transactionDeadline,
  )

  const [addLiquidityQuote, addLiquidityError] = useViewQuoteAddLiquidity(
    V1_QUOTER_ADDRESS[chainId],
    addLiquidityParams,
  )

  const derivedAddLiquidityParamsWithSlippage = deriveAddLiquidityParamsWithSlippage(
    addLiquidityParams,
    addLiquidityQuote,
    maxSlippage,
  )

  const handleUserInputA = (value: string) => {
    onUserInputA(value)

    if (!tokenA || !tokenB || !poolState) return
    if (!isString(value)) return

    if (!isOnlyZeroes(value)) {
      const inputValueA_BI = formatStringToBigInt(value, tokenA?.decimals)

      const { amount0: derivedAmount0, amount1: derivedAmount1 } =
        deriveAddLiquidityInputsFromSingleInput(
          inputValueA_BI?.toString(),
          true,
          poolState?.sqrtPriceX96.toString(),
        )

      const derivedInputValueB = derivedAmount1
        ? formatBigIntToString(BigInt(derivedAmount1), tokenB?.decimals)
        : null

      onUserInputB(derivedInputValueB ?? "")
    } else if (isOnlyZeroes(value) && value.length === 0) {
      onUserInputA("")
      onUserInputB("")
    }
  }

  const handleUserInputB = (value: string) => {
    onUserInputB(value)

    if (!tokenA || !tokenB || !poolState) return
    if (!isString(value)) return

    if (!isOnlyZeroes(value)) {
      const inputValueB_BI = formatStringToBigInt(value, tokenB?.decimals)

      const { amount0: derivedAmount0, amount1: derivedAmount1 } =
        deriveAddLiquidityInputsFromSingleInput(
          inputValueB_BI?.toString(),
          false,
          poolState?.sqrtPriceX96.toString(),
        )

      const derivedInputValueA = derivedAmount0
        ? formatBigIntToString(BigInt(derivedAmount0), tokenA?.decimals)
        : null

      onUserInputA(derivedInputValueA ?? "")
    } else if (isOnlyZeroes(value) && value.length === 0) {
      onUserInputA("")
      onUserInputB("")
    }
  }

  const quotedToken0Amount = addLiquidityQuote?.amount0
  const quotedToken0AmountParsed =
    quotedToken0Amount &&
    formatBigIntToString(BigInt(quotedToken0Amount?.toString()), token0?.decimals)
  const quotedToken0AmountFormatted = formatNumberAmount(quotedToken0AmountParsed, true)

  const quotedToken1Amount = addLiquidityQuote?.amount1
  const quotedToken1AmountParsed =
    quotedToken1Amount &&
    formatBigIntToString(BigInt(quotedToken1Amount?.toString()), token1?.decimals)
  const quotedToken1AmountFormatted = formatNumberAmount(quotedToken1AmountParsed, true)

  const quotedShares = addLiquidityQuote?.shares
  const quotedSharesParsed =
    quotedShares &&
    poolDecimals &&
    formatBigIntToString(BigInt(quotedShares?.toString()), poolDecimals)
  const quotedSharesFormatted = formatNumberAmount(quotedSharesParsed, true)

  const { addLiquidityCallback, refetch: refetchAddLiquidityCallback } =
    useAddLiquidityCallback(
      inputValueA,
      inputValueB,
      inputValueGas,
      derivedAddLiquidityParamsWithSlippage,
      isTokenAApproved && isTokenBApproved,
      chainId,
    )

  const [
    {
      showConfirm,
      isPendingWallet,
      isPendingTx,
      isPendingApprove,
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
    onUserInputA("")
    onUserInputB("")
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
        showConfirm: true,
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
        showConfirm: true,
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
        showConfirm: true,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: true,
        txHash: receipt.transactionHash,
        txError: null,
      })

      fetchTokenAllowances()
      refetchAddLiquidityCallback()
    } catch (error) {
      console.error("Error approving token: ", error)
      setTransactionState({
        showConfirm: false,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: false,
        txHash: null,
        txError: null,
      })

      fetchTokenAllowances()
      refetchAddLiquidityCallback()
    }
  }

  const handleAddLiquidityCallback = async () => {
    let txHash = undefined
    try {
      if (!addLiquidityCallback) {
        return new Error("Missing addLiquidity callback")
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

      const transaction = await addLiquidityCallback()

      txHash = transaction.hash

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
      await fetchUserPoolBalance()

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
          txError: getTransactionError(error, "handleAddLiquidityCallback"),
        }))
      }
    }
  }

  useEffect(() => {
    return () => {
      onResetAddLiquidityInput()
    }
  }, [])

  return (
    <PositionWrapper>
      <div className="flex justify-between">
        <div
          onClick={() => handleReturnToPool(poolAddress)}
          className="flex items-center justify-start space-x-1 cursor-pointer text-marginalGray-200"
        >
          <CaretLeftIcon />
          <span className="text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
            Back to Pool
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[343px] sm:max-w-[440px] mt-12 shadow-outerBlack">
        <div className="border bg-marginalGray-900 border-marginalGray-800 rounded-t-3xl ">
          <div className="flex items-center justify-between p-4">
            <div className="relative text-lg font-bold leading-5 uppercase md:text-xl md:leading-6 tracking-thin text-marginalGray-200">
              Add Liquidity
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
                    <div className="ml-3">{leverageMax}x</div>
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
            <InputContainer id="add-liquidity-input-a-container">
              <AddLiquidityInput inputValue={inputValueA} onChange={handleUserInputA} />
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 text-xl tracking-thin font-bold mb-1.5">
                  <TokenSelected
                    selectedToken={token0}
                    useGasToken={isTokenAWrappedGasToken && useGasToken}
                    chainId={chainId}
                  />

                  {address && isTokenAWrappedGasToken && (
                    <>
                      <UseGasTokenDropdown
                        useGas={useGasToken}
                        setUseGas={setUseGasToken}
                        chainId={chainId}
                      />
                    </>
                  )}
                </div>

                {isTokenAWrappedGasToken && useGasToken ? (
                  <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                    <div className="text-marginalGray-600 whitespace-nowrap">
                      Balance: {shortenedParsedGasBalance}
                    </div>
                    <div
                      className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                      onClick={() =>
                        handleUserInputA(parsedGasBalance ? parsedGasBalance : "")
                      }
                    >
                      Max
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                    <div className="text-marginalGray-600 whitespace-nowrap">
                      Balance:{" "}
                      {shortenedParsedTokenABalance
                        ? parseFloat(shortenedParsedTokenABalance).toFixed(4).trim()
                        : "0.0"}
                    </div>
                    <div
                      className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                      onClick={() =>
                        handleUserInputA(parsedTokenABalance ? parsedTokenABalance : "")
                      }
                    >
                      Max
                    </div>
                  </div>
                )}
              </div>
            </InputContainer>

            <InputContainer id="add-liquidity-input-b-container">
              <AddLiquidityInput inputValue={inputValueB} onChange={handleUserInputB} />
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-1 text-xl tracking-thin font-bold mb-1.5">
                  <TokenSelected
                    selectedToken={token1}
                    useGasToken={isTokenBWrappedGasToken && useGasToken}
                    chainId={chainId}
                  />

                  {address && isTokenBWrappedGasToken && (
                    <>
                      <UseGasTokenDropdown
                        useGas={useGasToken}
                        setUseGas={setUseGasToken}
                        chainId={chainId}
                      />
                    </>
                  )}
                </div>

                {isTokenBWrappedGasToken && useGasToken ? (
                  <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                    <div className="text-marginalGray-600 whitespace-nowrap">
                      Balance: {shortenedParsedGasBalance}
                    </div>
                    <div
                      className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                      onClick={() =>
                        handleUserInputB(parsedGasBalance ? parsedGasBalance : "")
                      }
                    >
                      Max
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2 text-sm font-bold leading-4 uppercase tracking-thin">
                    <div className="text-marginalGray-600 whitespace-nowrap">
                      Balance:{" "}
                      {shortenedParsedTokenBBalance
                        ? parseFloat(shortenedParsedTokenBBalance).toFixed(4)
                        : "0.0"}
                    </div>
                    <div
                      className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                      onClick={() =>
                        handleUserInputB(parsedTokenBBalance ? parsedTokenBBalance : "")
                      }
                    >
                      Max
                    </div>
                  </div>
                )}
              </div>
            </InputContainer>

            <div className="py-2 space-y-2 text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-600">
              <ListRow
                item="Shares"
                value={
                  <pre className="text-marginalGray-200">
                    {quotedSharesFormatted ?? "-"} {lpTokenSymbol}
                  </pre>
                }
              />

              <ListRow
                item="Current Shares"
                value={
                  <pre className="text-marginalGray-200">
                    {userPoolBalances?.[0].parsedBalance ?? "-"} {lpTokenSymbol}
                  </pre>
                }
              />

              <ListRow
                item="Rate"
                value={
                  <AssetPairPriceRatio
                    token0={token0}
                    token1={token1}
                    price={formatNumberAmount(poolPrice, true)}
                    useInverse={useInverse}
                    onToggleInverse={onToggleInverse}
                  />
                }
              />
            </div>
            <ConfirmAddLiquidityButton
              chainId={chainId}
              isInputValid={isValidInputs}
              isTokensValid={isValidTokens}
              isTokenAApproved={isTokenAApproved}
              isTokenBApproved={isTokenBApproved}
              isPendingWallet={isPendingWallet}
              isPendingApprove={isPendingApprove}
              isBalanceSufficient={isBalanceSufficient}
              onApproveTokenA={() =>
                approveToken(
                  formattedInputA,
                  V1_ROUTER_ADDRESS[chainId],
                  tokenA?.address as Address,
                )
              }
              onApproveTokenB={() =>
                approveToken(
                  formattedInputB,
                  V1_ROUTER_ADDRESS[chainId],
                  tokenB?.address as Address,
                )
              }
              tokenA={tokenA}
              tokenB={tokenB}
              onConfirm={handleOpenConfirmModal}
              addLiquidityCallback={handleAddLiquidityCallback}
              error={null}
            />
          </div>
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait" onExitComplete={() => null}>
        <ConfirmTransactionModal
          chainId={chainId ?? DEFAULT_CHAIN_ID}
          open={showConfirm}
          onOpen={handleOpenConfirmModal}
          onClose={handleCloseConfirmModal}
          onReset={onSuccessReset}
          onCallback={handleAddLiquidityCallback}
          isPendingWallet={isPendingWallet}
          isPendingApprove={isPendingApprove}
          isPendingTx={isPendingTx}
          isTxSubmitted={isTxSubmitted}
          txHash={txHash}
          txError={txError}
          hasConfirmModal={false}
          onSuccessText="Transaction Success"
        />
      </AnimatePresence>
    </PositionWrapper>
  )
}

export default AddLiquidity

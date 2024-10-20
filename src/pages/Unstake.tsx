import _ from "lodash"
import { Address, maxUint256, TransactionReceipt } from "viem"
import { useLocation, useParams } from "react-router-dom"
import { InputContainer } from "../components/Containers/InputContainer"

import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { usePoolsData, getPoolAddress, getPoolDataByAddress } from "../hooks/usePoolsData"

import { useAccount } from "wagmi"

import { ListRow } from "../components/List/ListRow"

import { useErc20TokenSymbol } from "../hooks/useErc20TokenSymbol"

import { useApplicationState } from "src/state/application/hooks"
import { PositionWrapper } from "src/components/Position/PositionWrapper"
import { CaretLeftIcon } from "src/components/Icons/CaretLeftIcon"
import { AnimatePresence } from "framer-motion"

import { useNetworkChangeRedirect } from "src/hooks/useNetworkChangeRedirect"
import { StakeInput } from "src/components/Pools/StakeInput"
import { useDefaultActiveTokens } from "src/hooks/Tokens"
import { createTokenList } from "src/functions/createTokenList"
import { TokenInfo } from "@uniswap/token-lists"
import { useDefaultTokenWhenPossible } from "src/hooks/useDefaultTokenWhenPossible"
import { DoubleCurrencyLogo } from "./Pools"
import { convertMaintenanceToLeverage } from "src/functions/convertMaintenanceToLeverage"
import {
  useUnstakeActionHandlers,
  useUnstakeState,
  useUnstakeStatus,
} from "src/state/unstake/hook"
import { SetStateAction, useEffect, useMemo, useState } from "react"
import { isBlank } from "src/utils/isBlank"
import { formatStringToBigInt } from "src/utils/formatStringToBigInt"
import { useErc20TokenAllowance } from "src/functions/getErc20TokenAllowance"
import { isOnlyZeroes } from "src/utils/isOnlyZeroes"
import { useUserStakeBalance } from "src/hooks/useUserStakeBalance"
import { approveErc20Token } from "src/functions/approveErc20Token"
import { waitForTransaction } from "@wagmi/core"
import { isTransactionReceiptError } from "src/utils/isTransactionReceiptError"
import { getTransactionError } from "src/utils/getTransactionError"
import { DEFAULT_CHAIN_ID } from "src/constants/chains"
import { ConfirmTransactionModal } from "src/components/Modals/ConfirmTransactionModal"
import { useUnstakeCallback } from "src/hooks/useUnstakeCallback"
import { ConfirmUnstakeButton } from "src/components/Pools/ConfirmUnstakeButton"
import { trimTrailingZeroes } from "src/utils/trimTrailingZeroes"
import { useAPRQuotePercentageRate } from "src/hooks/useAPRQuotePercentageRate"
import { MARGINAL_DAO_TOKEN } from "src/constants/tokens"
import { calculateAPRQuotePercentageRate } from "src/functions/calculateAPRQuotePercentageRate"
import { PercentageSlider } from "src/components/Position/PercentageSlider"

const Unstake = () => {
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const { poolAddress: poolAddressKey } = useParams()
  const { pools, poolsDataByAddress } = usePoolsData()

  const { unstakePool, unstakeTokenAddress, inputValue } = useUnstakeState()
  const {
    onUserInput,
    onSelectUnstakePool,
    onSelectUnstakeTokenAddress,
    onResetUnstakeInput,
  } = useUnstakeActionHandlers()
  const { isInputValid, isTokenValid, isValidUnstakeInputs } = useUnstakeStatus()

  const location = useLocation()

  useEffect(() => {
    onUserInput("")
  }, [location])

  useEffect(() => {
    if (!unstakeTokenAddress || _.isUndefined(unstakePool)) {
      onSelectUnstakePool(pools[0])
      onSelectUnstakeTokenAddress(pools[0]?.poolAddress)
    }
  }, [unstakeTokenAddress])

  const { onNavigateToPool, onNavigateToPools } = useNavigateRoutes()
  const handleReturnToPool = (poolAddress: string) => onNavigateToPool(poolAddress)

  useNetworkChangeRedirect(onNavigateToPools)

  const poolAddress = getPoolAddress(poolAddressKey)
  const poolData = getPoolDataByAddress(poolAddress, poolsDataByAddress)
  const lpTokenSymbol = useErc20TokenSymbol(poolAddress as Address)

  const [percentage, setPercentage] = useState<number>(0)
  const [percentError, setPercentError] = useState(false)

  const {
    token0: poolToken0,
    token1: poolToken1,
    oracleAddress,
    maintenance,
    decimals: poolDecimals,
  } = poolData || {}

  const leverageMax = maintenance && convertMaintenanceToLeverage(maintenance)

  const formattedInput = !isBlank(inputValue)
    ? formatStringToBigInt(inputValue, poolDecimals)
    : 0n

  const { allowance, parsedAllowance, fetchAllowance } = useErc20TokenAllowance(
    unstakeTokenAddress as Address,
    Number(unstakePool?.decimals),
    address,
    unstakePool?.stakePool as Address,
    chainId,
  )

  useEffect(() => {
    if (chainId && unstakeTokenAddress && address) {
      if (!isOnlyZeroes(inputValue)) {
        ;(async () => {
          await fetchAllowance()
        })()
      }
    }
  }, [chainId, unstakeTokenAddress, address, fetchAllowance, inputValue])

  const { balances: userStakeBalances, refetch: fetchStakeTokenBalance } =
    useUserStakeBalance(unstakePool, address)

  const {
    balance: userStakeBalance,
    parsedBalance: parsedUserStakeBalance,
    fullParsedBalance: fullParsedUserStakeBalance,
  } = _.find(userStakeBalances, { stakePoolAddress: unstakePool?.stakePool }) || {}

  const defaultTokens = useDefaultActiveTokens(chainId)
  const defaultTokensList: TokenInfo[] = createTokenList(defaultTokens)
  const token0 = useDefaultTokenWhenPossible(poolToken0, defaultTokensList)
  const token1 = useDefaultTokenWhenPossible(poolToken1, defaultTokensList)

  const durationOneYearInSeconds = 86400 * 365

  const rawAPRQuotePercentageRate = useAPRQuotePercentageRate(
    poolAddress as Address,
    MARGINAL_DAO_TOKEN as Address,
    poolAddress as Address,
    durationOneYearInSeconds,
    chainId ?? DEFAULT_CHAIN_ID,
  )

  const formattedAPR = calculateAPRQuotePercentageRate(rawAPRQuotePercentageRate)

  const isApproved = useMemo(() => {
    if (_.isUndefined(allowance) || _.isUndefined(formattedInput)) return false
    return allowance >= formattedInput
  }, [allowance, formattedInput])

  const isBalanceSufficient = useMemo(() => {
    if (_.isUndefined(userStakeBalance)) return false
    if (_.isUndefined(formattedInput)) return true

    if (formattedInput && userStakeBalance) {
      return userStakeBalance >= formattedInput
    }
  }, [userStakeBalance, formattedInput])

  const { unstakeCallback } = useUnstakeCallback(
    unstakePool?.stakePool as Address,
    inputValue,
    formattedInput,
    isApproved,
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
    onResetUnstakeInput()
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
        showConfirm: false,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: true,
        txHash: null,
        txError: null,
      })

      await fetchAllowance()
    } catch (error) {
      console.log("Error approving token: ", error)
      setTransactionState({
        showConfirm: false,
        isPendingWallet: false,
        isPendingApprove: false,
        isPendingTx: false,
        isTxSubmitted: false,
        txHash: null,
        txError: null,
      })

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

        await fetchAllowance()
      }
    }
  }

  const handleUnstakeCallback = async () => {
    let txHash = undefined
    try {
      if (!unstakeCallback) {
        return new Error("Missing unstake callback")
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

      const transaction = await unstakeCallback()

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

      await fetchStakeTokenBalance()

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
        fetchStakeTokenBalance()
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
          txError: getTransactionError(error, "handleUnstakeCallback"),
        }))
      }
    }
  }

  const handleApplyMaxBalance = () => {
    if (!_.isUndefined(fullParsedUserStakeBalance)) {
      const maxBalance = trimTrailingZeroes(fullParsedUserStakeBalance)

      if (!_.isUndefined(maxBalance)) {
        onUserInput(maxBalance)
      }
    }
  }

  return (
    <PositionWrapper>
      <div className="flex justify-between">
        <div
          onClick={() => handleReturnToPool(poolAddress)}
          className="flex items-center justify-start space-x-1 cursor-pointer text-marginalGray-200"
        >
          <CaretLeftIcon />
          <span className="text-sm font-bold uppercase tracking-thin text-marginalGray-200">
            Back to Pool
          </span>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-[343px] sm:max-w-[440px] mt-12 shadow-outerBlack">
        <div className="border bg-marginalGray-900 border-marginalGray-800 rounded-t-3xl ">
          <div className="flex items-center justify-between p-4">
            <div className="relative text-lg font-bold uppercase md:text-xl tracking-thin text-marginalGray-200">
              Unstake
            </div>
          </div>

          <div className="px-4 pt-0 pb-4">
            <div className="p-4 border bg-marginalGray-950 border-marginalGray-800 rounded-xl">
              <div className="flex items-center space-x-2">
                <DoubleCurrencyLogo token0={token0} token1={token1} size={8} />

                <div className="flex flex-col overflow-x-hidden ">
                  <div className="flex items-center space-x-1 text-lg font-bold uppercase tracking-thin text-marginalGray-200">
                    <pre>{token0?.symbol}</pre>
                    <div className="my-auto">/</div>
                    <pre>{token1?.symbol}</pre>
                    <div className="ml-3">{leverageMax}x</div>
                  </div>

                  <div className="flex items-center text-xs font-bold uppercase flex-nowrap md:text-sm tracking-thin text-marginalGray-600">
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
              <div className="flex items-center space-x-1">
                <StakeInput inputValue={inputValue} onChange={onUserInput} />
              </div>

              <div className="flex text-sm tracking-thin font-bold uppercase space-x-2">
                <div
                  className="text-marginalOrange-500 bg-[#4C2D1E] px-0.5 rounded-sm cursor-pointer"
                  onClick={handleApplyMaxBalance}
                >
                  Max
                </div>
              </div>
            </InputContainer>

            <PercentageSlider 
              userInput={inputValue}
              isInputValid={isInputValid}
              formattedBalance={parsedUserStakeBalance}
              margin={userStakeBalance}
              decimals={Number(poolDecimals)}
              onUserInput={onUserInput}
              selectedPercentage={percentage}
              setPercentage={setPercentage}
              setPercentError={setPercentError}
              percentError={percentError}
            />

            <div className="py-2 space-y-2 text-sm font-bold uppercase tracking-thin text-marginalGray-600">
              <ListRow
                item="Available to Unstake"
                value={
                  <div className="flex items-baseline space-x-1 text-marginalGray-200">
                    <pre>{parsedUserStakeBalance}</pre>
                    <pre>{lpTokenSymbol}</pre>
                  </div>
                }
              />
              <ListRow
                item="APR"
                value={
                  <div className="flex items-baseline space-x-1 text-marginalGray-200">
                    <pre>{formattedAPR || "-"}%</pre>
                  </div>
                }
              />
            </div>
            <ConfirmUnstakeButton
              chainId={chainId}
              isInputValid={isInputValid}
              isTokenValid={isTokenValid}
              isTokenApproved={isApproved}
              isBalanceSufficient={isBalanceSufficient}
              isPendingWallet={isPendingWallet}
              isPendingApprove={isPendingApprove}
              tokenSymbol={lpTokenSymbol}
              onApproveToken={() =>
                approveToken(
                  formattedInput,
                  unstakePool?.stakePool as Address,
                  unstakeTokenAddress as Address,
                )
              }
              onConfirm={handleOpenConfirmModal}
              unstakeCallback={handleUnstakeCallback}
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
          onCallback={handleUnstakeCallback}
          isPendingWallet={isPendingWallet}
          isPendingApprove={isPendingApprove}
          isPendingTx={isPendingTx}
          isTxSubmitted={isTxSubmitted}
          txHash={txHash}
          txError={txError}
          hasConfirmModal={false}
          onSuccessText="Unstaking Success"
        />
      </AnimatePresence>
    </PositionWrapper>
  )
}

export default Unstake

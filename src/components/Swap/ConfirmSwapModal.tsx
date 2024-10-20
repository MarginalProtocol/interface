import { Link } from "react-router-dom"
import Modal from "../Modal"
import { ListRow } from "../List/ListRow"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { type PoolData, type Token } from "src/types"
import { CheckIcon } from "../Icons/CheckIcon"
import { SwapButton } from "./SwapButton"
import { TokenAsset } from "../Token/TokenAsset"
import { DoubleCurrencyLogo } from "src/pages/Pools"
import { AssetPairPriceRatio } from "../Trade/TradeDetailList"
import { getExplorerLink, ExplorerDataType } from "src/utils/getExplorerLink"
import { DEFAULT_CHAIN_ID } from "src/constants/chains"
import { ReactNode } from "react"
import { ArrowRightIcon } from "../Icons/ArrowRightIcon"
import { ArrowOutgoingIcon } from "../Icons/ArrowOutgoingIcon"
import { ActionButton } from "../ActionButton"
import { ErrorIcon } from "../Icons/ErrorIcon"

interface Props {
  chainId: number | undefined
  pool: PoolData | null
  inputToken: Token | null
  outputToken: Token | null

  open: boolean
  onOpen: () => void
  onClose: () => void
  onReset: () => void

  quotedInput: string
  quotedOutput: string | undefined

  swapQuote: any
  swapCallback: (() => Promise<any>) | undefined

  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  isTxSubmitted: boolean
  txHash: string | null
  txError: any

  poolPrice: string | null | undefined
  maxSlippage: string

  useInverse: boolean
  onToggleInverse: () => void
}

export const ConfirmSwapModal = ({
  chainId,
  pool,
  inputToken,
  outputToken,

  open,
  onOpen,
  onClose,
  onReset,

  quotedInput,
  quotedOutput,
  swapQuote,
  swapCallback,

  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  isTxSubmitted,
  txHash,
  txError,

  poolPrice,
  maxSlippage,

  useInverse,
  onToggleInverse,
}: Props) => {
  return (
    <Modal
      open={open}
      onOpen={onOpen}
      onClose={txHash ? onReset : isPendingTx ? () => null : onClose}
      disableExternalClickClose={Boolean(isPendingTx || txHash)}
    >
      {txError ? (
        <div className="relative pt-8 pb-4 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <XMarkIcon
            onClick={onClose}
            className="absolute w-6 h-6 cursor-pointer stroke-2 right-3 top-2 stroke-marginalGray-200 hover:opacity-80"
          />
          <div className="w-[100px] h-[100px] rounded-full bg-marginalBlack mx-auto flex items-center justify-center border border-marginalGray-800">
            <ErrorIcon />
          </div>

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Swap Failed
          </div>

          <div className="mb-6 text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
            Something Went Wrong
          </div>

          <div className="flex flex-col">
            <ActionButton action="Close" onClick={onReset} />
          </div>
        </div>
      ) : !isPendingTx && txHash ? (
        <div className="relative pt-8 pb-4 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <XMarkIcon
            onClick={onClose}
            className="absolute w-6 h-6 cursor-pointer stroke-2 right-3 top-2 stroke-marginalGray-200 hover:opacity-80"
          />
          <div className="w-[100px] h-[100px] rounded-full bg-marginalBlack mx-auto flex items-center justify-center border border-marginalGray-800">
            <CheckIcon />
          </div>

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Swap Executed
          </div>

          <div className="flex flex-col">
            {txHash && (
              <Link
                className="flex items-center justify-center w-full py-4 mb-2 text-sm font-bold leading-4 uppercase border border-transparent bg-marginalGray-800 text-marginalGray-200 hover:border-marginalGray-600 active:bg-marginalGray-800 active:border-marginalGray-800 disabled:border disabled:border-transparent focus:outline-none focus:ring-1 focus:ring-marginalOrange-300 tracking-thin rounded-xl "
                to={getExplorerLink(
                  chainId ?? DEFAULT_CHAIN_ID,
                  txHash,
                  ExplorerDataType.TRANSACTION,
                )}
                target="_blank"
              >
                View on Block Explorer
                <ArrowOutgoingIcon className="ml-2" />
              </Link>
            )}

            <ActionButton action="Close" onClick={onReset} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-[343px] sm:w-[440px]">
          <div className="relative flex items-center justify-between px-4 py-5">
            <div className="text-xl leading-6 tracking-thin font-bold text-[#CACACA] uppercase">
              Review Swap
            </div>
            <XMarkIcon
              onClick={onClose}
              className="w-6 h-6 cursor-pointer stroke-2 right-1.5 top-1 stroke-marginalGray-200 hover:opacity-80"
            />
          </div>

          <div className="h-[1px] bg-marginalGray-800" />

          <div className="flex p-2 sm:p-4">
            <div className="flex flex-col">
              <DetailsContainer>
                <div className="flex flex-col">
                  <div className="flex flex-wrap items-center mb-1 space-x-2">
                    <DoubleCurrencyLogo
                      token0={inputToken}
                      token1={outputToken}
                      size={4}
                    />
                    <div className="flex items-center space-x-1 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
                      <pre>{inputToken?.symbol}</pre>
                      <div className="my-auto text-lg font-bold">/</div>
                      <pre>{outputToken?.symbol}</pre>
                    </div>
                  </div>
                  <AssetPairPriceRatio
                    token0={inputToken}
                    token1={outputToken}
                    price={poolPrice}
                    useInverse={useInverse}
                    onToggleInverse={onToggleInverse}
                  />
                </div>

                <div className="mt-3 space-y-1 text-marginalGray-600">
                  <ListRow
                    item="Pool price"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{poolPrice}</pre>
                        {useInverse ? (
                          <div className="flex items-center">
                            <pre>{outputToken?.symbol}</pre>
                            <div>/</div>
                            <pre>{inputToken?.symbol}</pre>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <pre>{inputToken?.symbol}</pre>
                            <div>/</div>
                            <pre>{outputToken?.symbol}</pre>
                          </div>
                        )}
                      </div>
                    }
                  />
                  <ListRow
                    item="Slippage Tolerance"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{maxSlippage}%</pre>
                      </div>
                    }
                  />
                </div>

                <div className="my-4 h-[1px] bg-marginalGray-800" />

                <div className="flex flex-col space-y-2">
                  <span className="text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-600">
                    You Pay to Receive
                  </span>
                  <div className="flex flex-wrap items-center space-x-1 text-sm font-bold leading-4 uppercase text-marginalGray-200 tracking-thin">
                    <div className="flex flex-wrap justify-end space-x-1">
                      <div>{quotedInput}</div>
                      <TokenAsset token={inputToken} className="!w-4 !h-4" />
                    </div>

                    <ArrowRightIcon />

                    <div className="flex flex-wrap justify-end space-x-1">
                      <div>{quotedOutput}</div>
                      <TokenAsset token={outputToken} className="!w-4 !h-4" />
                    </div>
                  </div>
                </div>
              </DetailsContainer>
            </div>
          </div>

          <div className="px-4 pb-4">
            <SwapButton
              swapCallback={swapCallback}
              isPendingWallet={isPendingWallet}
              isPendingApprove={isPendingApprove}
              isPendingTx={isPendingTx}
              isTxSubmitted={isTxSubmitted}
              txError={txError}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}

const DetailsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="bg-marginalBlack py-3.5 px-4 sm:py-4 sm:px-4 rounded-lg w-[327px] sm:w-[408px] h-fit text-xs leading-4 tracking-thin font-bold uppercase text-marginalGray-600">
      {children}
    </div>
  )
}

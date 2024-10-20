import _ from "lodash"
import { Link } from "react-router-dom"
import Modal from "../Modal"
import { ListRow } from "../List/ListRow"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { getExplorerLink, ExplorerDataType } from "src/utils/getExplorerLink"
import { Token } from "../../types"
import { CheckIcon } from "../Icons/CheckIcon"
import { RemoveLiquidityButton } from "./RemoveLiquidityButton"
import CurrencyLogo from "../Logo/CurrencyLogo"
import { SpinningLoader } from "../Icons/SpinningLoader"
import { ListContainer } from "../List/ListContainer"
import { ArrowOutgoingIcon } from "../Icons/ArrowOutgoingIcon"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number
  open: boolean
  onOpen: () => void
  onClose: () => void
  onReset: () => void
  quotedAmount0: string | null | undefined
  quotedAmount1: string | null | undefined
  token0: Token | null
  token1: Token | null
  removeLiquidityQuote?: any
  removeLiquidityCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  isTxSubmitted?: boolean
  txHash: string | null
  txError: any
}

export const ConfirmRemoveLiquidityModal = ({
  chainId,
  open,
  onOpen,
  onClose,
  onReset,
  quotedAmount0,
  quotedAmount1,
  token0,
  token1,
  removeLiquidityQuote,
  removeLiquidityCallback,
  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  isTxSubmitted,
  txHash,
  txError,
}: Props) => {
  return (
    <Modal
      open={open}
      onOpen={onOpen}
      onClose={txHash ? onReset : isPendingTx ? () => null : onClose}
    >
      {isPendingWallet ? (
        <div className="relative py-8 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <XMarkIcon
            onClick={onClose}
            className="absolute w-6 h-6 cursor-pointer stroke-2 right-3 top-2 stroke-marginalGray-200 hover:opacity-80"
          />
          <SpinningLoader />

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Confirm transaction
          </div>

          <div className="text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
            Proceed in your wallet
          </div>
        </div>
      ) : isPendingTx ? (
        <div className="py-8 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <SpinningLoader />

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Transaction submitted
          </div>

          <div className="text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
            Waiting for transaction to finalize
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
            Transaction Executed
          </div>

          <div className="flex flex-col">
            {txHash && (
              <Link
                className="flex items-center justify-center w-full py-4 mb-2 text-sm font-bold leading-4 uppercase border border-transparent bg-marginalGray-800 text-marginalGray-200 hover:border-marginalGray-600 active:bg-marginalGray-800 active:border-marginalGray-800 disabled:border disabled:border-transparent focus:outline-none focus:ring-1 focus:ring-marginalOrange-300 tracking-thin rounded-xl "
                to={getExplorerLink(chainId, txHash, ExplorerDataType.TRANSACTION)}
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
        <div className="flex flex-col px-2 py-3 space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="text-lg text-center text-white">Review Remove Liquidity</div>
            <XMarkIcon
              onClick={onClose}
              className="absolute w-6 h-6 cursor-pointer stroke-2 right-1.5 top-1 stroke-marginalGray-200"
            />
          </div>

          <ListContainer>
            <ListRow
              item="Pool Deposit"
              value={
                <div className="flex items-center space-x-1">
                  <pre>{quotedAmount0}</pre>
                  <CurrencyLogo token={token0} size={4} />
                  <pre>{token0?.symbol}</pre>
                </div>
              }
            />
            <ListRow
              item="Pool Deposit"
              value={
                <div className="flex items-center space-x-1">
                  <pre>{quotedAmount1}</pre>
                  <CurrencyLogo token={token1} size={4} />
                  <pre>{token1?.symbol}</pre>
                </div>
              }
            />
          </ListContainer>

          <RemoveLiquidityButton
            removeLiquidityCallback={removeLiquidityCallback}
            isPendingWallet={isPendingWallet}
            isPendingApprove={isPendingApprove}
            isPendingTx={isPendingTx}
            error={txError}
          />
        </div>
      )}
    </Modal>
  )
}

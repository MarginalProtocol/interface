import _ from "lodash"
import { Link } from "react-router-dom"
import Modal from "../Modal"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { getExplorerTransactionLink } from "src/utils/getExplorerTransactionLink"
import { CheckIcon } from "../Icons/CheckIcon"
import { SpinningLoader } from "../Icons/SpinningLoader"
import { getExplorerLink, ExplorerDataType } from "src/utils/getExplorerLink"
import { ArrowOutgoingIcon } from "../Icons/ArrowOutgoingIcon"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number
  open: boolean
  onOpen: () => void
  onClose: () => void
  onReset: () => void
  onCallback: () => void

  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  isTxSubmitted?: boolean

  txHash: string | null
  txError: any

  hasConfirmModal: boolean
  children?: React.ReactNode
  action?: string
  buttonText?: string
  onConfirmText?: string
  onPendingText?: string
  onApproveText?: string
  onSuccessText?: string
}

export const ConfirmTransactionModal = ({
  chainId,
  open,
  onOpen,
  onClose,
  onReset,
  onCallback,

  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  isTxSubmitted,

  txHash,
  txError,

  hasConfirmModal,
  children,
  buttonText,
  onConfirmText,
  onApproveText,
  onPendingText,
  onSuccessText,
}: Props) => {
  if (open) {
    return (
      <Modal
        open={open}
        onOpen={onOpen}
        onClose={
          isPendingWallet || isPendingTx || isPendingApprove || txHash
            ? () => null
            : onClose
        }
        disableExternalClickClose={Boolean(isPendingTx || txHash)}
      >
        {isPendingWallet ? (
          <div className="relative py-8 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
            <XMarkIcon
              onClick={onClose}
              className="absolute w-6 h-6 cursor-pointer stroke-2 right-3 top-2 stroke-marginalGray-200 hover:opacity-80"
            />
            <SpinningLoader />

            <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
              {onConfirmText ?? "Confirm transaction"}
            </div>

            <div className="text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
              Proceed in your wallet
            </div>
          </div>
        ) : isPendingApprove ? (
          <div className="py-8 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
            <SpinningLoader />

            <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
              {onApproveText ?? "Awaiting approval"}
            </div>

            <div className="text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
              Waiting for transaction to finalize
            </div>
          </div>
        ) : isPendingTx ? (
          <div className="py-8 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
            <SpinningLoader />

            <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
              {onPendingText ?? "Transaction submitted"}
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
              {onSuccessText ?? "Transaction Executed"}
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
        ) : hasConfirmModal ? (
          <div className="flex flex-col px-2 py-3 space-y-3">
            {children}

            <button
              id={`${buttonText}-button`}
              className={`
                w-full p-2 bg-marginalOrange-500 text-white font-bold 
                rounded-xl hover:opacity-80 hover:animate-pulse
              `}
              onClick={() => onCallback()}
            >
              {buttonText}
            </button>
          </div>
        ) : null}
      </Modal>
    )
  } else {
    return null
  }
}

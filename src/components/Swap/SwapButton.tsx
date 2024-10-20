import { ActionButton } from "../ActionButton"

interface Props {
  swapCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  isTxSubmitted: boolean
  txError: any
}

export const SwapButton = ({
  swapCallback,
  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  isTxSubmitted,
  txError,
}: Props) => {
  if (txError) {
    return <ActionButton action={txError} disabled={true} />
  }

  if (isPendingWallet) {
    return <ActionButton action="Confirm in Wallet" disabled />
  }

  if (isPendingApprove) {
    return <ActionButton action="Approving..." disabled={true} />
  }

  if (isPendingTx) {
    return <ActionButton action="Executing Swap..." disabled={true} />
  }

  if (swapCallback) {
    return (
      <ActionButton
        action="Execute Swap"
        onClick={swapCallback && (() => swapCallback())}
        disabled={!swapCallback}
      />
    )
  }

  return <ActionButton action="Error - please refresh" disabled={true} />
}

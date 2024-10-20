import { ActionButton } from "../ActionButton"

interface Props {
  mintCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  isTxSubmitted: boolean
  txError: any
}

export const TradeButton = ({
  mintCallback,
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
    return <ActionButton action="Executing Trade..." disabled={true} />
  }

  if (mintCallback) {
    return (
      <ActionButton
        action="Execute Trade"
        onClick={mintCallback && (() => mintCallback())}
        disabled={!mintCallback}
      />
    )
  }

  return <ActionButton action="Error - please refresh" disabled={true} />
}

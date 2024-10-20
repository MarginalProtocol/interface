import { ActionButton } from "../ActionButton"

interface Props {
  igniteCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingTx: boolean
  error: any
}

export const ClosePositionButton = ({
  igniteCallback,
  isPendingWallet,
  isPendingTx,
  error,
}: Props) => {
  if (isPendingWallet) {
    return <ActionButton action="Confirm in Wallet" disabled />
  }

  if (isPendingTx) {
    return <ActionButton action="Closing Position..." disabled={true} />
  }

  if (error) {
    return <ActionButton action={error} disabled={true} />
  }

  return (
    <ActionButton
      action="Close"
      onClick={igniteCallback && (() => igniteCallback())}
      disabled={!igniteCallback}
    />
  )
}

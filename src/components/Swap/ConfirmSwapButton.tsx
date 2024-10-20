import { useAccount } from "wagmi"
import { switchNetwork } from "@wagmi/core"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { isSupportedChain, DEFAULT_CHAIN_ID } from "src/constants/chains"
import { Token } from "src/types"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number | undefined
  inputToken: Token | null
  isInputValid: boolean
  isTokensValid: boolean
  isApproved: boolean
  isBalanceSufficient: boolean
  onApprove: () => Promise<void>
  onConfirm: () => void
  swapCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  error: any
}

export const ConfirmSwapButton = ({
  chainId,
  inputToken,
  isInputValid,
  isTokensValid,
  isApproved,
  isBalanceSufficient,
  onApprove,
  onConfirm,
  swapCallback,
  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  error,
}: Props) => {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const isValidNetwork = isSupportedChain(chainId)

  const executeNetworkSwitch = () => {
    switchNetwork({ chainId: DEFAULT_CHAIN_ID })
  }

  if (!address) {
    return (
      <ActionButton action="Connect Wallet" textSize="lg" onClick={openConnectModal} />
    )
  }
  if (!isValidNetwork) {
    return (
      <ActionButton
        action="Switch Network"
        textSize="lg"
        onClick={executeNetworkSwitch}
      />
    )
  }
  if (isPendingWallet) {
    return <ActionButton action="Confirm in Wallet" textSize="lg" disabled />
  }
  if (isPendingApprove) {
    return <ActionButton action="Approving..." textSize="lg" disabled={true} />
  }
  if (isPendingTx) {
    return <ActionButton action="Swapping..." disabled={true} />
  }
  if (error) {
    return <ActionButton action={error} textSize="lg" disabled={true} />
  }

  if (!isInputValid) {
    return <ActionButton action="Select Amount" textSize="lg" disabled={true} />
  }

  if (!isTokensValid) {
    return <ActionButton action="Select Token" textSize="lg" disabled={true} />
  }

  if (!isBalanceSufficient) {
    return <ActionButton action="Not Enough Balance" textSize="lg" disabled={true} />
  }

  if (!isApproved) {
    return (
      <ActionButton
        action={`Approve ${inputToken?.symbol} Token`}
        textSize="lg"
        onClick={onApprove && (() => onApprove())}
        disabled={!onApprove}
      />
    )
  }

  return (
    <ActionButton
      action="Swap"
      textSize="lg"
      onClick={swapCallback && (() => onConfirm())}
      disabled={!swapCallback}
    />
  )
}

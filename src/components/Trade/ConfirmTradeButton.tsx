import { useAccount } from "wagmi"
import { switchNetwork } from "@wagmi/core"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Token } from "src/types"
import { isSupportedChain, DEFAULT_CHAIN_ID } from "src/constants/chains"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number | undefined
  marginToken: Token | null
  isInputValid: boolean
  isTokensValid: boolean
  isApproved: boolean
  isBalanceSufficient: boolean
  isPendingWallet: boolean
  isPendingApprove: boolean
  onApprove: () => Promise<void>
  onConfirm: () => void
  mintQuote: any
  mintCallback: (() => Promise<any>) | undefined
  error: any
}

export const ConfirmTradeButton = ({
  chainId,
  marginToken,
  isInputValid,
  isTokensValid,
  isApproved,
  isBalanceSufficient,
  isPendingWallet,
  isPendingApprove,
  onApprove,
  onConfirm,
  mintQuote,
  mintCallback,
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
  if (error) {
    return <ActionButton action={error} textSize="lg" disabled={true} />
  }

  if (isPendingWallet) {
    return <ActionButton action="Confirm in Wallet" textSize="lg" disabled />
  }

  if (isPendingApprove) {
    return <ActionButton action="Approving..." textSize="lg" disabled={true} />
  }

  if (!isInputValid) {
    return <ActionButton action="Enter Amount" textSize="lg" disabled={true} />
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
        action={`Approve ${marginToken?.symbol} Token`}
        onClick={onApprove && (() => onApprove())}
        disabled={!onApprove}
        textSize="lg"
      />
    )
  }

  return (
    <ActionButton
      action="Confirm Trade"
      textSize="lg"
      onClick={mintCallback && (() => onConfirm())}
      disabled={!mintQuote}
    />
  )
}

import { useAccount } from "wagmi"
import { switchNetwork } from "@wagmi/core"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { isSupportedChain, DEFAULT_CHAIN_ID } from "src/constants/chains"
import { type Token } from "src/types"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number | null
  isInputValid: boolean
  isTokenValid: boolean
  isTokenApproved: boolean
  isBalanceSufficient: boolean | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  tokenSymbol: string | undefined
  onApproveToken: () => Promise<void>
  onConfirm: () => void
  stakeCallback: (() => Promise<any>) | undefined
  error: any
}

export const ConfirmStakeButton = ({
  chainId,
  isInputValid,
  isTokenValid,
  isTokenApproved,
  isBalanceSufficient,
  isPendingWallet,
  isPendingApprove,
  tokenSymbol,
  onApproveToken,
  onConfirm,
  stakeCallback,
  error,
}: Props) => {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const isValidNetwork = isSupportedChain(chainId)

  const executeNetworkSwitch = () => {
    switchNetwork({ chainId: DEFAULT_CHAIN_ID })
  }

  if (!address) {
    return <ActionButton action="Connect Wallet" onClick={openConnectModal} />
  }
  if (!isValidNetwork) {
    return <ActionButton action="Switch Network" onClick={executeNetworkSwitch} />
  }
  if (isPendingWallet) {
    return <ActionButton action="Confirm in Wallet" disabled />
  }

  if (isPendingApprove) {
    return <ActionButton action="Approving..." disabled={true} />
  }

  if (error) {
    return <ActionButton action={error} disabled={true} />
  }

  if (!isInputValid) {
    return <ActionButton action="Enter Amount" disabled={true} />
  }

  if (!isTokenValid) {
    return <ActionButton action="Select Token" disabled={true} />
  }

  if (!isBalanceSufficient) {
    return <ActionButton action="Not Enough Balance" disabled={true} />
  }

  if (!isTokenApproved) {
    return (
      <ActionButton
        action={`Approve ${tokenSymbol} Token`}
        onClick={onApproveToken && (() => onApproveToken())}
        disabled={!onApproveToken}
      />
    )
  }

  return (
    <ActionButton
      action="Stake"
      onClick={stakeCallback && (() => stakeCallback())}
      disabled={!stakeCallback}
    />
  )
}

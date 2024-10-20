import { useAccount } from "wagmi"
import { switchNetwork } from "@wagmi/core"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { isSupportedChain, DEFAULT_CHAIN_ID } from "src/constants/chains"
import { type Token } from "src/types"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number | undefined
  isInputValid: boolean
  isTokensValid: boolean
  isTokenApproved: boolean
  isPendingWallet: boolean
  isPendingApprove: boolean
  onApprove: () => Promise<void>
  tokenA: Token | null
  tokenB: Token | null
  onConfirm: () => void
  removeLiquidityCallback: (() => Promise<any>) | undefined
  error: any
  disabled: boolean
}

export const ConfirmRemoveLiquidityButton = ({
  chainId,
  isInputValid,
  isTokensValid,
  isTokenApproved,
  isPendingWallet,
  isPendingApprove,
  onApprove,
  tokenA,
  tokenB,
  onConfirm,
  removeLiquidityCallback,
  error,
  disabled,
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

  if (!isTokensValid) {
    return <ActionButton action="Select Token" disabled={true} />
  }

  if (!isTokenApproved) {
    return (
      <ActionButton
        action={`Approve MARGV1-LP`}
        onClick={onApprove && (() => onApprove())}
        disabled={!onApprove}
      />
    )
  }

  return (
    <ActionButton
      action="Remove Liquidity"
      onClick={removeLiquidityCallback && (() => removeLiquidityCallback())}
      disabled={!removeLiquidityCallback || disabled}
    />
  )
}

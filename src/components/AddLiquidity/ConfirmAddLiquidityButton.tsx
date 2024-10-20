import { useAccount } from "wagmi"
import { switchNetwork } from "@wagmi/core"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { isSupportedChain, DEFAULT_CHAIN_ID } from "src/constants/chains"
import { type Token } from "src/types"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number | null
  isInputValid: boolean
  isTokensValid: boolean
  isTokenAApproved: boolean
  isTokenBApproved: boolean
  isBalanceSufficient: boolean
  isPendingWallet: boolean
  isPendingApprove: boolean
  onApproveTokenA: () => Promise<void>
  onApproveTokenB: () => Promise<void>
  tokenA: Token | null
  tokenB: Token | null
  onConfirm: () => void
  addLiquidityCallback: (() => Promise<any>) | undefined
  error: any
}

export const ConfirmAddLiquidityButton = ({
  chainId,
  isInputValid,
  isTokensValid,
  isTokenAApproved,
  isTokenBApproved,
  isBalanceSufficient,
  isPendingWallet,
  isPendingApprove,
  onApproveTokenA,
  onApproveTokenB,
  tokenA,
  tokenB,
  onConfirm,
  addLiquidityCallback,
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

  if (!isTokensValid) {
    return <ActionButton action="Select Token" disabled={true} />
  }

  if (!isBalanceSufficient) {
    return <ActionButton action="Not Enough Balance" disabled={true} />
  }

  if (!isTokenAApproved) {
    return (
      <ActionButton
        action={`Approve ${tokenA?.symbol}`}
        onClick={onApproveTokenA && (() => onApproveTokenA())}
        disabled={!onApproveTokenA}
      />
    )
  }

  if (!isTokenBApproved) {
    return (
      <ActionButton
        action={`Approve ${tokenB?.symbol}`}
        onClick={onApproveTokenB && (() => onApproveTokenB())}
        disabled={!onApproveTokenB}
      />
    )
  }

  return (
    <ActionButton
      action="Add Liquidity"
      onClick={addLiquidityCallback && (() => addLiquidityCallback())}
      disabled={!addLiquidityCallback}
    />
  )
}

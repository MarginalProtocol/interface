import { useAccount } from "wagmi"
import { switchNetwork } from "@wagmi/core"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { Token } from "src/types"
import { isSupportedChain, DEFAULT_CHAIN_ID } from "src/constants/chains"
import { ActionButton } from "../ActionButton"
import { GAS_TOKEN_MAP, WRAPPED_GAS_TOKEN_MAP } from "src/constants/tokens"

interface Props {
  chainId: number
  marginToken: Token | null
  isInputValid: boolean
  isTokenValid: boolean
  isApproved: boolean
  isBalanceSufficient: boolean
  onApprove: () => Promise<void>
  lockCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  error: any
  disabled: boolean
  useGasToken: boolean
}

export const AddMarginButton = ({
  chainId,
  marginToken,
  isInputValid,
  isTokenValid,
  isApproved,
  isBalanceSufficient,
  onApprove,
  lockCallback,
  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  error,
  disabled,
  useGasToken,
}: Props) => {
  const { address } = useAccount()
  const { openConnectModal } = useConnectModal()
  const isValidNetwork = isSupportedChain(chainId)

  const WRAPPED_GAS_TOKEN = WRAPPED_GAS_TOKEN_MAP[chainId]
  const GAS_TOKEN = GAS_TOKEN_MAP[chainId]

  const tokenSymbol =
    marginToken?.symbol && !useGasToken
      ? marginToken?.symbol
      : useGasToken
        ? GAS_TOKEN.symbol
        : WRAPPED_GAS_TOKEN.symbol

  const executeNetworkSwitch = () => {
    switchNetwork({ chainId: DEFAULT_CHAIN_ID })
  }

  if (!address) {
    return <ActionButton action="Connect Wallet" onClick={openConnectModal} />
  }

  if (!isValidNetwork) {
    return <ActionButton action="Switch Network" onClick={executeNetworkSwitch} />
  }

  if (error) {
    return <ActionButton action={error} disabled={true} />
  }

  if (isPendingWallet) {
    return <ActionButton action="Confirm in Wallet" disabled />
  }

  if (isPendingTx) {
    return <ActionButton action={`Depositing ${tokenSymbol}...`} disabled={true} />
  }

  if (isPendingApprove) {
    return <ActionButton action={`Approving ${tokenSymbol}...`} disabled={true} />
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

  if (!isApproved) {
    return (
      <ActionButton
        action={`Approve ${tokenSymbol}`}
        onClick={onApprove && (() => onApprove())}
      />
    )
  }

  return (
    <ActionButton
      action={`Deposit ${tokenSymbol}`}
      onClick={lockCallback && (() => lockCallback())}
      disabled={!lockCallback || disabled}
    />
  )
}

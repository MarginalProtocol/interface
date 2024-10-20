import { useAccount } from "wagmi"
import { switchNetwork } from "@wagmi/core"
import { useConnectModal } from "@rainbow-me/rainbowkit"
import { isSupportedChain, DEFAULT_CHAIN_ID } from "src/constants/chains"
import { ActionButton } from "../ActionButton"

interface Props {
  chainId: number | undefined
  isInputValid: boolean
  freeCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingTx: boolean
  error: any
}

export const RemoveMarginButton = ({
  chainId,
  isInputValid,
  freeCallback,
  isPendingWallet,
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

  if (!isInputValid) {
    return <ActionButton action="Select Amount" disabled={true} />
  }

  return (
    <ActionButton
      action="Withdraw"
      onClick={freeCallback && (() => freeCallback())}
      disabled={!freeCallback}
    />
  )
}

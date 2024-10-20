import { useState } from "react"
import { useParams } from "react-router-dom"
import { useAccount } from "wagmi"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { usePositionsQuery } from "../hooks/usePositionsQuery"
import { usePositionQuery } from "../hooks/usePositionQuery"
import { filterPositionsByKey } from "../functions/filterPositionsByIndexedId"
import AddMargin from "../components/Position/AddMargin"
import RemoveMargin from "../components/Position/RemoveMargin"
import { PositionWrapper } from "../components/Position/PositionWrapper"
import { usePositionData } from "../hooks/usePositionData"
import { useApplicationState } from "src/state/application/hooks"
import { CaretLeftIcon } from "src/components/Icons/CaretLeftIcon"
import { DirectionToggle } from "src/components/DirectionToggle"
import { useNetworkChangeRedirect } from "src/hooks/useNetworkChangeRedirect"

interface FormProps {
  position: any
  onSelectDeposit: () => void
  onSelectWithdraw: () => void
  mode: "Deposit" | "Withdraw"
  fetchPositionState: (tokenId: string) => Promise<void>
}

const ManagePosition = () => {
  const { chainId } = useApplicationState()
  const { address } = useAccount()
  const { positionKey } = useParams()
  const { onNavigateToPosition, onNavigateToPositions } = useNavigateRoutes()
  const { positionQueryData } = usePositionQuery(positionKey)
  const { positions, isLoading: isLoadingQuery } = usePositionsQuery(address)
  const position = filterPositionsByKey(positionKey, positions)
  const tokenId = position?.tokenId

  useNetworkChangeRedirect(onNavigateToPositions)

  const {
    position: positionData,
    isLoading: isLoadingData,
    fetchPositionData,
  } = usePositionData(tokenId, positionQueryData, chainId)

  const [
    { showModal, mode, isPendingWallet, isPendingTx, isTxSubmitted, txHash, txError },
    setTransactionState,
  ] = useState<{
    showModal: boolean
    mode: "Deposit" | "Withdraw"
    isPendingWallet: boolean
    isPendingTx: boolean
    isTxSubmitted: boolean
    txHash: string | null
    txError: any
  }>({
    showModal: false,
    mode: "Deposit",
    isPendingWallet: false,
    isPendingTx: false,
    isTxSubmitted: false,
    txHash: null,
    txError: null,
  })

  const handleUseMode = (mode: "Deposit" | "Withdraw") => {
    setTransactionState((prevState) => ({
      ...prevState,
      mode: mode,
    }))
  }
  const handleDepositMode = () => handleUseMode("Deposit")
  const handleWithdrawMode = () => handleUseMode("Withdraw")

  return (
    <PositionWrapper>
      <div
        onClick={positionKey ? () => onNavigateToPosition(positionKey) : () => null}
        className="flex items-center justify-start my-6 space-x-1 cursor-pointer text-marginalGray-200"
      >
        <CaretLeftIcon />
        <span className="text-sm font-bold leading-4 uppercase tracking-thin text-marginalGray-200">
          Back to Token
        </span>
      </div>
      <EditPositionInputForm
        position={positionData}
        onSelectDeposit={handleDepositMode}
        onSelectWithdraw={handleWithdrawMode}
        mode={mode}
        fetchPositionState={fetchPositionData}
      />
    </PositionWrapper>
  )
}

export default ManagePosition

const EditPositionInputForm = ({
  position,
  onSelectDeposit,
  onSelectWithdraw,
  mode,
  fetchPositionState,
}: FormProps) => {
  return (
    <div className="relative mx-auto w-full max-w-[343px] sm:max-w-[440px] mt-12 shadow-outerBlack">
      <div className="border bg-marginalGray-900 border-marginalGray-800 rounded-t-3xl ">
        <div className="flex items-center justify-between p-4">
          <div className="relative text-lg font-bold leading-5 uppercase md:text-xl md:leading-6 tracking-thin text-marginalGray-200">
            Manage Position
          </div>
        </div>
        <div className="px-4 pt-0 pb-4">
          <DirectionToggle
            view={mode}
            handlePrimaryClick={onSelectDeposit}
            handleSecondaryClick={onSelectWithdraw}
            primaryText="Deposit"
            secondaryText="Withdraw"
          />
        </div>
      </div>
      <>
        {mode === "Withdraw" && (
          <RemoveMargin position={position} fetchPositionState={fetchPositionState} />
        )}

        {mode === "Deposit" && (
          <AddMargin position={position} fetchPositionState={fetchPositionState} />
        )}
      </>
    </div>
  )
}

interface Props {
  addLiquidityCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  isTxSubmitted: boolean
  txError: any
}

export const AddLiquidityButton = ({
  addLiquidityCallback,
  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  isTxSubmitted,
  txError,
}: Props) => {
  if (txError) {
    return (
      <button
        disabled
        className="w-full p-3 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        {txError}
      </button>
    )
  }

  if (isPendingWallet) {
    return (
      <button
        disabled
        className="w-full p-3 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        Confirm in Wallet
      </button>
    )
  }

  if (isPendingApprove) {
    return (
      <button
        disabled
        className="w-full p-3 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        Approving...
      </button>
    )
  }

  if (isPendingTx) {
    return (
      <button
        disabled
        className="w-full p-3 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        Adding Liquidity...
      </button>
    )
  }

  if (addLiquidityCallback) {
    return (
      <button
        id="add-liquidity-button"
        className={`
          w-full p-3 bg-marginalOrange-500 text-white font-bold
          border-2 border-borderGray rounded-xl
        `}
        onClick={() => addLiquidityCallback()}
      >
        Add Liquidity
      </button>
    )
  }

  return (
    <button
      id="add-liquidity-error-button"
      disabled
      className={`
          w-full p-3 bg-marginalGray-850 text-textGray font-bold
          border-2 border-borderGray rounded-xl
        `}
    >
      Error - please refresh
    </button>
  )
}

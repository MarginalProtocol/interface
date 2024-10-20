interface Props {
  removeLiquidityCallback: (() => Promise<any>) | undefined
  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  error: any
}

export const RemoveLiquidityButton = ({
  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  removeLiquidityCallback,
  error,
}: Props) => {
  if (error) {
    return (
      <button
        disabled
        className="w-full p-2 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        {error}
      </button>
    )
  }

  if (isPendingWallet) {
    return (
      <button
        disabled
        className="w-full p-2 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        Confirm in Wallet
      </button>
    )
  }

  if (isPendingApprove) {
    return (
      <button
        disabled
        className="w-full p-2 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        Approving...
      </button>
    )
  }

  if (isPendingTx) {
    return (
      <button
        disabled
        className="w-full p-2 font-bold border-2 border-borderGray rounded-xl bg-marginalGray-850 text-textGray"
      >
        Removing Liquidity...
      </button>
    )
  }

  if (removeLiquidityCallback) {
    return (
      <button
        id="confirm-trade-button"
        className={`
            w-full p-2 border-2 border-borderGray rounded-xl font-bold
            bg-marginalOrange-500 text-white
          `}
        onClick={() => removeLiquidityCallback()}
      ></button>
    )
  }

  return (
    <button
      disabled
      id="remove-liquidity-error-button"
      className={`
        w-full p-2 bg-marginalGray-850 text-textGray font-bold
        border-2 border-borderGray rounded-xl
      `}
    >
      Error - please refresh
    </button>
  )
}

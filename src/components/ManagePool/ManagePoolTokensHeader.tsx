import { TokenImage } from "../Token/TokenImage"

export const ManagePoolHeader = ({
  token0Symbol,
  token1Symbol,
  token0Address,
  token1Address,
  leverageMax,
  poolUtilization,
}: {
  token0Symbol: any
  token1Symbol: any
  token0Address: string | undefined
  token1Address: string | undefined
  leverageMax: number
  poolUtilization: number | undefined
}) => {
  let poolUnlocked: number | undefined

  if (typeof poolUtilization === "number") {
    const poolUtilizationPercentage = Number(poolUtilization * 100)
    poolUnlocked = parseFloat((100 - poolUtilizationPercentage).toFixed(2))
  } else {
    poolUnlocked = undefined
  }

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex flex-row items-center [&>svg]:w-[24px] [&>svg]:h-[24px]">
        <div className="flex -space-x-2">
          <TokenImage tokenAddress={token0Address} tokenSymbol={token0Symbol} />
          <TokenImage tokenAddress={token1Address} tokenSymbol={token1Symbol} />
        </div>
        <TokenPairDisplay token0Symbol={token0Symbol} token1Symbol={token1Symbol} />
        <MaxLeverageDisplay leverageMax={leverageMax} />
      </div>
      <div className="text-xs font-semibold tracking-wide text-green-500">
        {poolUnlocked ? `${poolUnlocked}% unlocked` : null}
      </div>
    </div>
  )
}

const TokenPairDisplay = ({
  token0Symbol,
  token1Symbol,
}: {
  token0Symbol: string
  token1Symbol: string
}) => {
  return (
    <div
      id="pool-token-pair-display"
      className="mx-2 text-2xl font-bold tracking-wide text-marginalGray-200"
    >
      {token0Symbol}/{token1Symbol}
    </div>
  )
}

const MaxLeverageDisplay = ({ leverageMax }: { leverageMax: number }) => {
  return (
    <div
      id="pool-max-leverage-display"
      className="text-xl font-bold tracking-wide text-textGray"
    >
      {leverageMax}x max
    </div>
  )
}

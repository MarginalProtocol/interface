import { TokenImage } from "../Token/TokenImage"

export const PoolHeader = ({
  token0Symbol,
  token1Symbol,
  token0Address,
  token1Address,
  leverageMax,
}: {
  token0Symbol: any
  token1Symbol: any
  token0Address: string
  token1Address: string
  leverageMax?: number
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-2">
        <TokenImage tokenAddress={token0Address} tokenSymbol={token0Symbol} />
        <TokenImage tokenAddress={token1Address} tokenSymbol={token1Symbol} />
      </div>
      <div>
        <TokenPairDisplay token0Symbol={token0Symbol} token1Symbol={token1Symbol} />
        <MaxLeverageDisplay leverageMax={leverageMax} />
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
    <div id="token-pair-display" className="flex">
      <div className="text-xl font-bold uppercase">
        {token0Symbol}/{token1Symbol}
      </div>
    </div>
  )
}

const MaxLeverageDisplay = ({ leverageMax }: { leverageMax?: number }) => {
  return (
    <div id="max-leverage-display" className="text-xs uppercase text-textGray">
      {leverageMax}x max
    </div>
  )
}

import { TokenInfo } from "@uniswap/token-lists"
import { Token } from "../../types"
import { TokenImage } from "../Token/TokenImage"
import CurrencyLogo from "../Logo/CurrencyLogo"

const TokenNotTradeableMessage = () => {
  return (
    <div className="m-auto  text-sm text-marginalGray-200">No liquidity available</div>
  )
}

export const TokenSelect = ({
  token,
  onSelect,
  isTradeable = true,
}: {
  token: Token | TokenInfo
  onSelect: (token: Token | TokenInfo) => void
  isTradeable?: boolean
}) => {
  const handleSelect = () => {
    if (isTradeable) {
      onSelect(token)
    }
  }

  return (
    <div
      id="token-select"
      onClick={handleSelect}
      className={`
        px-4 py-2 grid
        ${isTradeable ? "cursor-pointer hover:bg-borderGray" : "cursor-not-allowed opacity-40 grid-cols-2 hover:bg-marginalBlack"}
      `}
    >
      <div className="flex items-center space-x-3">
        <CurrencyLogo token={token} className="w-7 h-7" />
        <div>
          <div className="text-base font-bold tracking-thin uppercase text-marginalGray-200">
            {token.symbol}
          </div>
          <div className="text-sm font-bold tracking-thin uppercase text-marginalGray-600">
            {token.name}
          </div>
        </div>
      </div>
      {!isTradeable ? <TokenNotTradeableMessage /> : null}
    </div>
  )
}

export const TokenSelectLoading = () => {
  return (
    <div className="flex px-3 py-2 cursor-pointer hover:bg-borderGray">
      <div className="flex items-center space-x-3  animate-pulse">
        <div className="rounded-full w-7 h-7 bg-marginalGray-200"></div>
        <div>
          <div className="h-4 rounded w-36 bg-marginalGray-200"></div>
          <div className="w-24 h-4 mt-1 rounded bg-marginalGray-200"></div>
        </div>
      </div>
    </div>
  )
}

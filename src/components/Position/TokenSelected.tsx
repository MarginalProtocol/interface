import { Token } from "src/types"
import CurrencyLogo from "src/components/Logo/CurrencyLogo"

export const TokenSelected = ({ selectedToken }: { selectedToken?: Token | null }) => {
  return (
    <div
      id="token-selected"
      className="flex items-center space-x-1 font-bold text-marginalGray-200 whitespace-nowrap"
    >
      <CurrencyLogo token={selectedToken} size={6} />
      <p>{selectedToken?.symbol}</p>
    </div>
  )
}

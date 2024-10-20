import { TokenImage } from "./TokenImage"
import { type Token } from "src/types"
import CurrencyLogo from "../Logo/CurrencyLogo"

export const TokenAsset = ({
  token,
  isReversed = false,
  className,
  showFullTokenName = false,
}: {
  token: Token | null | undefined
  isReversed?: boolean
  className?: string
  showFullTokenName?: boolean
}) => {
  if (token) {
    return (
      <div
        id="token-asset"
        className="flex items-center space-x-1 text-marginalGray-200 whitespace-nowrap"
      >
        {isReversed ? (
          <>
            <p>{token?.symbol}</p>
            <CurrencyLogo token={token} className={className} />
          </>
        ) : (
          <>
            <CurrencyLogo token={token} className={className} />
            <p>{token?.symbol}</p>
            {showFullTokenName && (
              <span className="text-sm tracking-thin font-bold text-marginalGray-600 uppercase">
                {token?.name?.substring(0, token?.name?.indexOf(" "))}
              </span>
            )}
          </>
        )}
      </div>
    )
  } else {
    return (
      <div className="text-sm tracking-thin font-bold text-marginalGray-600 flex space-x-1 uppercase md:text-base">
        <span className="">Select</span>
        <span className="">Token</span>
      </div>
    )
  }
}

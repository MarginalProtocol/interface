import { Token } from "../../types"
import { TokenAsset } from "./TokenAsset"
import { GAS_TOKEN_MAP } from "src/constants/tokens"

export const TokenSelected = ({
  selectedToken,
  useGasToken,
  handleClick,
  chainId,
}: {
  selectedToken?: Token | null
  useGasToken?: boolean
  handleClick?: () => void
  chainId: number
}) => {
  if (selectedToken) {
    if (useGasToken) selectedToken = GAS_TOKEN_MAP[chainId]
    return (
      <div
        id="token-selected"
        onClick={handleClick && (() => handleClick())}
        className={`${handleClick ? "cursor-pointer" : ""} flex items-center space-x-1`}
      >
        <TokenAsset
          token={selectedToken}
          showFullTokenName={false}
          className="!w-6 !h-6"
        />
      </div>
    )
  } else {
    return null
  }
}

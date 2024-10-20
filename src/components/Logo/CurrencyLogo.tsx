import { TokenInfo } from "@uniswap/token-lists"
import { Token } from "../../types"
import AssetLogo, { AssetLogoBaseProps } from "./AssetLogo"

export default function CurrencyLogo(
  props: AssetLogoBaseProps & {
    token?: Token | TokenInfo | null
  },
) {
  return (
    <AssetLogo
      name={props.token?.name}
      address={props.token?.address}
      symbol={props.symbol ?? props.token?.symbol}
      backupImg={(props.token as TokenInfo)?.logoURI}
      {...props}
    />
  )
}

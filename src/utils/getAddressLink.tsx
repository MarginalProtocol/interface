import { Link } from "react-router-dom"
import { getBlockExplorerLink } from "../utils/getBlockExplorerLink"
import { shortenAddress } from "../utils/shortenAddress"

export const getAddressLink = (address?: string) => {
  if (!address) {
    return undefined
  } else {
    return (
      <Link to={getBlockExplorerLink(address)} target="_blank">
        {shortenAddress(address, 4)}
      </Link>
    )
  }
}

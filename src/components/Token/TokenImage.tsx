import { getImageUrlFromAddress } from "../../constants/tokenImgs"
import { QuestionMarkCircleIcon } from "@heroicons/react/20/solid"

export const TokenImage = ({
  tokenAddress,
  tokenSymbol,
  className,
}: {
  tokenAddress?: string
  tokenSymbol?: string
  className?: string
}) => {
  let url = undefined

  if (tokenAddress) {
    url = getImageUrlFromAddress(tokenAddress)
  }

  if (url) {
    return (
      <img
        src={url}
        className={`w-6 h-6 rounded-full ${className}`}
        alt={`${tokenSymbol} logo`}
      />
    )
  } else {
    return (
      <QuestionMarkCircleIcon
        className={`w-6 h-6 rounded-full bg-bgGray fill-white ${className}`}
      />
    )
  }
}

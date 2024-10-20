import { ChainId } from "@uniswap/sdk-core"
import useTokenLogoSource from "../../hooks/useAssetLogoSource"
import React, { useState } from "react"
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid"
import { DEFAULT_CHAIN_ID } from "src/constants/chains"

export type AssetLogoBaseProps = {
  name?: string | null
  symbol?: string | null
  backupImg?: string | null
  size?: number
  className?: string
}

type AssetLogoProps = AssetLogoBaseProps & {
  isNative?: boolean
  address?: string | null
  chainId?: number
}

/**
 * Renders an image by prioritizing a list of sources, and then eventually a fallback triangle alert
 */
export default function AssetLogo({
  isNative,
  address,
  chainId = DEFAULT_CHAIN_ID,
  name,
  symbol,
  backupImg,
  size = 7,
  className,
}: AssetLogoProps) {
  const [src, nextSrc] = useTokenLogoSource(address, chainId, isNative, backupImg)
  const [imgLoaded, setImgLoaded] = useState(() => {
    const img = new Image()
    img.src = src ?? ""
    return src ? img.complete : false
  })

  // Determine the dynamic size for width, height, and font size based on 'size' prop
  const dynamicSizeClasses = `w-${size} h-${size} text-[calc(${size}/3)]`

  return (
    <div className={`relative flex ${dynamicSizeClasses} ${className}`}>
      {src ? (
        <div
          className={`relative w-[${size}] h-[${size}] ${imgLoaded ? "bg-transparent" : "bg-surface3"} transition-opacity duration-200 ease-in rounded-full`}
        >
          <img
            className={`opacity-${imgLoaded ? 100 : 0} transition-opacity duration-200 ease-in w-[${size}] h-[${size}] rounded-full bg-white shadow-lg border border-borderGray`}
            src={src}
            alt={`${symbol ?? "token"} logo`}
            onLoad={() => void setImgLoaded(true)}
            onError={nextSrc}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className={`${dynamicSizeClasses} ${className} rounded-full bg-marginalGray-200  z-50`}
        >
          <QuestionMarkCircleIcon
            className={`rounded-full text-marginalBlack z-50 ${className}`}
          />
        </div>
      )}
    </div>
  )
}

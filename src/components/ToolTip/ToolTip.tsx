import React, { useState, useEffect } from "react"
import { InformationCircleIcon } from "@heroicons/react/20/solid"
import { useMobileView } from "../../hooks/useMobileView"

export const InfoTip = ({
  width = 12,
  height = 12,
  longText = false,
  children,
}: {
  width?: number
  height?: number
  longText?: boolean
  children: React.ReactNode
}) => {
  return (
    <MouseoverTooltip longText={longText} hoverContent={children}>
      <InformationCircleIcon
        width={width}
        height={height}
        className="cursor-pointer hover:opacity-70"
      />
    </MouseoverTooltip>
  )
}

export const MouseoverTooltip = ({
  children,
  hoverContent,
  timeoutInMs,
  show = false,
  longText = false,
}: {
  children: any
  hoverContent: any
  timeoutInMs?: number
  show?: boolean
  longText?: boolean
}) => {
  const { isMobileView } = useMobileView()
  const [showTooltip, setShowTooltip] = useState(show)

  const activateTooltip = () => setShowTooltip(true)
  const hideTooltip = () => setShowTooltip(false)

  useEffect(() => {
    if (showTooltip && timeoutInMs) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(false)
      }, timeoutInMs)

      return () => {
        clearTimeout(tooltipTimer)
      }
    }
    return
  }, [timeoutInMs, showTooltip])

  return (
    <div
      onMouseEnter={!isMobileView ? activateTooltip : () => {}}
      onMouseLeave={!isMobileView ? hideTooltip : () => {}}
      onClick={() => setShowTooltip(!showTooltip)}
      className="relative flex items-center"
    >
      {children}
      <Tooltip isMobile={isMobileView} isHovered={showTooltip} longText={longText}>
        {hoverContent}
      </Tooltip>
    </div>
  )
}

const Tooltip = ({
  isHovered,
  longText,
  isMobile,
  children,
}: {
  isHovered: boolean
  longText: boolean
  isMobile: boolean
  children: React.ReactNode
}) => {
  if (isHovered) {
    return (
      <div
        className={`${longText ? "w-80 translate-x-[-95%] before:right-3" : "translate-x-[-50%] before:translate-x-[-50%] before:left-1/2 before:right-1/2"} ${isMobile ? "w-min text-wrap" : ""}
        absolute left-1/2 top-full
        z-50 hover-content px-2 py-1 text-white
        border border-solid border-borderGray
        bg-marginalGray-850 rounded-lg text-left text-sm 

        before:w-2 before:h-2 before:rotate-45 before:bg-marginalGray-850 before:absolute 
        before:z-[-1] before:-top-1 before:mx-auto
        before:border-l before:border-t before:border-borderGray
        `}
      >
        <data>{children}</data>
      </div>
    )
  } else {
    return null
  }
}

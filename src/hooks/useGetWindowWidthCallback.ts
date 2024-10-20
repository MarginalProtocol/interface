import { useState, useEffect } from "react"

const getWindowInnerWidth = () => window.innerWidth

export default function useGetWindowWidth() {
  const [windowInnerWidth, setWindowInnerWidth] = useState(getWindowInnerWidth())

  useEffect(() => {
    const onResize = () => {
      setWindowInnerWidth(getWindowInnerWidth())
    }

    window.addEventListener("resize", onResize)

    return () => {
      window.removeEventListener("resize", onResize)
    }
  }, [])

  return {
    width: windowInnerWidth,
    isBelowMedium: windowInnerWidth <= 900,
    isMobile: windowInnerWidth <= 768,
  }
}

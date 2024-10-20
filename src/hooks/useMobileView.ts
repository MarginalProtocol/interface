import { useState, useEffect } from "react"

export const useMobileView = () => {
  const [isMobileView, setIsMobileView] = useState(
    window.matchMedia("(max-width: 768px)").matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)")
    const handleResize = (e: MediaQueryListEvent) => setIsMobileView(e.matches)

    mediaQuery.addEventListener("change", handleResize)
    return () => mediaQuery.removeEventListener("change", handleResize)
  }, [])

  return { isMobileView }
}

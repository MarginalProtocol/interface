import { useState, useEffect, RefObject } from "react"

export const useContainerDimensions = (
  containerRef: RefObject<HTMLDivElement> | null,
  shouldMeasure: boolean,
) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const handleResize = () => {
      if (shouldMeasure && containerRef?.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        })
      }
    }

    if (shouldMeasure && containerRef?.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [containerRef, shouldMeasure])

  return dimensions
}

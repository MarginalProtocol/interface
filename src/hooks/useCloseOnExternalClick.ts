import { useEffect, RefObject } from "react"

const useCloseOnExternalClick = (ref: RefObject<HTMLElement>, onClose: () => void) => {
  const handleExternalOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onClose()
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleExternalOutside)
    return () => {
      document.removeEventListener("mousedown", handleExternalOutside)
    }
  }, [ref, onClose])
}

export default useCloseOnExternalClick

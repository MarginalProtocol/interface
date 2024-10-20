import { useState, useCallback } from "react"

export const useSettingsToggle = () => {
  const [showSettings, setShowSettings] = useState<boolean>(false)

  const onOpenSettings = useCallback(() => {
    setShowSettings(true)
  }, [])

  const onCloseSettings = useCallback(() => {
    setShowSettings(false)
  }, [])

  return { showSettings, onOpenSettings, onCloseSettings }
}

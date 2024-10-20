import { useState, useEffect } from "react"
import { getPositionState } from "../functions/getPositionState"
import { mergePositionDataWithState } from "../functions/mergePositionDataWithState"

export const usePositionData = (
  tokenId: string | undefined,
  positionQueryData: any,
  chainId: number,
) => {
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [position, setPosition] = useState<any>(undefined)

  const fetchPositionData = async () => {
    if (!tokenId || !positionQueryData) return

    try {
      const positionState = await getPositionState({ tokenId, chainId })
      const newPosition = mergePositionDataWithState(positionQueryData, positionState)
      setPosition(newPosition)
    } catch (error) {
      console.error("Error fetching position data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPositionData()
  }, [tokenId, positionQueryData])

  return { position, isLoading, fetchPositionData }
}

import { useState, useEffect } from "react"
import { getEscrowRewards } from "src/functions/getEscrowRewards"

export const useEscrowRewards = (chainId: number) => {
  const [escrowRewards, setEscrowRewards] = useState<string | null>(null)

  const fetchEscrowRewards = async () => {
    const rewards = await getEscrowRewards(chainId)
    setEscrowRewards(rewards)
  }

  useEffect(() => {
    fetchEscrowRewards()
    const interval = setInterval(fetchEscrowRewards, 30000) // 30000 ms = 30 seconds
    return () => {
      clearInterval(interval)
      setEscrowRewards(null)
    }
  }, [chainId])

  return { escrowRewards, fetchEscrowRewards }
}

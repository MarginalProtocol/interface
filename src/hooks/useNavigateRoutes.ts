import { useNavigate } from "react-router-dom"

/**
 * Hook that provides app route navigation
 * @returns route handler functions
 */
export const useNavigateRoutes = (): {
  onNavigateToPool: (poolAddress: string) => void
  onNavigateToStake: (poolAddress: string) => void
  onNavigateToUnstake: (poolAddress: string) => void
  onNavigateToAddLiquidity: (poolAddress: string) => void
  onNavigateToRemoveLiquidity: (poolAddress: string) => void
  onNavigateToClosePosition: (indexedId: string | undefined) => void
  onNavigateToManagePosition: (indexedId: string | undefined) => void
  onNavigateToPosition: (indexedId: string) => void
  onNavigateToPositions: () => void
  onNavigateToPools: () => void
  onNavigateToSwap: () => void
  onNavigateToTrade: () => void
} => {
  const navigate = useNavigate()

  const onNavigateToPool = (poolAddress: string) => {
    navigate(`/pools/${poolAddress}`)
  }
  const onNavigateToStake = (poolAddress: string) => {
    navigate(`/pools/stake/${poolAddress}`)
  }
  const onNavigateToUnstake = (poolAddress: string) => {
    navigate(`/pools/unstake/${poolAddress}`)
  }

  const onNavigateToAddLiquidity = (poolAddress: string) => {
    navigate(`/pools/liquidity/add/${poolAddress}`)
  }

  const onNavigateToRemoveLiquidity = (poolAddress: string) => {
    navigate(`/pools/liquidity/remove/${poolAddress}`)
  }

  const onNavigateToClosePosition = (indexedId: string | undefined) => {
    navigate(`/positions/position/close/${indexedId}`)
  }

  const onNavigateToManagePosition = (indexedId: string | undefined) => {
    navigate(`/positions/position/manage/${indexedId}`)
  }

  const onNavigateToPosition = (indexedId: string) => {
    navigate(`/positions/position/${indexedId}`)
  }

  const onNavigateToPositions = () => {
    navigate("/positions")
  }

  const onNavigateToPools = () => {
    navigate("/pools")
  }

  const onNavigateToSwap = () => {
    navigate("/swap")
  }
  const onNavigateToTrade = () => {
    navigate("/")
  }

  return {
    onNavigateToPool,
    onNavigateToStake,
    onNavigateToUnstake,
    onNavigateToAddLiquidity,
    onNavigateToRemoveLiquidity,
    onNavigateToManagePosition,
    onNavigateToClosePosition,
    onNavigateToPosition,
    onNavigateToPositions,
    onNavigateToPools,
    onNavigateToSwap,
    onNavigateToTrade,
  }
}

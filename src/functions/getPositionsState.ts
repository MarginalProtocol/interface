import _ from "lodash"
import { readContracts } from "@wagmi/core"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "../constants/addresses"
import nftPositionManagerAbi from "../abis/MarginalV1NonfungiblePositionManager.json"
import { PoolData } from "../types"

const createContractRead = (tokenId: number, chainId: number) => {
  return {
    address: V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    abi: nftPositionManagerAbi,
    functionName: "positions",
    args: [tokenId],
  }
}

export const getPositionsState = async ({
  tokenIds,
  chainId,
}: {
  tokenIds: string[]
  chainId: number
}): Promise<[] | PositionsState[]> => {
  let contracts: any[] = []

  tokenIds.forEach((tokenId) => {
    if (!_.isEmpty(tokenId)) {
      contracts.push(createContractRead(Number(tokenId), chainId))
    }
  })

  const data = await readContracts({
    contracts: contracts,
  })

  const states: any = !_.isEmpty(data) ? data : []

  return states?.map((state: any, index: number) => {
    const positionState = state?.result

    if (!positionState) return null

    return {
      tokenId: tokenIds[index],
      pool: positionState[0],
      positionId: positionState[1],
      zeroForOne: positionState[2],
      size: positionState[3],
      debt: positionState[4],
      margin: positionState[5],
      safeMarginMinimum: positionState[6],
      liquidated: positionState[7],
      safe: positionState[8],
      rewards: positionState[9],
    }
  })
}

export interface PositionsState {
  tokenId: string | number
  positionId: number
  zeroForOne: boolean
  size: bigint
  debt: bigint
  initialMargin?: bigint
  margin: bigint
  marginAmountOut?: bigint
  safeMarginMinimum: bigint
  liquidated: boolean
  safe: boolean
  rewards: bigint
  pool: PoolData
  isClosed?: boolean
  isLiquidated?: boolean
}

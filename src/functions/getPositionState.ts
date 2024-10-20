import _ from "lodash"
import { Address, readContract } from "@wagmi/core"
import nftPositionManagerAbi from "../abis/MarginalV1NonfungiblePositionManager.json"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "../constants/addresses"

export const getPositionState = async ({
  tokenId,
  chainId,
}: {
  tokenId: string
  chainId: number
}) => {
  const data = await readContract({
    address: V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    abi: nftPositionManagerAbi,
    functionName: "positions",
    args: [tokenId],
  })

  const state: any = !_.isEmpty(data) ? data : []

  return {
    poolAddress: state[0],
    positionId: state[1],
    zeroForOne: state[2],
    size: state[3],
    debt: state[4],
    margin: state[5],
    safeMarginMinimum: state[6],
    liquidated: state[7],
    safe: state[8],
    rewards: state[9],
  }
}

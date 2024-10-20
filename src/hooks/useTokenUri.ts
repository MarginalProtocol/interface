import _ from "lodash"
import { useContractRead, Address } from "wagmi"
import { V1_NFT_POSITION_MANAGER_ADDRESS } from "../constants/addresses"
import MarginalV1NonfungiblePositionManagerAbi from "../abis/MarginalV1NonfungiblePositionManager.json"
import { isListDefined } from "../utils/isListDefined"

export const useTokenUri = (tokenId: string | undefined, chainId: number) => {
  const isValidProps = isListDefined([tokenId])

  const { data, isError, isLoading } = useContractRead({
    address: V1_NFT_POSITION_MANAGER_ADDRESS[chainId],
    abi: MarginalV1NonfungiblePositionManagerAbi,
    args: [tokenId],
    functionName: "tokenURI",
    enabled: isValidProps,
  })

  let decodedUri

  if (_.isString(data)) {
    const tokenURI = data

    const STARTS_WITH = "data:application/json;base64,"

    decodedUri = JSON.parse(atob(tokenURI.slice(STARTS_WITH.length)))
  }

  return decodedUri
}

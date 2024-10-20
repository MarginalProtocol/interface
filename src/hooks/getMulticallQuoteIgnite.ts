import _ from "lodash"
import { Address, readContracts } from "wagmi"
import marginalV1QuoterAbi from "../abis/MarginalV1Quoter.json"
import { IgniteParams } from "../functions/constructQuoteIgniteParams"
import { constructIgniteParams } from "../functions/constructQuoteIgniteParams"

const createContractRead = (
  quoterAddress: Address,
  igniteParams: IgniteParams | null,
) => {
  return {
    address: quoterAddress,
    abi: marginalV1QuoterAbi,
    functionName: "quoteIgnite",
    args: [igniteParams],
  }
}

export const getMulticallQuoteIgnite = async (
  ownerAddress: Address | undefined,
  quoterAddress: Address,
  positions: any[],
): Promise<any[]> => {
  if (!ownerAddress) return []

  const contracts: any[] = positions.map((position: any) => {
    const igniteParams = constructIgniteParams(
      position?.pool?.token0,
      position?.pool?.token1,
      position?.pool?.maintenance,
      position?.pool?.oracle,
      position?.tokenId,
      "0",
      ownerAddress,
      undefined,
      "0",
    )
    return createContractRead(quoterAddress, igniteParams)
  })

  const data = await readContracts({
    contracts: contracts,
  })

  const results: any = !_.isEmpty(data) ? data : []

  return results?.map((data: any, index: number) => {
    const quote = data?.result

    return {
      ...positions[index],
      quotedMarginAmountOut: quote ? quote[0] : null,
      quotedRewards: quote ? quote[1] : null,
    }
  })
}

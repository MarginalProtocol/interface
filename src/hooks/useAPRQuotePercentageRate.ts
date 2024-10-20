import _ from "lodash"
import { useContractReads, Address } from "wagmi"
import { V1_APR_ADDRESS } from "../constants/addresses"
import marginalV1APRAbi from "../abis/MarginalV1APR.json"

const createContractRead = (
  stakingToken: Address,
  rewardsToken: Address,
  rewardsPoolWithWETH9: Address,
  duration: number,
  chainId: number,
) => {
  return {
    address: V1_APR_ADDRESS[chainId],
    abi: marginalV1APRAbi,
    functionName: "quotePercentageRate",
    args: [stakingToken, rewardsToken, rewardsPoolWithWETH9, duration],
  }
}

export const useAPRQuotePercentageRate = (
  stakingToken: Address,
  rewardsToken: Address,
  rewardsPoolWithWETH9: Address,
  duration: number,
  chainId: number,
) => {
  let contracts: any[] = []

  if (stakingToken && rewardsToken && rewardsPoolWithWETH9 && duration && chainId) {
    contracts.push(
      createContractRead(
        stakingToken as Address,
        rewardsToken as Address,
        rewardsPoolWithWETH9 as Address,
        duration,
        chainId,
      ),
    )
  }

  const isEnabled = !_.isEmpty(contracts)

  const { data, isError, isLoading } = useContractReads({
    contracts: contracts,
    enabled: isEnabled,
  })

  return data?.[0]?.result as bigint
}

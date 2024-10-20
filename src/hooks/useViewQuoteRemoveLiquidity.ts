import _ from "lodash"
import { useState, useEffect } from "react"
import { BigNumberish } from "ethers"
import { Address, useContractRead } from "wagmi"
import { getContractError } from "./../utils/getContractError"
import marginalV1QuoterAbi from "../abis/MarginalV1Quoter.json"
import { RemoveLiquidityParams } from "../functions/constructRemoveLiquidityParams"

export const useViewQuoteRemoveLiquidity = (
  quoterAddress: Address,
  removeLiquidityParams: RemoveLiquidityParams | null,
) => {
  const [error, setError] = useState<any>(null)

  const isValidProps = !_.isNull(removeLiquidityParams) && !_.isNull(quoterAddress)

  const { data, isSuccess, isError, isLoading } = useContractRead({
    address: quoterAddress,
    abi: marginalV1QuoterAbi,
    functionName: "quoteRemoveLiquidity",
    args: [removeLiquidityParams],
    enabled: isValidProps,
    watch: true,
    onError(error: Error) {
      let contractError = getContractError(error, "quoteRemoveLiquidity")
      if (contractError) {
        setError(contractError)
      }
    },
    onSuccess(data) {
      setError(null)
    },
  })

  useEffect(() => {
    if (!isValidProps) {
      setError(null)
    }
  }, [isValidProps])

  const quote: any[] = _.isArray(data) ? data : []
  const isQuoteValid = !_.isEmpty(quote)

  let removeLiquidityQuote = null

  if (isQuoteValid) {
    removeLiquidityQuote = {
      liquidityDelta: quote[0],
      amount0: quote[1],
      amount1: quote[2],
      liquidityAfter: quote[3],
    }
  }

  return [removeLiquidityQuote, error]
}

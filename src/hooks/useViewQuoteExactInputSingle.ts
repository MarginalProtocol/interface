import { useContractRead } from "wagmi"
import _ from "lodash"
import { useState, useEffect } from "react"
import { Address } from "viem"
import { BigNumberish } from "ethers"
import { getContractError } from "./../utils/getContractError"
import marginalV1QuoterAbi from "../abis/MarginalV1Quoter.json"

export type ExactInputSingleParams = {
  tokenIn: string
  tokenOut: string
  maintenance: string
  oracle: string
  recipient: string
  deadline: BigNumberish
  amountIn: bigint
  amountOutMinimum: bigint
  sqrtPriceLimitX96: BigNumberish
}

export const useViewQuoteExactInputSingle = (
  quoterAddress: Address,
  exactInputSingleArgs: ExactInputSingleParams | null,
) => {
  const [error, setError] = useState<any>(null)

  const isValidProps = !_.isNull(exactInputSingleArgs)

  const { data, isSuccess, isError, isLoading } = useContractRead({
    address: quoterAddress,
    abi: marginalV1QuoterAbi,
    functionName: "quoteExactInputSingle",
    args: [exactInputSingleArgs],
    enabled: isValidProps,
    watch: true,
    onError(error: Error) {
      let contractError = getContractError(error, "quoteExactInputSingle")
      if (contractError) {
        setError(contractError)
      }
    },
  })

  useEffect(() => {
    if (!isValidProps) {
      setError(null)
    }
  }, [isValidProps])

  const quote: any[] = _.isArray(data) ? data : []
  const isQuoteValid = !_.isEmpty(quote)

  let exactInputSingleQuote = null

  if (isQuoteValid) {
    // TODO: Create transform function to apply
    exactInputSingleQuote = {
      amountOut: quote[0],
      liquidityAfter: quote[1],
      sqrtPriceX96After: quote[2],
    }
  }

  return [exactInputSingleQuote, error]
}

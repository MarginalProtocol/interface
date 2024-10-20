import _ from "lodash"
import { useState, useEffect } from "react"
import { BigNumberish } from "ethers"
import { Address, useContractRead } from "wagmi"
import { getContractError } from "./../utils/getContractError"
import marginalV1QuoterAbi from "../abis/MarginalV1Quoter.json"

export type AddLiquidityParams = {
  token0: string
  token1: string
  maintenance: string
  oracle: string
  recipient: string
  amount0Desired: bigint
  amount1Desired: bigint
  amount0Min: bigint
  amount1Min: bigint
  deadline: BigNumberish
}

export const useViewQuoteAddLiquidity = (
  quoterAddress: Address,
  addLiquidityParams: AddLiquidityParams | null,
) => {
  const [error, setError] = useState<any>(null)

  const isValidProps = !_.isNull(addLiquidityParams) && !_.isNull(quoterAddress)

  const { data, isSuccess, isError, isLoading } = useContractRead({
    address: quoterAddress,
    abi: marginalV1QuoterAbi,
    functionName: "quoteAddLiquidity",
    args: [addLiquidityParams],
    enabled: isValidProps,
    watch: true,
    onError(error: Error) {
      let contractError = getContractError(error, "quoteAddLiquidity")
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

  let addLiquidityQuote = null

  if (isQuoteValid) {
    addLiquidityQuote = {
      shares: quote[0],
      amount0: quote[1],
      amount1: quote[2],
      liquidityAfter: quote[3],
    }
  }

  return [addLiquidityQuote, error]
}

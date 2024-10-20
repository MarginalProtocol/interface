import _ from "lodash"
import { useState, useEffect } from "react"
import { Address, useContractRead } from "wagmi"
import { getContractError } from "src/utils/getContractError"
import marginalV1QuoterAbi from "src/abis/MarginalV1Quoter.json"
import { IgniteParams } from "src/functions/constructQuoteIgniteParams"
import { Token } from "src/types"
import { isWrappedGasToken } from "src/utils/isWrappedGasToken"

export const useViewQuoteIgnite = (
  quoterAddress: Address,
  igniteParams: IgniteParams | null,
  marginToken: Token | null,
  chainId: number,
) => {
  const [error, setError] = useState<any>(null)

  const isValidProps =
    !_.isNull(igniteParams) && !_.isNull(quoterAddress) && !_.isNull(marginToken)

  const { data, isSuccess, isError, isLoading } = useContractRead({
    address: quoterAddress,
    abi: marginalV1QuoterAbi,
    functionName: "quoteIgnite",
    args: [igniteParams],
    enabled: isValidProps,
    watch: true,
    onError(error: Error) {
      let contractError = getContractError(error, "quoteIgnite")
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

  let igniteQuote = null

  const isMarginTokenWeth = isWrappedGasToken(marginToken, chainId)

  if (isQuoteValid) {
    igniteQuote = {
      amountOut: isMarginTokenWeth ? quote[0] - quote[1] : quote[0],
      rewards: quote[1],
      liquidityAfter: quote[2],
      sqrtPriceX96After: quote[3],
      liquidityLockedAfter: quote[4],
    }
  }

  return [igniteQuote, error]
}

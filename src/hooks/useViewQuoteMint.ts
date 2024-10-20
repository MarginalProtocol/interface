import _ from "lodash"
import { useState, useEffect } from "react"
import { BigNumberish } from "ethers"
import { Address, useContractRead } from "wagmi"
import { getContractError } from "./../utils/getContractError"
import { isBlank } from "../utils/isBlank"
import { isOnlyZeroes } from "../utils/isOnlyZeroes"
import marginalV1QuoterAbi from "../abis/MarginalV1Quoter.json"

export type MintParams = {
  token0: string
  token1: string
  maintenance: BigNumberish
  oracle: string
  zeroForOne: boolean
  sizeDesired: bigint
  sizeMinimum: BigNumberish
  debtMaximum: BigNumberish
  amountInMaximum: BigNumberish
  sqrtPriceLimitX96: BigNumberish
  margin: bigint
  recipient: string
  deadline: BigNumberish
}

export type MintQuote = {
  size: BigNumberish
  debt: BigNumberish
  margin: BigNumberish
  safeMarginMinimum: BigNumberish
  fees: BigNumberish
  safe: boolean
  liquidityAfter: BigNumberish
  sqrtPriceX96After: BigNumberish
  liquidityLockedAfter: BigNumberish
}

export const useViewQuoteMint = (
  inputValue: string,
  quoterAddress: Address,
  quoteMintArgs: MintParams | null,
) => {
  const [error, setError] = useState<any>(null)

  const isValidProps = !_.isNull(quoteMintArgs)

  // TODO: Need to figure out better way to catch errors on Button
  const { data, isSuccess, isError, isLoading, refetch } = useContractRead({
    address: quoterAddress,
    abi: marginalV1QuoterAbi,
    functionName: "quoteMint",
    args: [quoteMintArgs],
    enabled: isValidProps,
    watch: true,
    onError(error: Error) {
      let contractError = getContractError(error, "quoteMint")
      if (contractError) {
        setError(contractError)
      }
    },
    onSuccess() {
      setError(null)
    },
  })

  useEffect(() => {
    if (isBlank(inputValue) || isOnlyZeroes(inputValue)) {
      setError(null)
    }
    if (!isValidProps) {
      setError(null)
    }
  }, [inputValue, isValidProps])

  const quote: any[] = _.isArray(data) ? data : []
  const isQuoteValid = !_.isEmpty(quote)

  let mintQuote = null

  if (isQuoteValid) {
    // TODO: Create transform function to apply
    mintQuote = {
      size: quote[0],
      debt: quote[1],
      margin: quote[2],
      safeMarginMinimum: quote[3],
      fees: quote[4],
      safe: quote[5],
      liquidityAfter: quote[6],
      sqrtPriceX96After: quote[7],
      liquidityLockedAfter: quote[8],
    }
  }

  return [mintQuote, error, refetch]
}

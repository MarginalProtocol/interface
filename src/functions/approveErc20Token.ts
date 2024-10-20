import {
  Address,
  erc20ABI,
  prepareWriteContract,
  waitForTransaction,
  writeContract,
} from "@wagmi/core"
import { TransactionReceipt } from "viem"

export const approveErc20Token = async ({
  amount,
  spenderAddress,
  tokenAddress,
}: {
  amount: bigint
  spenderAddress: Address
  tokenAddress: Address
}) => {
  const { request } = await prepareWriteContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [spenderAddress, amount],
  })

  const { hash } = await writeContract(request)

  return hash
}

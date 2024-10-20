import { isUndefined } from "lodash"
import JSBI from "jsbi"
import { createPublicClient, http } from "viem"
import { sepolia } from "@wagmi/core"
import { base, mainnet } from "viem/chains"
import { berachainTestnetbArtio } from "src/constants/extraWagmiChains"
import { ChainId } from "src/constants/chains"

const BLOCK_FEES: { [chainId: number]: string } = {
  [ChainId.SEPOLIA]: "40000000000",
  [ChainId.BASE]: "4000000000",
  [ChainId.BERACHAIN_BARTIO]: "4000000000",
  [ChainId.MAINNET]: "40000000000",
}

const PUBLIC_CHAINS: { [chainId: number]: any } = {
  [ChainId.SEPOLIA]: sepolia,
  [ChainId.BASE]: base,
  [ChainId.BERACHAIN_BARTIO]: berachainTestnetbArtio,
  [ChainId.MAINNET]: mainnet,
}

// rewards = 150000 * 2 * max(block.basefee, 40 * 1e9)
export const getEscrowRewards = async (chainId: number) => {
  const client = createPublicClient({
    chain: PUBLIC_CHAINS[chainId],
    transport: http(),
  })

  //@ts-ignore
  const { maxFeePerGas, maxPriorityFeePerGas } = await client.estimateFeesPerGas()

  const gasLiquidate = JSBI.BigInt("150000")

  const blockBaseFee = !isUndefined(maxFeePerGas)
    ? JSBI.BigInt(maxFeePerGas?.toString())
    : undefined

  const blockBaseFeeMin = JSBI.BigInt(BLOCK_FEES[chainId])

  let baseFee

  if (isUndefined(blockBaseFee)) return null

  if (JSBI.lessThan(blockBaseFeeMin, blockBaseFee)) {
    baseFee = blockBaseFee
  } else {
    baseFee = blockBaseFeeMin
  }

  const rewards = JSBI.multiply(gasLiquidate, baseFee)
  const rewardsWithPremium = JSBI.multiply(rewards, JSBI.BigInt("2"))

  return rewardsWithPremium.toString()
}

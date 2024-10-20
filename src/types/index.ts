export type Token = {
  address: string
  name?: string
  symbol?: string
  decimals: number
  isNative?: boolean
}

export type PoolData = {
  tokenPair: string
  poolAddress: string
  oracleAddress: string
  decimals: string
  maintenance: string
  token0: Token
  token1: Token
  factoryAddress: string
  stakePool: string
}

export type PoolState = {
  sqrtPriceX96: bigint
  totalPositions: number
  liquidity: bigint
  tick: bigint
  blockTimestamp: string
  tickCumulative: bigint
  feeProtocol: bigint
  initialized: boolean
}

import { getValidAddress } from "./../utils/getValidAddress"
import _ from "lodash"
import { Token, PoolData } from "../types"

export const useDerivePoolsFromToken = (token: Token | null, pools: PoolData[]) => {
  const isSelectedToken = !_.isNull(token)
  const hasPools = !_.isEmpty(pools)

  const isDeriveable = isSelectedToken && hasPools
  return isDeriveable
    ? pools.filter((pool: PoolData) => isPoolMatchingToken(pool, token))
    : []
}

const isPoolMatchingToken = (pool: PoolData, token: Token | null): boolean => {
  if (!token) {
    return false
  }

  return (
    getValidAddress(token.address) === getValidAddress(pool.token0.address) ||
    getValidAddress(token.address) === getValidAddress(pool.token1.address)
  )
}

export const useDerivePoolsFromTokens = (
  token0: Token | null,
  token1: Token | null,
  pools: PoolData[],
) => {
  const isSelectedToken0 = !_.isNull(token0)
  const isSelectedToken1 = !_.isNull(token1)
  const hasPools = !_.isEmpty(pools)

  const isDeriveable = isSelectedToken0 && isSelectedToken1 && hasPools
  return isDeriveable
    ? pools.filter((pool: PoolData) => isPoolMatchingTokens(pool, token0, token1))
    : []
}

const isPoolMatchingTokens = (pool: PoolData, tokenA: Token, tokenB: Token): boolean => {
  return (
    (getValidAddress(tokenA.address) === getValidAddress(pool.token0.address) &&
      getValidAddress(tokenB.address) === getValidAddress(pool.token1.address)) ||
    (getValidAddress(tokenA.address) === getValidAddress(pool.token1.address) &&
      getValidAddress(tokenB.address) === getValidAddress(pool.token0.address))
  )
}

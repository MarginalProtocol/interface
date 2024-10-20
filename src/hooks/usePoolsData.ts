import _ from "lodash"
import { usePoolsQuery } from "./usePoolsQuery"
import { Token, PoolData } from "../types"

export const usePoolsData = () => {
  const { pools, isLoading } = usePoolsQuery()
  const poolsData = useConstructedPoolsData(pools)
  const poolsDataByAddress = usePoolsDataByAddress(poolsData)
  const tokensFromPools = useTokensFromPools(poolsData)

  return {
    pools: poolsData,
    isLoading,
    poolsDataByAddress,
    tokensFromPools,
  }
}

const useTokensFromPools = (pools: PoolData[]): Token[] => {
  const tokenMap = new Map<string, Token>() // Use a Map to store tokens by tokenAddress
  pools.forEach((pool) => {
    const [token0, token1] = constructTokensDataFromPool(pool)

    // Add tokens to the map based on their tokenAddress
    tokenMap.set(token0.address, token0)
    tokenMap.set(token1.address, token1)
  })

  // Convert the Map values (unique tokens) back to an array
  return Array.from(tokenMap.values())
}

const useConstructedPoolsData = (pools: any[]): PoolData[] => {
  return pools?.map((pool: any) => constructPoolDataFromQuery(pool))
}

export type PoolsDataByAddress = {
  [address: string]: PoolData
}

const usePoolsDataByAddress = (pools: PoolData[]): PoolsDataByAddress => {
  const library: PoolsDataByAddress = {}
  pools.forEach((pool: PoolData) => {
    // const poolAddress = getValidAddress(pool.poolAddress)
    const poolAddress = pool.poolAddress
    if (poolAddress) {
      library[poolAddress] = pool
    }
  })
  return library
}

const constructPoolDataFromQuery = (pool: any): PoolData => {
  const [token0, token1] = constructTokensDataFromPool(pool)
  return {
    tokenPair: pool?.tokenPair,
    poolAddress: pool?.id,
    oracleAddress: pool?.oracle,
    maintenance: pool?.maintenance,
    decimals: pool?.decimals,
    token0: token0,
    token1: token1,
    factoryAddress: pool?.factory?.id,
    stakePool: pool?.stakePool?.id,
  }
}

export const constructTokensDataFromPool = (pool: PoolData): [Token, Token] => {
  const token0 = pool.token0
  const token1 = pool.token1
  return [token0, token1]
}

export const getPoolAddress = (poolAddress: string | undefined): string => {
  return _.isUndefined(poolAddress) ? "" : poolAddress
}

export const getPoolDataByAddress = (
  poolAddress: string,
  poolsDataByAddress: PoolsDataByAddress,
) => {
  return !_.isEmpty(poolsDataByAddress) ? poolsDataByAddress[poolAddress] : null
}

import { api } from "./api"
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never
}
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  BigDecimal: { input: any; output: any }
  BigInt: { input: any; output: any }
  Bytes: { input: any; output: any }
  Int8: { input: any; output: any }
  Timestamp: { input: any; output: any }
}

export type Adjust = {
  __typename?: "Adjust"
  id: Scalars["ID"]["output"]
  margin: Scalars["BigInt"]["output"]
  owner: Scalars["Bytes"]["output"]
  pool: Pool
  recipient: Scalars["Bytes"]["output"]
  timestamp: Scalars["BigInt"]["output"]
  token0: Token
  token1: Token
  transaction: Transaction
}

export type Adjust_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Adjust_Filter>>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  margin?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  margin_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_not?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<Adjust_Filter>>>
  owner?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  pool?: InputMaybe<Scalars["String"]["input"]>
  pool_?: InputMaybe<Pool_Filter>
  pool_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_gt?: InputMaybe<Scalars["String"]["input"]>
  pool_gte?: InputMaybe<Scalars["String"]["input"]>
  pool_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_lt?: InputMaybe<Scalars["String"]["input"]>
  pool_lte?: InputMaybe<Scalars["String"]["input"]>
  pool_not?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  recipient?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  recipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  token0?: InputMaybe<Scalars["String"]["input"]>
  token0_?: InputMaybe<Token_Filter>
  token0_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_gt?: InputMaybe<Scalars["String"]["input"]>
  token0_gte?: InputMaybe<Scalars["String"]["input"]>
  token0_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_lt?: InputMaybe<Scalars["String"]["input"]>
  token0_lte?: InputMaybe<Scalars["String"]["input"]>
  token0_not?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1?: InputMaybe<Scalars["String"]["input"]>
  token1_?: InputMaybe<Token_Filter>
  token1_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_gt?: InputMaybe<Scalars["String"]["input"]>
  token1_gte?: InputMaybe<Scalars["String"]["input"]>
  token1_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_lt?: InputMaybe<Scalars["String"]["input"]>
  token1_lte?: InputMaybe<Scalars["String"]["input"]>
  token1_not?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction?: InputMaybe<Scalars["String"]["input"]>
  transaction_?: InputMaybe<Transaction_Filter>
  transaction_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_gt?: InputMaybe<Scalars["String"]["input"]>
  transaction_gte?: InputMaybe<Scalars["String"]["input"]>
  transaction_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_lt?: InputMaybe<Scalars["String"]["input"]>
  transaction_lte?: InputMaybe<Scalars["String"]["input"]>
  transaction_not?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
}

export enum Adjust_OrderBy {
  Id = "id",
  Margin = "margin",
  Owner = "owner",
  Pool = "pool",
  PoolAddress = "pool__address",
  PoolCreatedAtBlockNumber = "pool__createdAtBlockNumber",
  PoolCreatedAtTimestamp = "pool__createdAtTimestamp",
  PoolDecimals = "pool__decimals",
  PoolFee = "pool__fee",
  PoolId = "pool__id",
  PoolLiquidityLocked = "pool__liquidityLocked",
  PoolMaintenance = "pool__maintenance",
  PoolOracle = "pool__oracle",
  PoolRewardPremium = "pool__rewardPremium",
  PoolTokenPair = "pool__tokenPair",
  PoolTxCount = "pool__txCount",
  Recipient = "recipient",
  Timestamp = "timestamp",
  Token0 = "token0",
  Token0Address = "token0__address",
  Token0Decimals = "token0__decimals",
  Token0Id = "token0__id",
  Token0Name = "token0__name",
  Token0Symbol = "token0__symbol",
  Token1 = "token1",
  Token1Address = "token1__address",
  Token1Decimals = "token1__decimals",
  Token1Id = "token1__id",
  Token1Name = "token1__name",
  Token1Symbol = "token1__symbol",
  Transaction = "transaction",
  TransactionBlockNumber = "transaction__blockNumber",
  TransactionGasLimit = "transaction__gasLimit",
  TransactionGasPrice = "transaction__gasPrice",
  TransactionId = "transaction__id",
  TransactionTimestamp = "transaction__timestamp",
}

export enum Aggregation_Interval {
  Day = "day",
  Hour = "hour",
}

export type BlockChangedFilter = {
  number_gte: Scalars["Int"]["input"]
}

export type Block_Height = {
  hash?: InputMaybe<Scalars["Bytes"]["input"]>
  number?: InputMaybe<Scalars["Int"]["input"]>
  number_gte?: InputMaybe<Scalars["Int"]["input"]>
}

export type Factory = {
  __typename?: "Factory"
  deployer: Scalars["ID"]["output"]
  id: Scalars["ID"]["output"]
  minCardinality: Scalars["BigInt"]["output"]
  owner: Scalars["ID"]["output"]
  poolCount: Scalars["BigInt"]["output"]
  pools: Array<Pool>
  txCount: Scalars["BigInt"]["output"]
  uniV3Factory: Scalars["ID"]["output"]
}

export type FactoryPoolsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Pool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  where?: InputMaybe<Pool_Filter>
}

export type Factory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Factory_Filter>>>
  deployer?: InputMaybe<Scalars["ID"]["input"]>
  deployer_gt?: InputMaybe<Scalars["ID"]["input"]>
  deployer_gte?: InputMaybe<Scalars["ID"]["input"]>
  deployer_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  deployer_lt?: InputMaybe<Scalars["ID"]["input"]>
  deployer_lte?: InputMaybe<Scalars["ID"]["input"]>
  deployer_not?: InputMaybe<Scalars["ID"]["input"]>
  deployer_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  minCardinality?: InputMaybe<Scalars["BigInt"]["input"]>
  minCardinality_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  minCardinality_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  minCardinality_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  minCardinality_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  minCardinality_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  minCardinality_not?: InputMaybe<Scalars["BigInt"]["input"]>
  minCardinality_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<Factory_Filter>>>
  owner?: InputMaybe<Scalars["ID"]["input"]>
  owner_gt?: InputMaybe<Scalars["ID"]["input"]>
  owner_gte?: InputMaybe<Scalars["ID"]["input"]>
  owner_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  owner_lt?: InputMaybe<Scalars["ID"]["input"]>
  owner_lte?: InputMaybe<Scalars["ID"]["input"]>
  owner_not?: InputMaybe<Scalars["ID"]["input"]>
  owner_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  poolCount?: InputMaybe<Scalars["BigInt"]["input"]>
  poolCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  poolCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  poolCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  poolCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  poolCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  poolCount_not?: InputMaybe<Scalars["BigInt"]["input"]>
  poolCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  pools_?: InputMaybe<Pool_Filter>
  txCount?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  txCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_not?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  uniV3Factory?: InputMaybe<Scalars["ID"]["input"]>
  uniV3Factory_gt?: InputMaybe<Scalars["ID"]["input"]>
  uniV3Factory_gte?: InputMaybe<Scalars["ID"]["input"]>
  uniV3Factory_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  uniV3Factory_lt?: InputMaybe<Scalars["ID"]["input"]>
  uniV3Factory_lte?: InputMaybe<Scalars["ID"]["input"]>
  uniV3Factory_not?: InputMaybe<Scalars["ID"]["input"]>
  uniV3Factory_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
}

export enum Factory_OrderBy {
  Deployer = "deployer",
  Id = "id",
  MinCardinality = "minCardinality",
  Owner = "owner",
  PoolCount = "poolCount",
  Pools = "pools",
  TxCount = "txCount",
  UniV3Factory = "uniV3Factory",
}

export type Liquidate = {
  __typename?: "Liquidate"
  id: Scalars["ID"]["output"]
  owner: Scalars["Bytes"]["output"]
  pool: Pool
  recipient: Scalars["Bytes"]["output"]
  rewards: Scalars["BigInt"]["output"]
  timestamp: Scalars["BigInt"]["output"]
  token0: Token
  token1: Token
  transaction: Transaction
}

export type Liquidate_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Liquidate_Filter>>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<Liquidate_Filter>>>
  owner?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  pool?: InputMaybe<Scalars["String"]["input"]>
  pool_?: InputMaybe<Pool_Filter>
  pool_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_gt?: InputMaybe<Scalars["String"]["input"]>
  pool_gte?: InputMaybe<Scalars["String"]["input"]>
  pool_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_lt?: InputMaybe<Scalars["String"]["input"]>
  pool_lte?: InputMaybe<Scalars["String"]["input"]>
  pool_not?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  recipient?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  recipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  rewards?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  rewards_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_not?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  token0?: InputMaybe<Scalars["String"]["input"]>
  token0_?: InputMaybe<Token_Filter>
  token0_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_gt?: InputMaybe<Scalars["String"]["input"]>
  token0_gte?: InputMaybe<Scalars["String"]["input"]>
  token0_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_lt?: InputMaybe<Scalars["String"]["input"]>
  token0_lte?: InputMaybe<Scalars["String"]["input"]>
  token0_not?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1?: InputMaybe<Scalars["String"]["input"]>
  token1_?: InputMaybe<Token_Filter>
  token1_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_gt?: InputMaybe<Scalars["String"]["input"]>
  token1_gte?: InputMaybe<Scalars["String"]["input"]>
  token1_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_lt?: InputMaybe<Scalars["String"]["input"]>
  token1_lte?: InputMaybe<Scalars["String"]["input"]>
  token1_not?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction?: InputMaybe<Scalars["String"]["input"]>
  transaction_?: InputMaybe<Transaction_Filter>
  transaction_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_gt?: InputMaybe<Scalars["String"]["input"]>
  transaction_gte?: InputMaybe<Scalars["String"]["input"]>
  transaction_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_lt?: InputMaybe<Scalars["String"]["input"]>
  transaction_lte?: InputMaybe<Scalars["String"]["input"]>
  transaction_not?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
}

export enum Liquidate_OrderBy {
  Id = "id",
  Owner = "owner",
  Pool = "pool",
  PoolAddress = "pool__address",
  PoolCreatedAtBlockNumber = "pool__createdAtBlockNumber",
  PoolCreatedAtTimestamp = "pool__createdAtTimestamp",
  PoolDecimals = "pool__decimals",
  PoolFee = "pool__fee",
  PoolId = "pool__id",
  PoolLiquidityLocked = "pool__liquidityLocked",
  PoolMaintenance = "pool__maintenance",
  PoolOracle = "pool__oracle",
  PoolRewardPremium = "pool__rewardPremium",
  PoolTokenPair = "pool__tokenPair",
  PoolTxCount = "pool__txCount",
  Recipient = "recipient",
  Rewards = "rewards",
  Timestamp = "timestamp",
  Token0 = "token0",
  Token0Address = "token0__address",
  Token0Decimals = "token0__decimals",
  Token0Id = "token0__id",
  Token0Name = "token0__name",
  Token0Symbol = "token0__symbol",
  Token1 = "token1",
  Token1Address = "token1__address",
  Token1Decimals = "token1__decimals",
  Token1Id = "token1__id",
  Token1Name = "token1__name",
  Token1Symbol = "token1__symbol",
  Transaction = "transaction",
  TransactionBlockNumber = "transaction__blockNumber",
  TransactionGasLimit = "transaction__gasLimit",
  TransactionGasPrice = "transaction__gasPrice",
  TransactionId = "transaction__id",
  TransactionTimestamp = "transaction__timestamp",
}

export type MultiRewardsFactory = {
  __typename?: "MultiRewardsFactory"
  id: Scalars["ID"]["output"]
  stakePools: Array<StakePool>
}

export type MultiRewardsFactoryStakePoolsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<StakePool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  where?: InputMaybe<StakePool_Filter>
}

export type MultiRewardsFactory_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<MultiRewardsFactory_Filter>>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<MultiRewardsFactory_Filter>>>
  stakePools_?: InputMaybe<StakePool_Filter>
}

export enum MultiRewardsFactory_OrderBy {
  Id = "id",
  StakePools = "stakePools",
}

export type Open = {
  __typename?: "Open"
  id: Scalars["ID"]["output"]
  margin: Scalars["BigInt"]["output"]
  owner: Scalars["Bytes"]["output"]
  pool: Pool
  sender: Scalars["Bytes"]["output"]
  timestamp: Scalars["BigInt"]["output"]
  token0: Token
  token1: Token
  transaction: Transaction
}

export type Open_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Open_Filter>>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  margin?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  margin_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_not?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<Open_Filter>>>
  owner?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  pool?: InputMaybe<Scalars["String"]["input"]>
  pool_?: InputMaybe<Pool_Filter>
  pool_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_gt?: InputMaybe<Scalars["String"]["input"]>
  pool_gte?: InputMaybe<Scalars["String"]["input"]>
  pool_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_lt?: InputMaybe<Scalars["String"]["input"]>
  pool_lte?: InputMaybe<Scalars["String"]["input"]>
  pool_not?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  sender?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  sender_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_not?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  sender_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  token0?: InputMaybe<Scalars["String"]["input"]>
  token0_?: InputMaybe<Token_Filter>
  token0_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_gt?: InputMaybe<Scalars["String"]["input"]>
  token0_gte?: InputMaybe<Scalars["String"]["input"]>
  token0_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_lt?: InputMaybe<Scalars["String"]["input"]>
  token0_lte?: InputMaybe<Scalars["String"]["input"]>
  token0_not?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1?: InputMaybe<Scalars["String"]["input"]>
  token1_?: InputMaybe<Token_Filter>
  token1_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_gt?: InputMaybe<Scalars["String"]["input"]>
  token1_gte?: InputMaybe<Scalars["String"]["input"]>
  token1_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_lt?: InputMaybe<Scalars["String"]["input"]>
  token1_lte?: InputMaybe<Scalars["String"]["input"]>
  token1_not?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction?: InputMaybe<Scalars["String"]["input"]>
  transaction_?: InputMaybe<Transaction_Filter>
  transaction_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_gt?: InputMaybe<Scalars["String"]["input"]>
  transaction_gte?: InputMaybe<Scalars["String"]["input"]>
  transaction_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_lt?: InputMaybe<Scalars["String"]["input"]>
  transaction_lte?: InputMaybe<Scalars["String"]["input"]>
  transaction_not?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
}

export enum Open_OrderBy {
  Id = "id",
  Margin = "margin",
  Owner = "owner",
  Pool = "pool",
  PoolAddress = "pool__address",
  PoolCreatedAtBlockNumber = "pool__createdAtBlockNumber",
  PoolCreatedAtTimestamp = "pool__createdAtTimestamp",
  PoolDecimals = "pool__decimals",
  PoolFee = "pool__fee",
  PoolId = "pool__id",
  PoolLiquidityLocked = "pool__liquidityLocked",
  PoolMaintenance = "pool__maintenance",
  PoolOracle = "pool__oracle",
  PoolRewardPremium = "pool__rewardPremium",
  PoolTokenPair = "pool__tokenPair",
  PoolTxCount = "pool__txCount",
  Sender = "sender",
  Timestamp = "timestamp",
  Token0 = "token0",
  Token0Address = "token0__address",
  Token0Decimals = "token0__decimals",
  Token0Id = "token0__id",
  Token0Name = "token0__name",
  Token0Symbol = "token0__symbol",
  Token1 = "token1",
  Token1Address = "token1__address",
  Token1Decimals = "token1__decimals",
  Token1Id = "token1__id",
  Token1Name = "token1__name",
  Token1Symbol = "token1__symbol",
  Transaction = "transaction",
  TransactionBlockNumber = "transaction__blockNumber",
  TransactionGasLimit = "transaction__gasLimit",
  TransactionGasPrice = "transaction__gasPrice",
  TransactionId = "transaction__id",
  TransactionTimestamp = "transaction__timestamp",
}

/** Defines the order direction, either ascending or descending */
export enum OrderDirection {
  Asc = "asc",
  Desc = "desc",
}

export type Pool = {
  __typename?: "Pool"
  address: Scalars["Bytes"]["output"]
  createdAtBlockNumber: Scalars["BigInt"]["output"]
  createdAtTimestamp: Scalars["BigInt"]["output"]
  decimals: Scalars["BigInt"]["output"]
  factory: Factory
  fee: Scalars["BigInt"]["output"]
  id: Scalars["ID"]["output"]
  liquidityLocked: Scalars["BigInt"]["output"]
  maintenance: Scalars["BigInt"]["output"]
  oracle: Scalars["ID"]["output"]
  positions: Array<Position>
  rewardPremium: Scalars["BigInt"]["output"]
  stakePool?: Maybe<StakePool>
  token0: Token
  token1: Token
  tokenPair: Scalars["String"]["output"]
  txCount: Scalars["BigInt"]["output"]
}

export type PoolPositionsArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Position_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  where?: InputMaybe<Position_Filter>
}

export type Pool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  address?: InputMaybe<Scalars["Bytes"]["input"]>
  address_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  address_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  address_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  address_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  address_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  address_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  address_not?: InputMaybe<Scalars["Bytes"]["input"]>
  address_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  address_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  and?: InputMaybe<Array<InputMaybe<Pool_Filter>>>
  createdAtBlockNumber?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtBlockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtBlockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtBlockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  createdAtBlockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtBlockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtBlockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtBlockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  createdAtTimestamp?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtTimestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtTimestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtTimestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  createdAtTimestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtTimestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtTimestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>
  createdAtTimestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  decimals?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  decimals_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_not?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  factory?: InputMaybe<Scalars["String"]["input"]>
  factory_?: InputMaybe<Factory_Filter>
  factory_contains?: InputMaybe<Scalars["String"]["input"]>
  factory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  factory_ends_with?: InputMaybe<Scalars["String"]["input"]>
  factory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  factory_gt?: InputMaybe<Scalars["String"]["input"]>
  factory_gte?: InputMaybe<Scalars["String"]["input"]>
  factory_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  factory_lt?: InputMaybe<Scalars["String"]["input"]>
  factory_lte?: InputMaybe<Scalars["String"]["input"]>
  factory_not?: InputMaybe<Scalars["String"]["input"]>
  factory_not_contains?: InputMaybe<Scalars["String"]["input"]>
  factory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  factory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  factory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  factory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  factory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  factory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  factory_starts_with?: InputMaybe<Scalars["String"]["input"]>
  factory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  fee?: InputMaybe<Scalars["BigInt"]["input"]>
  fee_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  fee_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  fee_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  fee_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  fee_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  fee_not?: InputMaybe<Scalars["BigInt"]["input"]>
  fee_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  liquidityLocked?: InputMaybe<Scalars["BigInt"]["input"]>
  liquidityLocked_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  liquidityLocked_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  liquidityLocked_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  liquidityLocked_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  liquidityLocked_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  liquidityLocked_not?: InputMaybe<Scalars["BigInt"]["input"]>
  liquidityLocked_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  maintenance?: InputMaybe<Scalars["BigInt"]["input"]>
  maintenance_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  maintenance_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  maintenance_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  maintenance_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  maintenance_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  maintenance_not?: InputMaybe<Scalars["BigInt"]["input"]>
  maintenance_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<Pool_Filter>>>
  oracle?: InputMaybe<Scalars["ID"]["input"]>
  oracle_gt?: InputMaybe<Scalars["ID"]["input"]>
  oracle_gte?: InputMaybe<Scalars["ID"]["input"]>
  oracle_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  oracle_lt?: InputMaybe<Scalars["ID"]["input"]>
  oracle_lte?: InputMaybe<Scalars["ID"]["input"]>
  oracle_not?: InputMaybe<Scalars["ID"]["input"]>
  oracle_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  positions_?: InputMaybe<Position_Filter>
  rewardPremium?: InputMaybe<Scalars["BigInt"]["input"]>
  rewardPremium_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewardPremium_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewardPremium_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  rewardPremium_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewardPremium_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewardPremium_not?: InputMaybe<Scalars["BigInt"]["input"]>
  rewardPremium_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  stakePool?: InputMaybe<Scalars["String"]["input"]>
  stakePool_?: InputMaybe<StakePool_Filter>
  stakePool_contains?: InputMaybe<Scalars["String"]["input"]>
  stakePool_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  stakePool_ends_with?: InputMaybe<Scalars["String"]["input"]>
  stakePool_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  stakePool_gt?: InputMaybe<Scalars["String"]["input"]>
  stakePool_gte?: InputMaybe<Scalars["String"]["input"]>
  stakePool_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  stakePool_lt?: InputMaybe<Scalars["String"]["input"]>
  stakePool_lte?: InputMaybe<Scalars["String"]["input"]>
  stakePool_not?: InputMaybe<Scalars["String"]["input"]>
  stakePool_not_contains?: InputMaybe<Scalars["String"]["input"]>
  stakePool_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  stakePool_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  stakePool_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  stakePool_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  stakePool_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  stakePool_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  stakePool_starts_with?: InputMaybe<Scalars["String"]["input"]>
  stakePool_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0?: InputMaybe<Scalars["String"]["input"]>
  token0_?: InputMaybe<Token_Filter>
  token0_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_gt?: InputMaybe<Scalars["String"]["input"]>
  token0_gte?: InputMaybe<Scalars["String"]["input"]>
  token0_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_lt?: InputMaybe<Scalars["String"]["input"]>
  token0_lte?: InputMaybe<Scalars["String"]["input"]>
  token0_not?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1?: InputMaybe<Scalars["String"]["input"]>
  token1_?: InputMaybe<Token_Filter>
  token1_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_gt?: InputMaybe<Scalars["String"]["input"]>
  token1_gte?: InputMaybe<Scalars["String"]["input"]>
  token1_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_lt?: InputMaybe<Scalars["String"]["input"]>
  token1_lte?: InputMaybe<Scalars["String"]["input"]>
  token1_not?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenPair?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_contains?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_ends_with?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_gt?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_gte?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  tokenPair_lt?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_lte?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_not?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_not_contains?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  tokenPair_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_starts_with?: InputMaybe<Scalars["String"]["input"]>
  tokenPair_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  txCount?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  txCount_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_not?: InputMaybe<Scalars["BigInt"]["input"]>
  txCount_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
}

export enum Pool_OrderBy {
  Address = "address",
  CreatedAtBlockNumber = "createdAtBlockNumber",
  CreatedAtTimestamp = "createdAtTimestamp",
  Decimals = "decimals",
  Factory = "factory",
  FactoryDeployer = "factory__deployer",
  FactoryId = "factory__id",
  FactoryMinCardinality = "factory__minCardinality",
  FactoryOwner = "factory__owner",
  FactoryPoolCount = "factory__poolCount",
  FactoryTxCount = "factory__txCount",
  FactoryUniV3Factory = "factory__uniV3Factory",
  Fee = "fee",
  Id = "id",
  LiquidityLocked = "liquidityLocked",
  Maintenance = "maintenance",
  Oracle = "oracle",
  Positions = "positions",
  RewardPremium = "rewardPremium",
  StakePool = "stakePool",
  StakePoolId = "stakePool__id",
  StakePoolStakeToken = "stakePool__stakeToken",
  Token0 = "token0",
  Token0Address = "token0__address",
  Token0Decimals = "token0__decimals",
  Token0Id = "token0__id",
  Token0Name = "token0__name",
  Token0Symbol = "token0__symbol",
  Token1 = "token1",
  Token1Address = "token1__address",
  Token1Decimals = "token1__decimals",
  Token1Id = "token1__id",
  Token1Name = "token1__name",
  Token1Symbol = "token1__symbol",
  TokenPair = "tokenPair",
  TxCount = "txCount",
}

export type Position = {
  __typename?: "Position"
  blockNumber?: Maybe<Scalars["BigInt"]["output"]>
  id: Scalars["ID"]["output"]
  initialMargin?: Maybe<Scalars["BigInt"]["output"]>
  initialSqrtPriceX96After?: Maybe<Scalars["BigInt"]["output"]>
  isClosed: Scalars["Boolean"]["output"]
  isLiquidated: Scalars["Boolean"]["output"]
  isSettled: Scalars["Boolean"]["output"]
  margin?: Maybe<Scalars["BigInt"]["output"]>
  marginAmountOut?: Maybe<Scalars["BigInt"]["output"]>
  owner: Scalars["ID"]["output"]
  pool: Pool
  positionId: Scalars["String"]["output"]
  rewards?: Maybe<Scalars["BigInt"]["output"]>
  timestamp?: Maybe<Scalars["BigInt"]["output"]>
  tokenId?: Maybe<Scalars["String"]["output"]>
  transaction: Transaction
  zeroForOne?: Maybe<Scalars["Boolean"]["output"]>
}

export type Position_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Position_Filter>>>
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  initialMargin?: InputMaybe<Scalars["BigInt"]["input"]>
  initialMargin_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  initialMargin_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  initialMargin_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  initialMargin_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  initialMargin_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  initialMargin_not?: InputMaybe<Scalars["BigInt"]["input"]>
  initialMargin_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  initialSqrtPriceX96After?: InputMaybe<Scalars["BigInt"]["input"]>
  initialSqrtPriceX96After_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  initialSqrtPriceX96After_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  initialSqrtPriceX96After_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  initialSqrtPriceX96After_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  initialSqrtPriceX96After_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  initialSqrtPriceX96After_not?: InputMaybe<Scalars["BigInt"]["input"]>
  initialSqrtPriceX96After_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  isClosed?: InputMaybe<Scalars["Boolean"]["input"]>
  isClosed_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  isClosed_not?: InputMaybe<Scalars["Boolean"]["input"]>
  isClosed_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  isLiquidated?: InputMaybe<Scalars["Boolean"]["input"]>
  isLiquidated_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  isLiquidated_not?: InputMaybe<Scalars["Boolean"]["input"]>
  isLiquidated_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  isSettled?: InputMaybe<Scalars["Boolean"]["input"]>
  isSettled_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  isSettled_not?: InputMaybe<Scalars["Boolean"]["input"]>
  isSettled_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  margin?: InputMaybe<Scalars["BigInt"]["input"]>
  marginAmountOut?: InputMaybe<Scalars["BigInt"]["input"]>
  marginAmountOut_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  marginAmountOut_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  marginAmountOut_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  marginAmountOut_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  marginAmountOut_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  marginAmountOut_not?: InputMaybe<Scalars["BigInt"]["input"]>
  marginAmountOut_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  margin_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  margin_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_not?: InputMaybe<Scalars["BigInt"]["input"]>
  margin_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<Position_Filter>>>
  owner?: InputMaybe<Scalars["ID"]["input"]>
  owner_gt?: InputMaybe<Scalars["ID"]["input"]>
  owner_gte?: InputMaybe<Scalars["ID"]["input"]>
  owner_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  owner_lt?: InputMaybe<Scalars["ID"]["input"]>
  owner_lte?: InputMaybe<Scalars["ID"]["input"]>
  owner_not?: InputMaybe<Scalars["ID"]["input"]>
  owner_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  pool?: InputMaybe<Scalars["String"]["input"]>
  pool_?: InputMaybe<Pool_Filter>
  pool_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_gt?: InputMaybe<Scalars["String"]["input"]>
  pool_gte?: InputMaybe<Scalars["String"]["input"]>
  pool_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_lt?: InputMaybe<Scalars["String"]["input"]>
  pool_lte?: InputMaybe<Scalars["String"]["input"]>
  pool_not?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId?: InputMaybe<Scalars["String"]["input"]>
  positionId_contains?: InputMaybe<Scalars["String"]["input"]>
  positionId_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_ends_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_gt?: InputMaybe<Scalars["String"]["input"]>
  positionId_gte?: InputMaybe<Scalars["String"]["input"]>
  positionId_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  positionId_lt?: InputMaybe<Scalars["String"]["input"]>
  positionId_lte?: InputMaybe<Scalars["String"]["input"]>
  positionId_not?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_contains?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  positionId_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_starts_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  rewards?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  rewards_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_not?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  tokenId?: InputMaybe<Scalars["String"]["input"]>
  tokenId_contains?: InputMaybe<Scalars["String"]["input"]>
  tokenId_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_ends_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_gt?: InputMaybe<Scalars["String"]["input"]>
  tokenId_gte?: InputMaybe<Scalars["String"]["input"]>
  tokenId_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  tokenId_lt?: InputMaybe<Scalars["String"]["input"]>
  tokenId_lte?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_contains?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  tokenId_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_starts_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction?: InputMaybe<Scalars["String"]["input"]>
  transaction_?: InputMaybe<Transaction_Filter>
  transaction_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_gt?: InputMaybe<Scalars["String"]["input"]>
  transaction_gte?: InputMaybe<Scalars["String"]["input"]>
  transaction_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_lt?: InputMaybe<Scalars["String"]["input"]>
  transaction_lte?: InputMaybe<Scalars["String"]["input"]>
  transaction_not?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  zeroForOne?: InputMaybe<Scalars["Boolean"]["input"]>
  zeroForOne_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
  zeroForOne_not?: InputMaybe<Scalars["Boolean"]["input"]>
  zeroForOne_not_in?: InputMaybe<Array<Scalars["Boolean"]["input"]>>
}

export enum Position_OrderBy {
  BlockNumber = "blockNumber",
  Id = "id",
  InitialMargin = "initialMargin",
  InitialSqrtPriceX96After = "initialSqrtPriceX96After",
  IsClosed = "isClosed",
  IsLiquidated = "isLiquidated",
  IsSettled = "isSettled",
  Margin = "margin",
  MarginAmountOut = "marginAmountOut",
  Owner = "owner",
  Pool = "pool",
  PoolAddress = "pool__address",
  PoolCreatedAtBlockNumber = "pool__createdAtBlockNumber",
  PoolCreatedAtTimestamp = "pool__createdAtTimestamp",
  PoolDecimals = "pool__decimals",
  PoolFee = "pool__fee",
  PoolId = "pool__id",
  PoolLiquidityLocked = "pool__liquidityLocked",
  PoolMaintenance = "pool__maintenance",
  PoolOracle = "pool__oracle",
  PoolRewardPremium = "pool__rewardPremium",
  PoolTokenPair = "pool__tokenPair",
  PoolTxCount = "pool__txCount",
  PositionId = "positionId",
  Rewards = "rewards",
  Timestamp = "timestamp",
  TokenId = "tokenId",
  Transaction = "transaction",
  TransactionBlockNumber = "transaction__blockNumber",
  TransactionGasLimit = "transaction__gasLimit",
  TransactionGasPrice = "transaction__gasPrice",
  TransactionId = "transaction__id",
  TransactionTimestamp = "transaction__timestamp",
  ZeroForOne = "zeroForOne",
}

export type Query = {
  __typename?: "Query"
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>
  adjust?: Maybe<Adjust>
  adjusts: Array<Adjust>
  factories: Array<Factory>
  factory?: Maybe<Factory>
  liquidate?: Maybe<Liquidate>
  liquidates: Array<Liquidate>
  multiRewardsFactories: Array<MultiRewardsFactory>
  multiRewardsFactory?: Maybe<MultiRewardsFactory>
  open?: Maybe<Open>
  opens: Array<Open>
  pool?: Maybe<Pool>
  pools: Array<Pool>
  position?: Maybe<Position>
  positions: Array<Position>
  settle?: Maybe<Settle>
  settles: Array<Settle>
  stakePool?: Maybe<StakePool>
  stakePools: Array<StakePool>
  token?: Maybe<Token>
  tokenPositionMapping?: Maybe<TokenPositionMapping>
  tokenPositionMappings: Array<TokenPositionMapping>
  tokens: Array<Token>
  transaction?: Maybe<Transaction>
  transactions: Array<Transaction>
}

export type Query_MetaArgs = {
  block?: InputMaybe<Block_Height>
}

export type QueryAdjustArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryAdjustsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Adjust_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Adjust_Filter>
}

export type QueryFactoriesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Factory_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Factory_Filter>
}

export type QueryFactoryArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryLiquidateArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryLiquidatesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Liquidate_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Liquidate_Filter>
}

export type QueryMultiRewardsFactoriesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<MultiRewardsFactory_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<MultiRewardsFactory_Filter>
}

export type QueryMultiRewardsFactoryArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryOpenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryOpensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Open_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Open_Filter>
}

export type QueryPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Pool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Pool_Filter>
}

export type QueryPositionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryPositionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Position_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Position_Filter>
}

export type QuerySettleArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QuerySettlesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Settle_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Settle_Filter>
}

export type QueryStakePoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryStakePoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<StakePool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<StakePool_Filter>
}

export type QueryTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryTokenPositionMappingArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryTokenPositionMappingsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<TokenPositionMapping_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<TokenPositionMapping_Filter>
}

export type QueryTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Token_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Token_Filter>
}

export type QueryTransactionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type QueryTransactionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Transaction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Transaction_Filter>
}

export type Settle = {
  __typename?: "Settle"
  id: Scalars["ID"]["output"]
  owner: Scalars["Bytes"]["output"]
  pool: Pool
  recipient: Scalars["Bytes"]["output"]
  rewards: Scalars["BigInt"]["output"]
  timestamp: Scalars["BigInt"]["output"]
  token0: Token
  token1: Token
  transaction: Transaction
}

export type Settle_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<Settle_Filter>>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<Settle_Filter>>>
  owner?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  owner_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  owner_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  pool?: InputMaybe<Scalars["String"]["input"]>
  pool_?: InputMaybe<Pool_Filter>
  pool_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_gt?: InputMaybe<Scalars["String"]["input"]>
  pool_gte?: InputMaybe<Scalars["String"]["input"]>
  pool_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_lt?: InputMaybe<Scalars["String"]["input"]>
  pool_lte?: InputMaybe<Scalars["String"]["input"]>
  pool_not?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains?: InputMaybe<Scalars["String"]["input"]>
  pool_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  pool_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with?: InputMaybe<Scalars["String"]["input"]>
  pool_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  recipient?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  recipient_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  recipient_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  rewards?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  rewards_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_not?: InputMaybe<Scalars["BigInt"]["input"]>
  rewards_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  token0?: InputMaybe<Scalars["String"]["input"]>
  token0_?: InputMaybe<Token_Filter>
  token0_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_gt?: InputMaybe<Scalars["String"]["input"]>
  token0_gte?: InputMaybe<Scalars["String"]["input"]>
  token0_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_lt?: InputMaybe<Scalars["String"]["input"]>
  token0_lte?: InputMaybe<Scalars["String"]["input"]>
  token0_not?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token0_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token0_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token0_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1?: InputMaybe<Scalars["String"]["input"]>
  token1_?: InputMaybe<Token_Filter>
  token1_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_gt?: InputMaybe<Scalars["String"]["input"]>
  token1_gte?: InputMaybe<Scalars["String"]["input"]>
  token1_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_lt?: InputMaybe<Scalars["String"]["input"]>
  token1_lte?: InputMaybe<Scalars["String"]["input"]>
  token1_not?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains?: InputMaybe<Scalars["String"]["input"]>
  token1_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  token1_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with?: InputMaybe<Scalars["String"]["input"]>
  token1_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction?: InputMaybe<Scalars["String"]["input"]>
  transaction_?: InputMaybe<Transaction_Filter>
  transaction_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_gt?: InputMaybe<Scalars["String"]["input"]>
  transaction_gte?: InputMaybe<Scalars["String"]["input"]>
  transaction_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_lt?: InputMaybe<Scalars["String"]["input"]>
  transaction_lte?: InputMaybe<Scalars["String"]["input"]>
  transaction_not?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  transaction_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with?: InputMaybe<Scalars["String"]["input"]>
  transaction_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
}

export enum Settle_OrderBy {
  Id = "id",
  Owner = "owner",
  Pool = "pool",
  PoolAddress = "pool__address",
  PoolCreatedAtBlockNumber = "pool__createdAtBlockNumber",
  PoolCreatedAtTimestamp = "pool__createdAtTimestamp",
  PoolDecimals = "pool__decimals",
  PoolFee = "pool__fee",
  PoolId = "pool__id",
  PoolLiquidityLocked = "pool__liquidityLocked",
  PoolMaintenance = "pool__maintenance",
  PoolOracle = "pool__oracle",
  PoolRewardPremium = "pool__rewardPremium",
  PoolTokenPair = "pool__tokenPair",
  PoolTxCount = "pool__txCount",
  Recipient = "recipient",
  Rewards = "rewards",
  Timestamp = "timestamp",
  Token0 = "token0",
  Token0Address = "token0__address",
  Token0Decimals = "token0__decimals",
  Token0Id = "token0__id",
  Token0Name = "token0__name",
  Token0Symbol = "token0__symbol",
  Token1 = "token1",
  Token1Address = "token1__address",
  Token1Decimals = "token1__decimals",
  Token1Id = "token1__id",
  Token1Name = "token1__name",
  Token1Symbol = "token1__symbol",
  Transaction = "transaction",
  TransactionBlockNumber = "transaction__blockNumber",
  TransactionGasLimit = "transaction__gasLimit",
  TransactionGasPrice = "transaction__gasPrice",
  TransactionId = "transaction__id",
  TransactionTimestamp = "transaction__timestamp",
}

export type StakePool = {
  __typename?: "StakePool"
  id: Scalars["ID"]["output"]
  multiRewardsFactory: MultiRewardsFactory
  stakeToken: Scalars["Bytes"]["output"]
}

export type StakePool_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<StakePool_Filter>>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  multiRewardsFactory?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_?: InputMaybe<MultiRewardsFactory_Filter>
  multiRewardsFactory_contains?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_ends_with?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_gt?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_gte?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  multiRewardsFactory_lt?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_lte?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_not?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_not_contains?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  multiRewardsFactory_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_starts_with?: InputMaybe<Scalars["String"]["input"]>
  multiRewardsFactory_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  or?: InputMaybe<Array<InputMaybe<StakePool_Filter>>>
  stakeToken?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_gt?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_gte?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
  stakeToken_lt?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_lte?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_not?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_not_contains?: InputMaybe<Scalars["Bytes"]["input"]>
  stakeToken_not_in?: InputMaybe<Array<Scalars["Bytes"]["input"]>>
}

export enum StakePool_OrderBy {
  Id = "id",
  MultiRewardsFactory = "multiRewardsFactory",
  MultiRewardsFactoryId = "multiRewardsFactory__id",
  StakeToken = "stakeToken",
}

export type Subscription = {
  __typename?: "Subscription"
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>
  adjust?: Maybe<Adjust>
  adjusts: Array<Adjust>
  factories: Array<Factory>
  factory?: Maybe<Factory>
  liquidate?: Maybe<Liquidate>
  liquidates: Array<Liquidate>
  multiRewardsFactories: Array<MultiRewardsFactory>
  multiRewardsFactory?: Maybe<MultiRewardsFactory>
  open?: Maybe<Open>
  opens: Array<Open>
  pool?: Maybe<Pool>
  pools: Array<Pool>
  position?: Maybe<Position>
  positions: Array<Position>
  settle?: Maybe<Settle>
  settles: Array<Settle>
  stakePool?: Maybe<StakePool>
  stakePools: Array<StakePool>
  token?: Maybe<Token>
  tokenPositionMapping?: Maybe<TokenPositionMapping>
  tokenPositionMappings: Array<TokenPositionMapping>
  tokens: Array<Token>
  transaction?: Maybe<Transaction>
  transactions: Array<Transaction>
}

export type Subscription_MetaArgs = {
  block?: InputMaybe<Block_Height>
}

export type SubscriptionAdjustArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionAdjustsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Adjust_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Adjust_Filter>
}

export type SubscriptionFactoriesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Factory_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Factory_Filter>
}

export type SubscriptionFactoryArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionLiquidateArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionLiquidatesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Liquidate_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Liquidate_Filter>
}

export type SubscriptionMultiRewardsFactoriesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<MultiRewardsFactory_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<MultiRewardsFactory_Filter>
}

export type SubscriptionMultiRewardsFactoryArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionOpenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionOpensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Open_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Open_Filter>
}

export type SubscriptionPoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Pool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Pool_Filter>
}

export type SubscriptionPositionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionPositionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Position_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Position_Filter>
}

export type SubscriptionSettleArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionSettlesArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Settle_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Settle_Filter>
}

export type SubscriptionStakePoolArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionStakePoolsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<StakePool_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<StakePool_Filter>
}

export type SubscriptionTokenArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionTokenPositionMappingArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionTokenPositionMappingsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<TokenPositionMapping_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<TokenPositionMapping_Filter>
}

export type SubscriptionTokensArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Token_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Token_Filter>
}

export type SubscriptionTransactionArgs = {
  block?: InputMaybe<Block_Height>
  id: Scalars["ID"]["input"]
  subgraphError?: _SubgraphErrorPolicy_
}

export type SubscriptionTransactionsArgs = {
  block?: InputMaybe<Block_Height>
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Transaction_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  subgraphError?: _SubgraphErrorPolicy_
  where?: InputMaybe<Transaction_Filter>
}

export type Token = {
  __typename?: "Token"
  address: Scalars["ID"]["output"]
  decimals: Scalars["BigInt"]["output"]
  id: Scalars["ID"]["output"]
  name: Scalars["String"]["output"]
  symbol: Scalars["String"]["output"]
}

export type TokenPositionMapping = {
  __typename?: "TokenPositionMapping"
  id: Scalars["ID"]["output"]
  poolAddress: Scalars["ID"]["output"]
  positionId: Scalars["String"]["output"]
  tokenId: Scalars["String"]["output"]
}

export type TokenPositionMapping_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  and?: InputMaybe<Array<InputMaybe<TokenPositionMapping_Filter>>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  or?: InputMaybe<Array<InputMaybe<TokenPositionMapping_Filter>>>
  poolAddress?: InputMaybe<Scalars["ID"]["input"]>
  poolAddress_gt?: InputMaybe<Scalars["ID"]["input"]>
  poolAddress_gte?: InputMaybe<Scalars["ID"]["input"]>
  poolAddress_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  poolAddress_lt?: InputMaybe<Scalars["ID"]["input"]>
  poolAddress_lte?: InputMaybe<Scalars["ID"]["input"]>
  poolAddress_not?: InputMaybe<Scalars["ID"]["input"]>
  poolAddress_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  positionId?: InputMaybe<Scalars["String"]["input"]>
  positionId_contains?: InputMaybe<Scalars["String"]["input"]>
  positionId_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_ends_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_gt?: InputMaybe<Scalars["String"]["input"]>
  positionId_gte?: InputMaybe<Scalars["String"]["input"]>
  positionId_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  positionId_lt?: InputMaybe<Scalars["String"]["input"]>
  positionId_lte?: InputMaybe<Scalars["String"]["input"]>
  positionId_not?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_contains?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  positionId_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  positionId_starts_with?: InputMaybe<Scalars["String"]["input"]>
  positionId_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId?: InputMaybe<Scalars["String"]["input"]>
  tokenId_contains?: InputMaybe<Scalars["String"]["input"]>
  tokenId_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_ends_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_gt?: InputMaybe<Scalars["String"]["input"]>
  tokenId_gte?: InputMaybe<Scalars["String"]["input"]>
  tokenId_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  tokenId_lt?: InputMaybe<Scalars["String"]["input"]>
  tokenId_lte?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_contains?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  tokenId_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  tokenId_starts_with?: InputMaybe<Scalars["String"]["input"]>
  tokenId_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
}

export enum TokenPositionMapping_OrderBy {
  Id = "id",
  PoolAddress = "poolAddress",
  PositionId = "positionId",
  TokenId = "tokenId",
}

export type Token_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  address?: InputMaybe<Scalars["ID"]["input"]>
  address_gt?: InputMaybe<Scalars["ID"]["input"]>
  address_gte?: InputMaybe<Scalars["ID"]["input"]>
  address_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  address_lt?: InputMaybe<Scalars["ID"]["input"]>
  address_lte?: InputMaybe<Scalars["ID"]["input"]>
  address_not?: InputMaybe<Scalars["ID"]["input"]>
  address_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  and?: InputMaybe<Array<InputMaybe<Token_Filter>>>
  decimals?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  decimals_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_not?: InputMaybe<Scalars["BigInt"]["input"]>
  decimals_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  name?: InputMaybe<Scalars["String"]["input"]>
  name_contains?: InputMaybe<Scalars["String"]["input"]>
  name_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  name_ends_with?: InputMaybe<Scalars["String"]["input"]>
  name_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  name_gt?: InputMaybe<Scalars["String"]["input"]>
  name_gte?: InputMaybe<Scalars["String"]["input"]>
  name_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  name_lt?: InputMaybe<Scalars["String"]["input"]>
  name_lte?: InputMaybe<Scalars["String"]["input"]>
  name_not?: InputMaybe<Scalars["String"]["input"]>
  name_not_contains?: InputMaybe<Scalars["String"]["input"]>
  name_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  name_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  name_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  name_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  name_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  name_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  name_starts_with?: InputMaybe<Scalars["String"]["input"]>
  name_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  or?: InputMaybe<Array<InputMaybe<Token_Filter>>>
  symbol?: InputMaybe<Scalars["String"]["input"]>
  symbol_contains?: InputMaybe<Scalars["String"]["input"]>
  symbol_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  symbol_ends_with?: InputMaybe<Scalars["String"]["input"]>
  symbol_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  symbol_gt?: InputMaybe<Scalars["String"]["input"]>
  symbol_gte?: InputMaybe<Scalars["String"]["input"]>
  symbol_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  symbol_lt?: InputMaybe<Scalars["String"]["input"]>
  symbol_lte?: InputMaybe<Scalars["String"]["input"]>
  symbol_not?: InputMaybe<Scalars["String"]["input"]>
  symbol_not_contains?: InputMaybe<Scalars["String"]["input"]>
  symbol_not_contains_nocase?: InputMaybe<Scalars["String"]["input"]>
  symbol_not_ends_with?: InputMaybe<Scalars["String"]["input"]>
  symbol_not_ends_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  symbol_not_in?: InputMaybe<Array<Scalars["String"]["input"]>>
  symbol_not_starts_with?: InputMaybe<Scalars["String"]["input"]>
  symbol_not_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
  symbol_starts_with?: InputMaybe<Scalars["String"]["input"]>
  symbol_starts_with_nocase?: InputMaybe<Scalars["String"]["input"]>
}

export enum Token_OrderBy {
  Address = "address",
  Decimals = "decimals",
  Id = "id",
  Name = "name",
  Symbol = "symbol",
}

export type Transaction = {
  __typename?: "Transaction"
  adjust: Array<Adjust>
  blockNumber: Scalars["BigInt"]["output"]
  gasLimit: Scalars["BigInt"]["output"]
  gasPrice: Scalars["BigInt"]["output"]
  id: Scalars["ID"]["output"]
  liquidate: Array<Liquidate>
  open: Array<Open>
  settle: Array<Settle>
  timestamp: Scalars["BigInt"]["output"]
}

export type TransactionAdjustArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Adjust_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  where?: InputMaybe<Adjust_Filter>
}

export type TransactionLiquidateArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Liquidate_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  where?: InputMaybe<Liquidate_Filter>
}

export type TransactionOpenArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Open_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  where?: InputMaybe<Open_Filter>
}

export type TransactionSettleArgs = {
  first?: InputMaybe<Scalars["Int"]["input"]>
  orderBy?: InputMaybe<Settle_OrderBy>
  orderDirection?: InputMaybe<OrderDirection>
  skip?: InputMaybe<Scalars["Int"]["input"]>
  where?: InputMaybe<Settle_Filter>
}

export type Transaction_Filter = {
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>
  adjust_?: InputMaybe<Adjust_Filter>
  and?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>
  blockNumber?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  blockNumber_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_not?: InputMaybe<Scalars["BigInt"]["input"]>
  blockNumber_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  gasLimit?: InputMaybe<Scalars["BigInt"]["input"]>
  gasLimit_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  gasLimit_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  gasLimit_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  gasLimit_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  gasLimit_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  gasLimit_not?: InputMaybe<Scalars["BigInt"]["input"]>
  gasLimit_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  gasPrice?: InputMaybe<Scalars["BigInt"]["input"]>
  gasPrice_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  gasPrice_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  gasPrice_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  gasPrice_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  gasPrice_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  gasPrice_not?: InputMaybe<Scalars["BigInt"]["input"]>
  gasPrice_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  id?: InputMaybe<Scalars["ID"]["input"]>
  id_gt?: InputMaybe<Scalars["ID"]["input"]>
  id_gte?: InputMaybe<Scalars["ID"]["input"]>
  id_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  id_lt?: InputMaybe<Scalars["ID"]["input"]>
  id_lte?: InputMaybe<Scalars["ID"]["input"]>
  id_not?: InputMaybe<Scalars["ID"]["input"]>
  id_not_in?: InputMaybe<Array<Scalars["ID"]["input"]>>
  liquidate_?: InputMaybe<Liquidate_Filter>
  open_?: InputMaybe<Open_Filter>
  or?: InputMaybe<Array<InputMaybe<Transaction_Filter>>>
  settle_?: InputMaybe<Settle_Filter>
  timestamp?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_gte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
  timestamp_lt?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_lte?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not?: InputMaybe<Scalars["BigInt"]["input"]>
  timestamp_not_in?: InputMaybe<Array<Scalars["BigInt"]["input"]>>
}

export enum Transaction_OrderBy {
  Adjust = "adjust",
  BlockNumber = "blockNumber",
  GasLimit = "gasLimit",
  GasPrice = "gasPrice",
  Id = "id",
  Liquidate = "liquidate",
  Open = "open",
  Settle = "settle",
  Timestamp = "timestamp",
}

export type _Block_ = {
  __typename?: "_Block_"
  /** The hash of the block */
  hash?: Maybe<Scalars["Bytes"]["output"]>
  /** The block number */
  number: Scalars["Int"]["output"]
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars["Bytes"]["output"]>
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars["Int"]["output"]>
}

/** The type for the top-level _meta field */
export type _Meta_ = {
  __typename?: "_Meta_"
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_
  /** The deployment ID */
  deployment: Scalars["String"]["output"]
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars["Boolean"]["output"]
}

export enum _SubgraphErrorPolicy_ {
  /** Data will be returned even if the subgraph has indexing errors */
  Allow = "allow",
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  Deny = "deny",
}

export type GetPoolsQueryVariables = Exact<{ [key: string]: never }>

export type GetPoolsQuery = {
  __typename?: "Query"
  pools: Array<{
    __typename?: "Pool"
    id: string
    tokenPair: string
    oracle: string
    createdAtTimestamp: any
    createdAtBlockNumber: any
    decimals: any
    maintenance: any
    fee: any
    factory: { __typename?: "Factory"; id: string }
    token0: {
      __typename?: "Token"
      id: string
      address: string
      symbol: string
      name: string
      decimals: any
    }
    token1: {
      __typename?: "Token"
      id: string
      address: string
      symbol: string
      name: string
      decimals: any
    }
    stakePool?: {
      __typename?: "StakePool"
      id: string
      stakeToken: any
      multiRewardsFactory: { __typename?: "MultiRewardsFactory"; id: string }
    } | null
  }>
}

export type GetPositionQueryVariables = Exact<{
  id: Scalars["ID"]["input"]
}>

export type GetPositionQuery = {
  __typename?: "Query"
  position?: {
    __typename?: "Position"
    id: string
    owner: string
    tokenId?: string | null
    positionId: string
    initialMargin?: any | null
    initialSqrtPriceX96After?: any | null
    margin?: any | null
    marginAmountOut?: any | null
    zeroForOne?: boolean | null
    blockNumber?: any | null
    timestamp?: any | null
    isLiquidated: boolean
    isSettled: boolean
    isClosed: boolean
    rewards?: any | null
    pool: {
      __typename?: "Pool"
      id: string
      address: any
      tokenPair: string
      oracle: string
      maintenance: any
      token0: {
        __typename?: "Token"
        id: string
        address: string
        symbol: string
        name: string
        decimals: any
      }
      token1: {
        __typename?: "Token"
        id: string
        address: string
        symbol: string
        name: string
        decimals: any
      }
    }
  } | null
}

export type GetPositionsQueryVariables = Exact<{
  address: Scalars["ID"]["input"]
}>

export type GetPositionsQuery = {
  __typename?: "Query"
  positions: Array<{
    __typename?: "Position"
    id: string
    tokenId?: string | null
    positionId: string
    owner: string
    initialMargin?: any | null
    initialSqrtPriceX96After?: any | null
    margin?: any | null
    marginAmountOut?: any | null
    zeroForOne?: boolean | null
    blockNumber?: any | null
    timestamp?: any | null
    isLiquidated: boolean
    isSettled: boolean
    isClosed: boolean
    rewards?: any | null
    pool: {
      __typename?: "Pool"
      id: string
      address: any
      tokenPair: string
      oracle: string
      maintenance: any
      token0: {
        __typename?: "Token"
        id: string
        address: string
        symbol: string
        name: string
        decimals: any
      }
      token1: {
        __typename?: "Token"
        id: string
        address: string
        symbol: string
        name: string
        decimals: any
      }
    }
  }>
}

export type GetStakePoolsQueryVariables = Exact<{
  factoryId: Scalars["ID"]["input"]
}>

export type GetStakePoolsQuery = {
  __typename?: "Query"
  multiRewardsFactory?: {
    __typename?: "MultiRewardsFactory"
    id: string
    stakePools: Array<{ __typename?: "StakePool"; id: string }>
  } | null
}

export const GetPoolsDocument = `
    query GetPools {
  pools {
    id
    factory {
      id
    }
    tokenPair
    oracle
    createdAtTimestamp
    createdAtBlockNumber
    token0 {
      id
      address
      symbol
      name
      decimals
    }
    token1 {
      id
      address
      symbol
      name
      decimals
    }
    decimals
    maintenance
    fee
    stakePool {
      id
      stakeToken
      multiRewardsFactory {
        id
      }
    }
  }
}
    `
export const GetPositionDocument = `
    query GetPosition($id: ID!) {
  position(id: $id) {
    id
    owner
    tokenId
    positionId
    initialMargin
    initialSqrtPriceX96After
    margin
    marginAmountOut
    zeroForOne
    pool {
      id
      address
      tokenPair
      oracle
      maintenance
      token0 {
        id
        address
        symbol
        name
        decimals
      }
      token1 {
        id
        address
        symbol
        name
        decimals
      }
    }
    blockNumber
    timestamp
    isLiquidated
    isSettled
    isClosed
    rewards
  }
}
    `
export const GetPositionsDocument = `
    query GetPositions($address: ID!) {
  positions(where: {owner: $address}) {
    id
    tokenId
    positionId
    owner
    initialMargin
    initialSqrtPriceX96After
    margin
    marginAmountOut
    zeroForOne
    pool {
      id
      address
      tokenPair
      oracle
      maintenance
      token0 {
        id
        address
        symbol
        name
        decimals
      }
      token1 {
        id
        address
        symbol
        name
        decimals
      }
    }
    blockNumber
    timestamp
    isLiquidated
    isSettled
    isClosed
    rewards
  }
}
    `
export const GetStakePoolsDocument = `
    query GetStakePools($factoryId: ID!) {
  multiRewardsFactory(id: $factoryId) {
    id
    stakePools {
      id
    }
  }
}
    `

const injectedRtkApi = api.injectEndpoints({
  endpoints: (build) => ({
    GetPools: build.query<GetPoolsQuery, GetPoolsQueryVariables | void>({
      query: (variables) => ({ document: GetPoolsDocument, variables }),
    }),
    GetPosition: build.query<GetPositionQuery, GetPositionQueryVariables>({
      query: (variables) => ({ document: GetPositionDocument, variables }),
    }),
    GetPositions: build.query<GetPositionsQuery, GetPositionsQueryVariables>({
      query: (variables) => ({ document: GetPositionsDocument, variables }),
    }),
    GetStakePools: build.query<GetStakePoolsQuery, GetStakePoolsQueryVariables>({
      query: (variables) => ({ document: GetStakePoolsDocument, variables }),
    }),
  }),
})

export { injectedRtkApi as api }
export const {
  useGetPoolsQuery,
  useLazyGetPoolsQuery,
  useGetPositionQuery,
  useLazyGetPositionQuery,
  useGetPositionsQuery,
  useLazyGetPositionsQuery,
  useGetStakePoolsQuery,
  useLazyGetStakePoolsQuery,
} = injectedRtkApi

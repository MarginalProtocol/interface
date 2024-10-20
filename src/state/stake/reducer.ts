import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BigNumberish } from "ethers"
import { type PoolData } from "src/types"

export interface StakeState {
  stakePool: PoolData | undefined
  stakeTokenAddress: string | null
  inputValue: string
  poolAddress: string | null
  oracleAddress: string | null
  maintenance: BigNumberish | null
}

export const initialState: StakeState = {
  stakePool: undefined,
  stakeTokenAddress: null,
  inputValue: "",
  poolAddress: null,
  oracleAddress: null,
  maintenance: null,
}

export const stakeSlice = createSlice({
  name: "stake",
  initialState,
  reducers: {
    setStakePool: (state: StakeState, action: PayloadAction<PoolData>) => {
      state.stakePool = action.payload
    },
    setStakeTokenAddress: (state: StakeState, action: PayloadAction<string>) => {
      state.stakeTokenAddress = action.payload
    },
    setInputValue: (state: StakeState, action: PayloadAction<string>) => {
      state.inputValue = action.payload
    },
    setPoolAddress: (state: StakeState, action: PayloadAction<string>) => {
      state.poolAddress = action.payload
    },
    setOracleAddress: (state: StakeState, action: PayloadAction<string>) => {
      state.oracleAddress = action.payload
    },
    setMaintenance: (state: StakeState, action: PayloadAction<BigNumberish>) => {
      state.maintenance = action.payload
    },
    resetStakeState: (state: StakeState) => {
      state.inputValue = initialState.inputValue
    },
  },
})

export const {
  setStakePool,
  setStakeTokenAddress,
  setInputValue,
  setPoolAddress,
  setOracleAddress,
  setMaintenance,
  resetStakeState,
} = stakeSlice.actions

export default stakeSlice.reducer

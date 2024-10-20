import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { BigNumberish } from "ethers"
import { type PoolData } from "src/types"

export interface UnstakeState {
  unstakePool: PoolData | undefined
  unstakeTokenAddress: string | null
  inputValue: string
  poolAddress: string | null
  oracleAddress: string | null
  maintenance: BigNumberish | null
}

export const initialState: UnstakeState = {
  unstakePool: undefined,
  unstakeTokenAddress: null,
  inputValue: "",
  poolAddress: null,
  oracleAddress: null,
  maintenance: null,
}

export const unstakeSlice = createSlice({
  name: "unstake",
  initialState,
  reducers: {
    setUnstakePool: (state: UnstakeState, action: PayloadAction<PoolData>) => {
      state.unstakePool = action.payload
    },
    setUnstakeTokenAddress: (state: UnstakeState, action: PayloadAction<string>) => {
      state.unstakeTokenAddress = action.payload
    },
    setInputValue: (state: UnstakeState, action: PayloadAction<string>) => {
      state.inputValue = action.payload
    },
    setPoolAddress: (state: UnstakeState, action: PayloadAction<string>) => {
      state.poolAddress = action.payload
    },
    setOracleAddress: (state: UnstakeState, action: PayloadAction<string>) => {
      state.oracleAddress = action.payload
    },
    setMaintenance: (state: UnstakeState, action: PayloadAction<BigNumberish>) => {
      state.maintenance = action.payload
    },
    resetUnstakeState: (state: UnstakeState) => {
      state.inputValue = initialState.inputValue
    },
  },
})

export const {
  setUnstakePool,
  setUnstakeTokenAddress,
  setInputValue,
  setPoolAddress,
  setOracleAddress,
  setMaintenance,
  resetUnstakeState,
} = unstakeSlice.actions

export default unstakeSlice.reducer

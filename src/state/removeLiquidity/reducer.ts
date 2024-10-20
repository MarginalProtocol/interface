import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Token } from "../../types"
import { BigNumberish } from "ethers"

export interface RemoveLiquidityState {
  tokenA: Token | null
  tokenB: Token | null
  inputValue: string
  poolAddress: string | null
  oracleAddress: string | null
  maintenance: BigNumberish | null
}

export const initialState: RemoveLiquidityState = {
  tokenA: null,
  tokenB: null,
  inputValue: "",
  poolAddress: null,
  oracleAddress: null,
  maintenance: null,
}

export const removeLiquiditySlice = createSlice({
  name: "removeLiquidity",
  initialState,
  reducers: {
    setTokenA: (state: RemoveLiquidityState, action: PayloadAction<Token>) => {
      state.tokenA = action.payload
    },
    setTokenB: (state: RemoveLiquidityState, action: PayloadAction<Token>) => {
      state.tokenB = action.payload
    },
    setInputValue: (state: RemoveLiquidityState, action: PayloadAction<string>) => {
      state.inputValue = action.payload
    },
    setPoolAddress: (state: RemoveLiquidityState, action: PayloadAction<string>) => {
      state.poolAddress = action.payload
    },
    setOracleAddress: (state: RemoveLiquidityState, action: PayloadAction<string>) => {
      state.oracleAddress = action.payload
    },
    setMaintenance: (
      state: RemoveLiquidityState,
      action: PayloadAction<BigNumberish>,
    ) => {
      state.maintenance = action.payload
    },
  },
})

export const {
  setTokenA,
  setTokenB,
  setInputValue,
  setPoolAddress,
  setOracleAddress,
  setMaintenance,
} = removeLiquiditySlice.actions

export default removeLiquiditySlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Token } from "../../types"
import { BigNumberish } from "ethers"

export interface AddLiquidityState {
  tokenA: Token | null
  tokenB: Token | null
  inputValueA: string
  inputValueB: string
  poolAddress: string | null
  oracleAddress: string | null
  maintenance: BigNumberish | null
}

export const initialState: AddLiquidityState = {
  tokenA: null,
  tokenB: null,
  inputValueA: "",
  inputValueB: "",
  poolAddress: null,
  oracleAddress: null,
  maintenance: null,
}

export const addLiquiditySlice = createSlice({
  name: "addLiquidity",
  initialState,
  reducers: {
    setTokenA: (state: AddLiquidityState, action: PayloadAction<Token>) => {
      state.tokenA = action.payload
    },
    setTokenB: (state: AddLiquidityState, action: PayloadAction<Token>) => {
      state.tokenB = action.payload
    },
    setInputValueA: (state: AddLiquidityState, action: PayloadAction<string>) => {
      state.inputValueA = action.payload
    },
    setInputValueB: (state: AddLiquidityState, action: PayloadAction<string>) => {
      state.inputValueB = action.payload
    },
    setPoolAddress: (state: AddLiquidityState, action: PayloadAction<string>) => {
      state.poolAddress = action.payload
    },
    setOracleAddress: (state: AddLiquidityState, action: PayloadAction<string>) => {
      state.oracleAddress = action.payload
    },
    setMaintenance: (state: AddLiquidityState, action: PayloadAction<BigNumberish>) => {
      state.maintenance = action.payload
    },
    resetAddLiquidityState: (state: AddLiquidityState) => {
      state.inputValueA = initialState.inputValueA
      state.inputValueB = initialState.inputValueB
    },
  },
})

export const {
  setTokenA,
  setTokenB,
  setInputValueA,
  setInputValueB,
  setPoolAddress,
  setOracleAddress,
  setMaintenance,
  resetAddLiquidityState,
} = addLiquiditySlice.actions

export default addLiquiditySlice.reducer

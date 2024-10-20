import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Token } from "../../types"

export interface SwapState {
  inputValue: string
  swapToken: Token | null
  inputToken: Token | null
  outputToken: Token | null
}

export const initialState: SwapState = {
  inputValue: "",
  swapToken: null,
  inputToken: null,
  outputToken: null,
}

export const swapSlice = createSlice({
  name: "swap",
  initialState,
  reducers: {
    setInputValue: (state: SwapState, action: PayloadAction<string>) => {
      state.inputValue = action.payload
    },
    setSwapToken: (state: SwapState, action: PayloadAction<Token | null>) => {
      state.swapToken = action.payload
    },
    setInputToken: (state: SwapState, action: PayloadAction<Token | null>) => {
      state.inputToken = action.payload
    },
    setOutputToken: (state: SwapState, action: PayloadAction<Token | null>) => {
      state.outputToken = action.payload
    },
    resetSwapState: (state) => {
      state.inputValue = initialState.inputValue
      state.swapToken = initialState.swapToken
      state.inputToken = initialState.inputToken
      state.outputToken = initialState.outputToken
    },
  },
})

export const {
  setInputValue,
  setSwapToken,
  setInputToken,
  setOutputToken,
  resetSwapState,
} = swapSlice.actions

export default swapSlice.reducer

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Token } from "../../types"

export interface AddMarginState {
  tokenId: string | null
  inputValue: string
  marginToken: Token | null
  debtToken: Token | null
}

export const initialState: AddMarginState = {
  tokenId: null,
  inputValue: "",
  marginToken: null,
  debtToken: null,
}

export const addMarginSlice = createSlice({
  name: "addMargin",
  initialState,
  reducers: {
    setTokenId: (state: AddMarginState, action: PayloadAction<string>) => {
      state.tokenId = action.payload
    },
    setInputValue: (state: AddMarginState, action: PayloadAction<string>) => {
      state.inputValue = action.payload
    },
    setMarginToken: (state: AddMarginState, action: PayloadAction<Token>) => {
      state.marginToken = action.payload
    },
    setDebtToken: (state: AddMarginState, action: PayloadAction<Token>) => {
      state.debtToken = action.payload
    },
    resetAddMarginState: (state) => {
      state.inputValue = initialState.inputValue
      state.marginToken = initialState.marginToken
      state.debtToken = initialState.debtToken
    },
  },
})

export const {
  setTokenId,
  setInputValue,
  setMarginToken,
  setDebtToken,
  resetAddMarginState,
} = addMarginSlice.actions

export default addMarginSlice.reducer

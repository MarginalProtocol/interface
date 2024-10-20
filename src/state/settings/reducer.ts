import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface SettingsState {
  maxSlippage: string
  transactionDeadline: string
}

export const initialState: SettingsState = {
  maxSlippage: "0.5",
  transactionDeadline: "10",
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setMaxSlippage: (state: SettingsState, action: PayloadAction<string>) => {
      state.maxSlippage = action.payload
    },
    resetMaxSlippage: (state) => {
      state.maxSlippage = initialState.maxSlippage
    },
    setTransactionDeadline: (state: SettingsState, action: PayloadAction<string>) => {
      state.transactionDeadline = action.payload
    },
    resetTransactionDeadline: (state) => {
      state.transactionDeadline = initialState.transactionDeadline
    },
  },
})

export const {
  setMaxSlippage,
  resetMaxSlippage,
  setTransactionDeadline,
  resetTransactionDeadline,
} = settingsSlice.actions

export default settingsSlice.reducer

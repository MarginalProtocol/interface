import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { Token } from "../../types"

export interface TradeState {
  inputValue: string
  leverage: number
  tradeToken: Token | null
  marginToken: Token | null
  debtToken: Token | null
  isLong: boolean
}

export const initialState: TradeState = {
  inputValue: "",
  leverage: 1.1,
  tradeToken: null,
  marginToken: null,
  debtToken: null,
  isLong: true,
}

export const tradeSlice = createSlice({
  name: "trade",
  initialState,
  reducers: {
    setInputValue: (state: TradeState, action: PayloadAction<string>) => {
      state.inputValue = action.payload
    },
    setLeverage: (state: TradeState, action: PayloadAction<number>) => {
      state.leverage = action.payload
    },
    setTradeToken: (state: TradeState, action: PayloadAction<Token | null>) => {
      state.tradeToken = action.payload
    },
    setMarginToken: (state: TradeState, action: PayloadAction<Token | null>) => {
      state.marginToken = action.payload
    },
    setDebtToken: (state: TradeState, action: PayloadAction<Token | null>) => {
      state.debtToken = action.payload
    },
    setIsLong: (state: TradeState, action: PayloadAction<boolean>) => {
      state.isLong = action.payload
    },
    resetTradeState: (state) => {
      state.inputValue = initialState.inputValue
      state.leverage = initialState.leverage
      // state.tradeToken = initialState.tradeToken
      state.marginToken = initialState.marginToken
      state.debtToken = initialState.debtToken
      state.isLong = initialState.isLong
    },
  },
})

export const {
  setInputValue,
  setLeverage,
  setTradeToken,
  setMarginToken,
  setDebtToken,
  setIsLong,
  resetTradeState,
} = tradeSlice.actions

export default tradeSlice.reducer

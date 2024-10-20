import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

interface TokenPrice {
  priceUsd: number
}

export interface PricesState {
  prices: {
    [chainId: number]: {
      [address: string]: TokenPrice
    }
  }
  isLoadingPrices: boolean
  error: string | null
}

const initialState: PricesState = {
  prices: {},
  isLoadingPrices: false,
  error: null,
}

export const fetchTokenPrices = createAsyncThunk("prices/fetchTokenPrices", async () => {
  const response = await axios.post(
    "https://graph.codex.io/graphql",
    {
      query: `{
          getTokenPrices(
            inputs: [
              { address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", networkId: 1 }
              { address: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14", networkId: 11155111 }
              { address: "0x7507c1dc16935B82698e4C63f2746A2fCf994dF8", networkId: 80084 }
              { address: "0x4200000000000000000000000000000000000006", networkId: 8453 }
            ]
          ) {
            address
            networkId
            priceUsd
          }
        }`,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${process.env.REACT_APP_CODEX}`,
      },
    },
  )
  return response.data.data.getTokenPrices
})

// Create the prices slice
const pricesSlice = createSlice({
  name: "prices",
  initialState,
  reducers: {
    resetPrices: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTokenPrices.pending, (state) => {
        state.isLoadingPrices = true
        state.error = null
      })
      .addCase(fetchTokenPrices.fulfilled, (state, action) => {
        state.isLoadingPrices = false
        action.payload.forEach(
          ({
            address,
            networkId,
            priceUsd,
          }: {
            address: any
            networkId: any
            priceUsd: any
          }) => {
            if (!state.prices[networkId]) {
              state.prices[networkId] = {}
            }
            state.prices[networkId][address] = { priceUsd }
          },
        )
      })
      .addCase(fetchTokenPrices.rejected, (state, action) => {
        state.isLoadingPrices = false
        state.error = action.error.message || "Failed to fetch token prices"
      })
  },
})

export const { resetPrices } = pricesSlice.actions

export default pricesSlice.reducer

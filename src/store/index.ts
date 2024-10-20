import { configureStore, Middleware } from "@reduxjs/toolkit"

import { api } from "../services/subgraph/api"
import application from "../state/application/reducer"
import trade from "../state/trade/reducer"
import swap from "../state/swap/reducer"
import addLiquidity from "../state/addLiquidity/reducer"
import stake from "../state/stake/reducer"
import unstake from "../state/unstake/reducer"
import removeLiquidity from "../state/removeLiquidity/reducer"
import addMargin from "../state/addMargin/reducer"
import settings from "../state/settings/reducer"
import lists from "../state/lists/reducer"
import prices from "../state/prices/reducer"

const store = configureStore({
  reducer: {
    application,
    trade,
    swap,
    addLiquidity,
    stake,
    unstake,
    removeLiquidity,
    addMargin,
    settings,
    lists,
    prices,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(api.middleware as Middleware),
})

export default store

export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

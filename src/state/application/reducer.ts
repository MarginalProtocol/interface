import { createSlice } from "@reduxjs/toolkit"
import { DEFAULT_CHAIN_ID } from "src/constants/chains"

export enum ApplicationModal {
  TOKEN_LIST,
  SWAP_INPUT_LIST,
  SWAP_OUTPUT_LIST,
}

export interface ApplicationState {
  readonly chainId: number
  readonly openModal: ApplicationModal | null
}

const initialState: ApplicationState = {
  chainId: DEFAULT_CHAIN_ID,
  openModal: null,
}

const applicationSlice = createSlice({
  name: "application",
  initialState,
  reducers: {
    updateChainId(state, action) {
      state.chainId = action.payload
    },
    setOpenModal(state, action) {
      state.openModal = action.payload
    },
  },
})

export const { setOpenModal, updateChainId } = applicationSlice.actions

export default applicationSlice.reducer

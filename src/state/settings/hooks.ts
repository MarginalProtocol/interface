import { useCallback } from "react"

import { useAppSelector, useAppDispatch } from "../../store/hooks"
import {
  resetMaxSlippage,
  setMaxSlippage,
  resetTransactionDeadline,
  setTransactionDeadline,
} from "./reducer"
import { AppState } from "../../store"

export const useSettingsState = (): AppState["settings"] => {
  return useAppSelector((state) => state.settings)
}

export function useSettingsActionHandlers(): {
  onSetMaxSlippage: (maxSlippage: string) => void
  onResetMaxSlippage: () => void
  onSetTransactionDeadline: (transactionDeadline: string) => void
  onResetTransactionDeadline: () => void
} {
  const dispatch = useAppDispatch()

  const onSetMaxSlippage = useCallback(
    (maxSlippage: string) => {
      dispatch(setMaxSlippage(maxSlippage))
    },
    [dispatch],
  )

  const onResetMaxSlippage = useCallback(() => {
    dispatch(resetMaxSlippage())
  }, [dispatch])

  const onSetTransactionDeadline = useCallback(
    (transactionDeadline: string) => {
      dispatch(setTransactionDeadline(transactionDeadline))
    },
    [dispatch],
  )

  const onResetTransactionDeadline = useCallback(() => {
    dispatch(resetTransactionDeadline())
  }, [dispatch])

  return {
    onSetMaxSlippage,
    onResetMaxSlippage,
    onSetTransactionDeadline,
    onResetTransactionDeadline,
  }
}

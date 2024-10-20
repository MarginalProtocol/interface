import _ from "lodash"
import { useCallback, useMemo } from "react"
import { AppState } from "../../store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  setInputValue,
  setLeverage,
  setTradeToken,
  setMarginToken,
  setDebtToken,
  setIsLong,
  resetTradeState,
} from "./reducer"
import { Token } from "../../types"
import { isBlank } from "../../utils/isBlank"
import { isOnlyZeroes } from "../../utils/isOnlyZeroes"

export const useTradeState = (): AppState["trade"] => {
  return useAppSelector((state) => state.trade)
}

export function useTradeActionHandlers(): {
  onUserInput: (value: string) => void
  onSelectLeverage: (leverage: number) => void
  onSelectTradeToken: (token: Token | null) => void
  onSelectMarginToken: (token: Token | null) => void
  onSelectDebtToken: (token: Token | null) => void
  onSetIsLong: (isLong: boolean) => void
  onResetTradeState: () => void
} {
  const dispatch = useAppDispatch()

  const onUserInput = useCallback(
    (value: string) => {
      dispatch(setInputValue(value))
    },
    [dispatch],
  )

  const onSelectLeverage = useCallback(
    (leverage: number) => {
      dispatch(setLeverage(leverage))
    },
    [dispatch],
  )

  const onSelectTradeToken = useCallback(
    (token: Token | null) => {
      dispatch(setTradeToken(token))
    },
    [dispatch],
  )

  const onSelectMarginToken = useCallback(
    (token: Token | null) => {
      dispatch(setMarginToken(token))
    },
    [dispatch],
  )

  const onSelectDebtToken = useCallback(
    (token: Token | null) => {
      dispatch(setDebtToken(token))
    },
    [dispatch],
  )

  const onSetIsLong = useCallback(
    (isLong: boolean) => {
      dispatch(setIsLong(isLong))
    },
    [dispatch],
  )

  const onResetTradeState = useCallback(() => {
    dispatch(resetTradeState())
  }, [dispatch])

  return {
    onUserInput,
    onSelectLeverage,
    onSelectTradeToken,
    onSelectMarginToken,
    onSelectDebtToken,
    onSetIsLong,
    onResetTradeState,
  }
}

export function useTradeStatus() {
  const { inputValue, leverage, marginToken, debtToken, tradeToken } = useTradeState()

  const isInputValid = useMemo(() => {
    return _.isString(inputValue) && !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  }, [inputValue])

  const isTradeTokenValid = useMemo(() => {
    return !_.isNull(tradeToken)
  }, [tradeToken])

  const isMarginTokenValid = useMemo(() => {
    return !_.isNull(marginToken)
  }, [marginToken])

  const isDebtTokenValid = useMemo(() => {
    return !_.isNull(debtToken)
  }, [debtToken])

  const isTradeInputsValid = useMemo(() => {
    return isInputValid && isTradeTokenValid && isMarginTokenValid && isDebtTokenValid
  }, [isInputValid, isTradeTokenValid, isMarginTokenValid, isDebtTokenValid])

  return {
    isInputValid,
    isMarginTokenValid,
    isDebtTokenValid,
    isTradeInputsValid,
  }
}

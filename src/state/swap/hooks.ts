import _ from "lodash"
import { useCallback, useMemo } from "react"
import { AppState } from "../../store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  setInputValue,
  setInputToken,
  setOutputToken,
  resetSwapState,
  setSwapToken,
} from "./reducer"
import { Token } from "../../types"
import { isBlank } from "../../utils/isBlank"
import { isOnlyZeroes } from "../../utils/isOnlyZeroes"

export const useSwapState = (): AppState["swap"] => {
  return useAppSelector((state) => state.swap)
}

export function useSwapActionHandlers(): {
  onUserInput: (value: string) => void
  onSelectSwapToken: (token: Token | null) => void
  onSelectInputToken: (token: Token | null) => void
  onSelectOutputToken: (token: Token | null) => void
  onResetSwapState: () => void
} {
  const dispatch = useAppDispatch()

  const onUserInput = useCallback(
    (value: string) => {
      dispatch(setInputValue(value))
    },
    [dispatch],
  )

  const onSelectSwapToken = useCallback(
    (token: Token | null) => {
      dispatch(setSwapToken(token))
    },
    [dispatch],
  )

  const onSelectInputToken = useCallback(
    (token: Token | null) => {
      dispatch(setInputToken(token))
    },
    [dispatch],
  )

  const onSelectOutputToken = useCallback(
    (token: Token | null) => {
      dispatch(setOutputToken(token))
    },
    [dispatch],
  )

  const onResetSwapState = useCallback(() => {
    dispatch(resetSwapState())
  }, [dispatch])

  return {
    onUserInput,
    onSelectSwapToken,
    onSelectInputToken,
    onSelectOutputToken,
    onResetSwapState,
  }
}

export function useSwapStatus() {
  const { inputValue, inputToken, outputToken } = useSwapState()

  const isInputValid = useMemo(() => {
    return _.isString(inputValue) && !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  }, [inputValue])

  const isInputTokenValid = useMemo(() => {
    return !_.isNull(inputToken)
  }, [inputToken])

  const isOutputTokenValid = useMemo(() => {
    return !_.isNull(outputToken)
  }, [outputToken])

  const isSwapInputsValid = useMemo(() => {
    return isInputValid && isInputTokenValid && isOutputTokenValid
  }, [isInputValid, isInputTokenValid, isOutputTokenValid])

  return {
    isInputValid,
    isInputTokenValid,
    isOutputTokenValid,
    isSwapInputsValid,
  }
}

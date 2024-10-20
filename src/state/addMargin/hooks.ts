import _ from "lodash"
import { useCallback, useMemo } from "react"
import { AppState } from "../../store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  setTokenId,
  setInputValue,
  setMarginToken,
  setDebtToken,
  resetAddMarginState,
} from "./reducer"
import { Token } from "../../types"
import { isBlank } from "../../utils/isBlank"
import { isOnlyZeroes } from "../../utils/isOnlyZeroes"

export const useAddMarginState = (): AppState["addMargin"] => {
  return useAppSelector((state) => state.addMargin)
}

export function useAddMarginActionHandlers(): {
  onSetTokenId: (tokenId: string) => void
  onUserInput: (value: string) => void
  onSetMarginToken: (token: Token) => void
  onSetDebtToken: (token: Token) => void
} {
  const dispatch = useAppDispatch()

  const onSetTokenId = useCallback(
    (tokenId: string) => {
      dispatch(setTokenId(tokenId))
    },
    [dispatch],
  )

  const onUserInput = useCallback(
    (value: string) => {
      dispatch(setInputValue(value))
    },
    [dispatch],
  )

  const onSetMarginToken = useCallback(
    (token: Token) => {
      dispatch(setMarginToken(token))
    },
    [dispatch],
  )

  const onSetDebtToken = useCallback(
    (token: Token) => {
      dispatch(setDebtToken(token))
    },
    [dispatch],
  )

  return {
    onSetTokenId,
    onUserInput,
    onSetMarginToken,
    onSetDebtToken,
  }
}

export function useAddMarginStatus() {
  const { tokenId, inputValue, marginToken } = useAddMarginState()

  const isInputValid = useMemo(() => {
    return _.isString(inputValue) && !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  }, [inputValue])

  const isMarginTokenValid = useMemo(() => {
    return !_.isNull(marginToken)
  }, [marginToken])

  const isAddMarginInputsValid = useMemo(() => {
    return isInputValid && isMarginTokenValid && tokenId
  }, [isInputValid, isMarginTokenValid, tokenId])

  return {
    isInputValid,
    isMarginTokenValid,
    isAddMarginInputsValid,
  }
}

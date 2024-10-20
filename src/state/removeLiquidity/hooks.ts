import _ from "lodash"
import { isBlank } from "../../utils/isBlank"
import { isOnlyZeroes } from "../../utils/isOnlyZeroes"
import { useCallback, useMemo } from "react"
import { AppState } from "../../store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { setInputValue, setTokenA, setTokenB } from "./reducer"
import { Token } from "../../types"

export const useRemoveLiquidityState = (): AppState["removeLiquidity"] => {
  return useAppSelector((state) => state.removeLiquidity)
}

export function useRemoveLiquidityActionHandlers(): {
  onUserInput: (value: string) => void
  onSelectTokenA: (token: Token) => void
  onSelectTokenB: (token: Token) => void
} {
  const dispatch = useAppDispatch()

  const onUserInput = useCallback(
    (value: string) => {
      dispatch(setInputValue(value))
    },
    [dispatch],
  )

  const onSelectTokenA = useCallback(
    (token: Token) => {
      dispatch(setTokenA(token))
    },
    [dispatch],
  )

  const onSelectTokenB = useCallback(
    (token: Token) => {
      dispatch(setTokenB(token))
    },
    [dispatch],
  )

  return {
    onUserInput,
    onSelectTokenA,
    onSelectTokenB,
  }
}

export function useRemoveLiquidityStatus() {
  const { tokenA, tokenB, inputValue } = useRemoveLiquidityState()

  const isInputValid = useMemo(() => {
    return _.isString(inputValue) && !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  }, [inputValue])

  const isTokenAValid = useMemo(() => {
    return !_.isNull(tokenA)
  }, [tokenA])

  const isTokenBValid = useMemo(() => {
    return !_.isNull(tokenB)
  }, [tokenB])

  const isTokensValid = useMemo(() => {
    return isTokenAValid && isTokenBValid
  }, [isTokenAValid, isTokenBValid])

  const isRemoveLiquidityInputsValid = useMemo(() => {
    return isInputValid && isTokensValid
  }, [isInputValid, isTokensValid])

  return {
    isTokensValid,
    isInputValid,
    isRemoveLiquidityInputsValid,
  }
}

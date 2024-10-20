import _ from "lodash"
import { isBlank } from "../../utils/isBlank"
import { isOnlyZeroes } from "../../utils/isOnlyZeroes"
import { useCallback, useMemo } from "react"
import { AppState } from "../../store"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  setInputValueA,
  setInputValueB,
  setTokenA,
  setTokenB,
  resetAddLiquidityState,
} from "./reducer"
import { Token } from "../../types"

export const useAddLiquidityState = (): AppState["addLiquidity"] => {
  return useAppSelector((state) => state.addLiquidity)
}

export function useAddLiquidityActionHandlers(): {
  onUserInputA: (value: string) => void
  onUserInputB: (value: string) => void
  onSelectTokenA: (token: Token) => void
  onSelectTokenB: (token: Token) => void
  onResetAddLiquidityInput: () => void
} {
  const dispatch = useAppDispatch()

  const onUserInputA = useCallback(
    (value: string) => {
      dispatch(setInputValueA(value))
    },
    [dispatch],
  )

  const onUserInputB = useCallback(
    (value: string) => {
      dispatch(setInputValueB(value))
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

  const onResetAddLiquidityInput = useCallback(() => {
    dispatch(resetAddLiquidityState())
  }, [dispatch])

  return {
    onUserInputA,
    onUserInputB,
    onSelectTokenA,
    onSelectTokenB,
    onResetAddLiquidityInput,
  }
}

export function useAddLiquidityStatus() {
  const { tokenA, tokenB, inputValueA, inputValueB } = useAddLiquidityState()

  const isInputAValid = useMemo(() => {
    return _.isString(inputValueA) && !isBlank(inputValueA) && !isOnlyZeroes(inputValueA)
  }, [inputValueA])

  const isInputBValid = useMemo(() => {
    return _.isString(inputValueB) && !isBlank(inputValueB) && !isOnlyZeroes(inputValueB)
  }, [inputValueB])

  const isValidInputs = useMemo(() => {
    return isInputAValid || isInputBValid
  }, [isInputAValid, isInputBValid])

  const isTokenAValid = useMemo(() => {
    return !_.isNull(tokenA)
  }, [tokenA])

  const isTokenBValid = useMemo(() => {
    return !_.isNull(tokenB)
  }, [tokenB])

  const isValidTokens = useMemo(() => {
    return isTokenAValid && isTokenBValid
  }, [isTokenAValid, isTokenBValid])

  const isValidAddLiquidityInputs = useMemo(() => {
    return isValidInputs && isValidTokens
  }, [isValidInputs, isValidTokens])

  return {
    isValidInputs,
    isValidTokens,
    isValidAddLiquidityInputs,
  }
}

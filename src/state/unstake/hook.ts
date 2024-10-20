import _ from "lodash"
import { isBlank } from "src/utils/isBlank"
import { isOnlyZeroes } from "src/utils/isOnlyZeroes"
import { useCallback, useMemo } from "react"
import { AppState } from "src/store"
import { useAppDispatch, useAppSelector } from "src/store/hooks"
import {
  setInputValue,
  setUnstakePool,
  setUnstakeTokenAddress,
  resetUnstakeState,
} from "./reducer"
import { type PoolData } from "src/types"

export const useUnstakeState = (): AppState["unstake"] => {
  return useAppSelector((state) => state.unstake)
}

export function useUnstakeActionHandlers(): {
  onUserInput: (value: string) => void
  onSelectUnstakePool: (pool: PoolData) => void
  onSelectUnstakeTokenAddress: (address: string) => void
  onResetUnstakeInput: () => void
} {
  const dispatch = useAppDispatch()

  const onUserInput = useCallback(
    (value: string) => {
      dispatch(setInputValue(value))
    },
    [dispatch],
  )

  const onSelectUnstakePool = useCallback(
    (pool: PoolData) => {
      dispatch(setUnstakePool(pool))
    },
    [dispatch],
  )

  const onSelectUnstakeTokenAddress = useCallback(
    (address: string) => {
      dispatch(setUnstakeTokenAddress(address))
    },
    [dispatch],
  )

  const onResetUnstakeInput = useCallback(() => {
    dispatch(resetUnstakeState())
  }, [dispatch])

  return {
    onUserInput,
    onSelectUnstakePool,
    onSelectUnstakeTokenAddress,
    onResetUnstakeInput,
  }
}

export function useUnstakeStatus() {
  const { unstakeTokenAddress, inputValue } = useUnstakeState()

  const isInputValid = useMemo(() => {
    return _.isString(inputValue) && !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  }, [inputValue])

  const isTokenValid = useMemo(() => {
    return !_.isNull(unstakeTokenAddress)
  }, [unstakeTokenAddress])

  const isValidUnstakeInputs = useMemo(() => {
    return isInputValid && isTokenValid
  }, [isInputValid, isTokenValid])

  return {
    isInputValid,
    isTokenValid,
    isValidUnstakeInputs,
  }
}

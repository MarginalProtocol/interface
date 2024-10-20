import _ from "lodash"
import { isBlank } from "src/utils/isBlank"
import { isOnlyZeroes } from "src/utils/isOnlyZeroes"
import { useCallback, useMemo } from "react"
import { AppState } from "src/store"
import { useAppDispatch, useAppSelector } from "src/store/hooks"
import {
  setInputValue,
  setStakePool,
  setStakeTokenAddress,
  resetStakeState,
} from "./reducer"
import { type PoolData, type Token } from "src/types"

export const useStakeState = (): AppState["stake"] => {
  return useAppSelector((state) => state.stake)
}

export function useStakeActionHandlers(): {
  onUserInput: (value: string) => void
  onSelectStakePool: (pool: PoolData) => void
  onSelectStakeTokenAddress: (address: string) => void
  onResetStakeInput: () => void
} {
  const dispatch = useAppDispatch()

  const onUserInput = useCallback(
    (value: string) => {
      dispatch(setInputValue(value))
    },
    [dispatch],
  )

  const onSelectStakePool = useCallback(
    (pool: PoolData) => {
      dispatch(setStakePool(pool))
    },
    [dispatch],
  )

  const onSelectStakeTokenAddress = useCallback(
    (address: string) => {
      dispatch(setStakeTokenAddress(address))
    },
    [dispatch],
  )

  const onResetStakeInput = useCallback(() => {
    dispatch(resetStakeState())
  }, [dispatch])

  return {
    onUserInput,
    onSelectStakePool,
    onSelectStakeTokenAddress,
    onResetStakeInput,
  }
}

export function useStakeStatus() {
  const { stakeTokenAddress, inputValue } = useStakeState()

  const isInputValid = useMemo(() => {
    return _.isString(inputValue) && !isBlank(inputValue) && !isOnlyZeroes(inputValue)
  }, [inputValue])

  const isTokenValid = useMemo(() => {
    return !_.isNull(stakeTokenAddress)
  }, [stakeTokenAddress])

  const isValidStakeInputs = useMemo(() => {
    return isInputValid && isTokenValid
  }, [isInputValid, isTokenValid])

  return {
    isInputValid,
    isTokenValid,
    isValidStakeInputs,
  }
}

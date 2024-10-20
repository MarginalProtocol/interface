import { useEffect } from "react"
import { useAppDispatch } from "src/store/hooks"
import { fetchTokenPrices } from "./reducer"
import { useGetCurrentBlockTimestamp } from "src/hooks/useGetCurrentBlockTimestamp"
import { useApplicationState } from "../application/hooks"

export default function Updater() {
  const dispatch = useAppDispatch()
  const { chainId } = useApplicationState()
  const currentBlockTimestamp = useGetCurrentBlockTimestamp(chainId)

  useEffect(() => {
    dispatch(fetchTokenPrices())
  }, [dispatch, currentBlockTimestamp])

  return null
}

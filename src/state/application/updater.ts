import { useEffect } from "react"
import { useAppDispatch } from "src/store/hooks"
import { useNetwork } from "wagmi"
import { updateChainId } from "./reducer"

export default function Updater(): null {
  const dispatch = useAppDispatch()
  const { chain } = useNetwork()

  useEffect(() => {
    if (chain?.id) {
      dispatch(updateChainId(chain?.id))
    }
  }, [dispatch, chain?.id])

  return null
}

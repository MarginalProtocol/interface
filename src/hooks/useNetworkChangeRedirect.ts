import { useEffect, useRef } from "react"
import { useNetwork } from "wagmi"

export const useNetworkChangeRedirect = (onNavigation: () => void) => {
  const { chain } = useNetwork()
  const initialChainId = useRef<number | undefined>(chain?.id)

  useEffect(() => {
    if (chain && initialChainId.current !== chain.id) {
      console.log("Network Changed", chain.name, chain.id)
      onNavigation()
    }
  }, [chain, onNavigation])
}

import contenthashToUri from "../utils/contenthashToUri"
import parseENSAddress from "../utils/parseENSAddress"
import uriToHttp from "../utils/uriToHttp"
import { useMemo } from "react"

import useENSContentHash from "./useENSContentHash"

export default function useHttpLocations(uri: string | undefined | null): string[] {
  const ens = useMemo(() => (uri ? parseENSAddress(uri) : undefined), [uri])
  const resolvedContentHash = useENSContentHash(ens?.ensName)
  return useMemo(() => {
    if (ens) {
      return resolvedContentHash.contenthash
        ? uriToHttp(contenthashToUri(resolvedContentHash.contenthash))
        : []
    } else {
      return uri ? uriToHttp(uri) : []
    }
  }, [ens, resolvedContentHash.contenthash, uri])
}

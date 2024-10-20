import { useMemo } from "react"
import { useContractRead, Address } from "wagmi"
import { getContract } from "@wagmi/core"
import { safeNamehash } from "../utils/safeNamehash"
import isHexZero from "../utils/isHexZero"
import { ENS_REGISTRAR_ADDRESSES, ChainId } from "@uniswap/sdk-core"
import ENS_ABI from "../abis/ens-registrar.json"
import ENS_PUBLIC_RESOLVER_ABI from "../abis/ens-public-resolver.json"
import { isArray, isObject, isString } from "lodash"

/**
 * Does a lookup for an ENS name to find its contenthash.
 */
export default function useENSContentHash(ensName?: string | null) {
  const ensNode = useMemo(() => (ensName ? safeNamehash(ensName) : undefined), [ensName])

  // Ensure registrar contract uses a valid address and ABI
  const registrarContract = getContract({
    address: ENS_REGISTRAR_ADDRESSES[ChainId.MAINNET] as Address, // Using MAINNET address
    abi: ENS_ABI,
  })

  // Read resolver address using wagmi's useContractRead
  const { data: resolverAddress, isLoading: isLoadingResolverAddress } = useContractRead({
    ...registrarContract,
    functionName: "resolver",
    args: [ensNode],
    watch: true,
    enabled: !!ensNode, // Ensure ensNode is defined before enabling
  })

  // Conditionally setup the resolver contract object
  const resolverContract = useMemo(() => {
    if (!isString(resolverAddress)) return null
    if (!resolverAddress || isHexZero(resolverAddress)) return null
    return {
      address: resolverAddress,
      abi: ENS_PUBLIC_RESOLVER_ABI,
    }
  }, [resolverAddress])

  // Use wagmi's useContractRead to get the contenthash from the resolver
  const { data: contentHashData, isLoading: isLoadingContentHash } = useContractRead({
    ...resolverContract,
    address: resolverContract?.address as Address,
    functionName: "contenthash",
    args: [ensNode],
    watch: true,
    enabled: !!resolverContract && !!ensNode, // Ensure both resolverContract and ensNode are defined
  })

  const contenthash = isArray(contentHashData) ? contentHashData?.[0] : null
  const loading = isLoadingResolverAddress || isLoadingContentHash

  return { contenthash, loading }
}

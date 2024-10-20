import {
  useState,
  useEffect,
  useRef,
  useCallback,
  ChangeEvent,
  KeyboardEvent,
  RefObject,
} from "react"
import useDebounce from "../../hooks/useDebounce"
import { useDefaultActiveTokens } from "../../hooks/Tokens"
import { useNetwork } from "wagmi"
import { getTokenFilter } from "../../state/lists/getTokenFilter"
import { useSortTokensByQuery } from "../../state/lists/sorting"
import { getValidAddress } from "../../utils/getValidAddress"
import { FixedSizeList } from "react-window"
import { Token } from "../../types"
import { TokenInfo } from "@uniswap/token-lists"
import { MagnifyingGlassIcon } from "@heroicons/react/24/solid"
import { TokenSelect, TokenSelectLoading } from "../Trade/TokenSelect"
import AutoSizer from "react-virtualized-auto-sizer"
import { useToken } from "../../hooks/Tokens"
import { isArray, isEmpty } from "lodash"
import { checkIfTokenIsTradeable } from "../../functions/checkIfTokenIsTradeable"

export const setTokensWithPools = (tokensFromPools: Token[]): Set<string> => {
  // Create a Set from token addresses derived from tokens from pools
  const tokensWithPools = new Set(
    tokensFromPools.map((token) => getValidAddress(token.address)),
  )
  return tokensWithPools
}

interface CurrencySearchProps {
  isOpen: boolean
  onDismiss: () => void
  onSelectToken: (token: any) => void
  allTokens: any[]
  tradeableTokens: Token[]
  className?: string
}
export const CurrencySearch = ({
  isOpen,
  onDismiss,
  onSelectToken,
  allTokens,
  tradeableTokens,
  className,
}: CurrencySearchProps) => {
  const { chain } = useNetwork()
  const [searchQuery, setSearchQuery] = useState<string>("")
  const debouncedQuery = useDebounce(searchQuery, 200)
  const searchToken = useToken(debouncedQuery, chain?.id)

  const tradeableTokensSet = setTokensWithPools(tradeableTokens)

  const filteredTokens = Object.values(allTokens).filter(getTokenFilter(debouncedQuery))
  const filteredSortedTokens = useSortTokensByQuery(debouncedQuery, filteredTokens)

  const alphabeticalFilteredSortedTokens = [...filteredSortedTokens].sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery("")
  }, [isOpen])

  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>()
  const inputRef = useRef<HTMLInputElement>()

  const handleInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value
    const checksummedInput = getValidAddress(input)
    setSearchQuery(checksummedInput || input)
    fixedList.current?.scrollTo(0)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        const s = debouncedQuery.toLowerCase().trim()
        if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() ===
              debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            onSelectToken(filteredSortedTokens[0])
          }
        }
      }
    },
    [debouncedQuery, filteredSortedTokens, onSelectToken],
  )

  const [tokenLoaderTimerElapsed, setTokenLoaderTimerElapsed] = useState(false)

  const isLoading = Boolean(!tokenLoaderTimerElapsed)

  // Timeout token loader after 3 seconds to avoid hanging in a loading state.
  useEffect(() => {
    setTokenLoaderTimerElapsed(false)

    const tokenLoaderTimer = setTimeout(() => {
      setTokenLoaderTimerElapsed(true)
    }, 3000)
    return () => clearTimeout(tokenLoaderTimer)
  }, [debouncedQuery])

  return (
    <div className="md:max-w-[400px] w-full space-y-5 divide-y divide-borderGray">
      <div className="px-4">
        <div
          className={`flex items-center bg-marginalBlack p-3 space-x-2 rounded-xl ${className}`}
        >
          <MagnifyingGlassIcon
            width={16}
            height={16}
            strokeWidth={1}
            stroke="#7A7A7A"
            fill="white"
          />
          <input
            type="text"
            id="token-search-input"
            className="w-full p-0 border-none outline-none bg-marginalBlack text-base font-bold tracking-thin text-marginalGray-200 placeholder-marginalGray-600 uppercase focus:outline-none focus:ring-0 focus:border-none"
            placeholder={`Search name or address`}
            autoComplete="off"
            value={searchQuery}
            ref={inputRef as RefObject<HTMLInputElement>}
            onChange={handleInput}
            onKeyDown={handleEnter}
          />
        </div>
      </div>
      <div className="min-h-[350px] max-h-[350px] overflow-y-scroll">
        {searchQuery && isLoading ? (
          <div>
            <TokenSelectLoading />
            <TokenSelectLoading />
            <TokenSelectLoading />
            <TokenSelectLoading />
            <TokenSelectLoading />
            <TokenSelectLoading />
            <TokenSelectLoading />
          </div>
        ) : searchToken ? (
          <TokenSelect
            key={searchToken.address}
            token={searchToken as TokenInfo}
            onSelect={() => onSelectToken(searchToken)}
            isTradeable={checkIfTokenIsTradeable(
              searchToken as Token,
              tradeableTokensSet,
            )}
          />
        ) : isArray(filteredSortedTokens) && !isEmpty(filteredSortedTokens) ? (
          <div>
            {searchQuery ? (
              <div className="mt-3 mb-2 px-4 text-marginalGray-600 text-base tracking-thin font-bold uppercase">
                Search results
              </div>
            ) : (
              <div className="mt-3 mb-2 px-4 text-marginalGray-600 text-base tracking-thin font-bold uppercase">
                Tokens
              </div>
            )}
            {alphabeticalFilteredSortedTokens.map((token: any, key: number) => (
              <TokenSelect
                key={key}
                token={token}
                onSelect={() => onSelectToken(token)}
                isTradeable={checkIfTokenIsTradeable(token, tradeableTokensSet)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 mb-2 px-4 text-marginalGray-600 text-base tracking-thin font-bold uppercase text-center">
            No results found.
          </div>
        )}
      </div>
    </div>
  )
}

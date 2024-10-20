import { useState } from "react"
import { type PoolData, type Token } from "src/types"
import { ListRow } from "../List/ListRow"
import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { DoubleCurrencyLogo } from "src/pages/Pools"
import { AssetPairPriceRatio } from "../Trade/TradeDetailList"

interface Props {
  pool: PoolData | null
  token0: Token | null
  token1: Token | null

  poolPrice: string | null | undefined
  maxSlippage: string
  leverageTier: number | undefined

  useInverse: boolean
  onToggleInverse: () => void
}

export const SwapDetailList = ({
  pool,
  token0,
  token1,

  poolPrice,
  maxSlippage,
  leverageTier,

  useInverse,
  onToggleInverse,
}: Props) => {
  const [show, setShow] = useState(false)

  if (!pool) return null

  return (
    <div
      id="swap-detail-list"
      className="px-2 py-2 rounded-lg transform-gpu duration-175"
    >
      <div className="flex items-center justify-between">
        <AssetPairPriceRatio
          token0={token0}
          token1={token1}
          price={poolPrice}
          useInverse={useInverse}
          onToggleInverse={onToggleInverse}
          size="xl"
        />

        <div
          onClick={() => setShow(!show)}
          className="w-full flex items-center justify-end cursor-pointer hover:opacity-60"
        >
          <ChevronDownIcon
            width={16}
            height={16}
            className={
              show
                ? "text-marginalGray-200 transform rotate-180 transition-transform duration-200 ease-in-out"
                : "text-marginalGray-200 transition-transform duration-200 ease-in-out"
            }
          />
        </div>
      </div>

      <div
        className={`
          text-sm md:text-base tracking-thin font-bold uppercase transition-max-height ease-in-out 
          text-marginalGray-200 transform-gpu duration-500 overflow-y-hidden
          ${show ? "max-h-[600px]" : "max-h-0"}
        `}
      >
        <div className="my-4 h-[1px] bg-marginalGray-800" />

        <div className="space-y-2 text-marginalGray-400">
          <ListRow
            item="Max slippage"
            value={
              maxSlippage && (
                <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                  <div>{maxSlippage}%</div>
                </div>
              )
            }
          />
          <ListRow
            item="Pool"
            value={
              pool && (
                <div className="flex items-center space-x-1 text-marginalGray-200">
                  <DoubleCurrencyLogo token0={token0} token1={token1} size={4} />

                  <div className="flex flex-wrap items-baseline space-x-2">
                    <div className="flex items-center space-x-1">
                      <pre>{token0?.symbol}</pre>
                      <div className="my-auto font-bold">/</div>
                      <pre>{token1?.symbol}</pre>
                    </div>
                  </div>
                </div>
              )
            }
          />
          <ListRow
            item="Leverage Tier"
            value={
              leverageTier && (
                <div className="flex flex-wrap justify-end space-x-1 text-marginalGray-200">
                  <div>{leverageTier}x Max</div>
                </div>
              )
            }
          />
        </div>
      </div>
    </div>
  )
}

import { isNull } from "lodash"
import { Link } from "react-router-dom"
import Modal from "../Modal"
import { MintQuote } from "src/hooks/useViewQuoteMint"
import { ListRow } from "../List/ListRow"
import { TradeButton } from "./TradeButton"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { CheckIcon } from "src/components/Icons/CheckIcon"
import { ErrorIcon } from "src/components/Icons/ErrorIcon"
import { type PoolData, type Token } from "src/types"
import { DoubleCurrencyLogo } from "src/pages/Pools"
import { SpinningLoader } from "src/components/Icons/SpinningLoader"
import { ExplorerDataType, getExplorerLink } from "src/utils/getExplorerLink"
import { AssetPairPriceRatio } from "./TradeDetailList"
import { ListContainer } from "../List/ListContainer"
import { ReactNode } from "react"
import { ArrowOutgoingIcon } from "../Icons/ArrowOutgoingIcon"
import { ActionButton } from "../ActionButton"
import { HealthFactorIcon } from "../Icons/HealthFactorIcon"

interface Props {
  chainId: number
  marginToken: Token | null
  debtToken: Token | null
  pool: PoolData | null
  token0: Token | null
  token1: Token | null
  leverage: number
  leverageMax: number | undefined
  useGas: boolean
  gasToken: Token | null | undefined

  open: boolean
  onOpen: () => void
  onClose: () => void
  onReset: () => void

  quotedMargin: string | null | undefined
  quotedDebt: string | null | undefined
  quotedSize: string | null | undefined
  quotedFees: string | null | undefined
  mintQuote: MintQuote | null
  mintCallback: (() => Promise<any>) | undefined

  isPendingWallet: boolean
  isPendingApprove: boolean
  isPendingTx: boolean
  isTxSubmitted: boolean
  txHash: string | null
  txError: any

  poolPrice: string | null | undefined
  oraclePrice: string | null | undefined
  liquidationPrice: string | null | undefined
  fundingRate: string | number | null | undefined
  escrowRewards: string | null | undefined
  priceImpact: string | undefined
  isPriceImpactModerate: boolean | undefined
  isPriceImpactSevere: boolean | undefined
  healthFactor: number | null

  useInverse: boolean
  onToggleInverse: () => void
}

export const ConfirmTradeModal = ({
  chainId,
  marginToken,
  debtToken,
  pool,
  token0,
  token1,
  leverage,
  leverageMax,
  useGas,
  gasToken,

  open,
  onOpen,
  onClose,
  onReset,

  quotedMargin,
  quotedDebt,
  quotedSize,
  quotedFees,
  mintQuote,
  mintCallback,

  isPendingWallet,
  isPendingApprove,
  isPendingTx,
  isTxSubmitted,
  txHash,
  txError,

  poolPrice,
  oraclePrice,
  liquidationPrice,
  fundingRate,
  escrowRewards,
  priceImpact,
  isPriceImpactModerate,
  isPriceImpactSevere,
  healthFactor,

  useInverse,
  onToggleInverse,
}: Props) => {
  const priceImpactIndicator =
    priceImpact && (isPriceImpactModerate || isPriceImpactSevere)
      ? isPriceImpactSevere
        ? "text-red-500"
        : "text-yellow-500"
      : "text-marginalGray-200"

  const fundingRateIndicator =
    Math.abs(Number(fundingRate)) > 1
      ? "text-warning-500"
      : Math.abs(Number(fundingRate)) > 5
        ? "text-error-500"
        : "text-marginalGray-200"

  let healthFactorIndicator

  if (isNull(healthFactor)) {
    healthFactorIndicator = "text-white"
  } else if (healthFactor <= 1.25) {
    healthFactorIndicator = "text-error-500"
  } else if (healthFactor <= 1.5) {
    healthFactorIndicator = "text-warning-500"
  } else if (1.5 < healthFactor) {
    healthFactorIndicator = "text-success-500"
  }

  return (
    <Modal
      open={open}
      onOpen={onOpen}
      onClose={txHash ? onReset : isPendingTx ? () => null : onClose}
      disableExternalClickClose={Boolean(isPendingTx || txHash)}
    >
      {txError ? (
        <div className="relative pt-8 pb-4 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <XMarkIcon
            onClick={onClose}
            className="absolute w-6 h-6 cursor-pointer stroke-2 right-3 top-2 stroke-marginalGray-200 hover:opacity-80"
          />
          <div className="w-[100px] h-[100px] rounded-full bg-marginalBlack mx-auto flex items-center justify-center border border-marginalGray-800">
            <ErrorIcon />
          </div>

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Trade Failed
          </div>

          <div className="mb-6 text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
            Something Went Wrong
          </div>

          <div className="flex flex-col">
            <ActionButton action="Close" onClick={onReset} />
          </div>
        </div>
      ) : isPendingWallet ? (
        <div className="relative py-8 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <XMarkIcon
            onClick={onClose}
            className="absolute w-6 h-6 cursor-pointer stroke-2 right-3 top-2 stroke-marginalGray-200 hover:opacity-80"
          />
          <SpinningLoader />

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Confirm Trade
          </div>

          <div className="text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
            Proceed in your wallet
          </div>
        </div>
      ) : isPendingTx ? (
        <div className="py-8 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <SpinningLoader />

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Transaction submitted
          </div>

          <div className="text-sm font-bold leading-4 tracking-thin text-marginalGray-600 animate-pulse">
            Waiting for transaction to finalize
          </div>
        </div>
      ) : !isPendingTx && txHash ? (
        <div className="relative pt-8 pb-4 px-4 w-[343px] sm:w-[400px] uppercase bg-marginalGray-900 rounded-3xl shadow-outerBlack border border-marginalGray-800 text-center">
          <XMarkIcon
            onClick={onClose}
            className="absolute w-6 h-6 cursor-pointer stroke-2 right-3 top-2 stroke-marginalGray-200 hover:opacity-80"
          />
          <div className="w-[100px] h-[100px] rounded-full bg-marginalBlack mx-auto flex items-center justify-center border border-marginalGray-800">
            <CheckIcon />
          </div>

          <div className="mt-6 mb-4 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
            Trade executed
          </div>

          <div className="flex flex-col">
            {txHash && (
              <Link
                className="flex items-center justify-center w-full py-4 mb-2 text-sm font-bold leading-4 uppercase border border-transparent bg-marginalGray-800 text-marginalGray-200 hover:border-marginalGray-600 active:bg-marginalGray-800 active:border-marginalGray-800 disabled:border disabled:border-transparent focus:outline-none focus:ring-1 focus:ring-marginalOrange-300 tracking-thin rounded-xl"
                to={getExplorerLink(chainId, txHash, ExplorerDataType.TRANSACTION)}
                target="_blank"
              >
                View on Block Explorer
                <ArrowOutgoingIcon className="ml-2" />
              </Link>
            )}

            <ActionButton action="Close" onClick={onReset} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full max-w-[405px] sm:max-w-[520px]">
          <div className="relative flex items-center justify-between px-4 py-5">
            <div className="text-xl leading-6 tracking-thin font-bold text-[#CACACA] uppercase">
              Review Trade
            </div>
            <XMarkIcon
              onClick={onClose}
              className="w-6 h-6 cursor-pointer stroke-2 right-1.5 top-1 stroke-marginalGray-200 hover:opacity-80"
            />
          </div>

          <div className="h-[1px] bg-marginalGray-800" />

          <div className="flex p-3 pt-4">
            <div className="flex flex-col space-y-2">
              <DetailsContainer>
                <div className="flex flex-col">
                  <DoubleCurrencyLogo token0={token0} token1={token1} size={8} />

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between md:space-x-8">
                    <div className="flex flex-wrap items-baseline space-x-2">
                      <div className="flex items-center space-x-1 text-xl font-bold leading-6 tracking-thin text-marginalGray-200">
                        <pre>{token0?.symbol}</pre>
                        <div className="my-auto text-lg font-bold">/</div>
                        <pre>{token1?.symbol}</pre>
                      </div>
                    </div>
                    <AssetPairPriceRatio
                      token0={token0}
                      token1={token1}
                      price={poolPrice}
                      useInverse={useInverse}
                      onToggleInverse={onToggleInverse}
                      size="sm"
                    />
                  </div>
                </div>

                <div className="my-4 h-[1px] bg-marginalGray-200/20" />

                <div className="space-y-1">
                  <ListRow
                    item="Health Factor"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <HealthFactorIcon />
                        <div className={`${healthFactorIndicator}`}>{healthFactor}</div>
                      </div>
                    }
                  />
                  <ListRow
                    item="Pool price"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{poolPrice}</pre>
                        {!useInverse ? (
                          <div className="flex items-center">
                            <pre>{token1?.symbol}</pre>
                            <div>/</div>
                            <pre>{token0?.symbol}</pre>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <pre>{token0?.symbol}</pre>
                            <div>/</div>
                            <pre>{token1?.symbol}</pre>
                          </div>
                        )}
                      </div>
                    }
                  />
                  <ListRow
                    item="Oracle price"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{oraclePrice}</pre>
                        {!useInverse ? (
                          <div className="flex items-center">
                            <pre>{token1?.symbol}</pre>
                            <div>/</div>
                            <pre>{token0?.symbol}</pre>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <pre>{token0?.symbol}</pre>
                            <div>/</div>
                            <pre>{token1?.symbol}</pre>
                          </div>
                        )}
                      </div>
                    }
                  />
                  <ListRow
                    item="Funding rate"
                    value={
                      <div
                        className={`flex items-baseline space-x-1 ${fundingRateIndicator}`}
                      >
                        <pre>{fundingRate}% weekly</pre>
                      </div>
                    }
                  />
                  <ListRow
                    item="Size"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{quotedSize}</pre>
                        <pre>{marginToken?.symbol}</pre>
                      </div>
                    }
                  />
                </div>

                <div className="my-4 h-[1px] bg-marginalGray-200/20" />

                <div className="space-y-1">
                  <ListRow
                    item="Liquidation price"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{liquidationPrice}</pre>
                        {!useInverse ? (
                          <div className="flex items-center">
                            <pre>{token1?.symbol}</pre>
                            <div>/</div>
                            <pre>{token0?.symbol}</pre>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <pre>{token0?.symbol}</pre>
                            <div>/</div>
                            <pre>{token1?.symbol}</pre>
                          </div>
                        )}
                      </div>
                    }
                  />
                  <ListRow
                    item="Collateral"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{quotedMargin}</pre>
                        <pre>{marginToken?.symbol}</pre>
                      </div>
                    }
                  />

                  <ListRow
                    item="Debt"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{quotedDebt}</pre>
                        <pre>{debtToken?.symbol}</pre>
                      </div>
                    }
                  />
                </div>
              </DetailsContainer>

              <DetailsContainer>
                <div className="mb-4 text-marginalGray-200">Execution Details</div>
                <div className="space-y-1">
                  <ListRow
                    item="Impact"
                    value={
                      <div
                        className={`flex items-baseline space-x-1 ${priceImpactIndicator}`}
                      >
                        <pre>{priceImpact}%</pre>
                      </div>
                    }
                  />
                  <ListRow
                    item="Leverage"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{leverage}x</pre>
                      </div>
                    }
                  />
                  <ListRow
                    item="Max leverage"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        {leverageMax}x
                      </div>
                    }
                  />
                </div>

                <div className="my-4 h-[1px] bg-marginalGray-200/20" />

                <div className="space-y-1">
                  <ListRow
                    item="Escrow Rewards"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{escrowRewards}</pre>
                        <pre className="text-xs">ETH</pre>
                      </div>
                    }
                  />
                  <ListRow
                    item="Fee"
                    value={
                      <div className="flex items-baseline space-x-1 text-marginalGray-200">
                        <pre>{quotedFees}</pre>
                        <pre className="text-xs">
                          {useGas ? gasToken?.symbol : marginToken?.symbol}
                        </pre>
                      </div>
                    }
                  />
                </div>
              </DetailsContainer>
            </div>
          </div>
          <div className="px-4 pb-4">
            <TradeButton
              mintCallback={mintCallback}
              isPendingWallet={isPendingWallet}
              isPendingApprove={isPendingApprove}
              isPendingTx={isPendingTx}
              isTxSubmitted={isTxSubmitted}
              txError={txError}
            />
          </div>
        </div>
      )}
    </Modal>
  )
}

const DetailsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full p-4 text-xs font-bold leading-4 uppercase rounded-lg bg-marginalBlack h-fit tracking-thin text-marginalGray-600">
      {children}
    </div>
  )
}

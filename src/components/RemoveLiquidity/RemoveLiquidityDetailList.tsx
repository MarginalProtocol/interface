import { Token } from "../../types"
import { ListRow } from "../List/ListRow"
import CurrencyLogo from "../Logo/CurrencyLogo"
import { CircularProgressBar } from "src/pages/Pool"
export const RemoveLiquidityDetailList = ({
  token0,
  token1,
  quotedToken0Amount,
  quotedToken1Amount,
  poolUtilizationPercentage,
  userOwnedPoolSharePercentage,
}: {
  token0: Token | null | undefined
  token1: Token | null | undefined
  quotedToken0Amount: string | null | undefined
  quotedToken1Amount: string | null | undefined
  poolUtilizationPercentage: number
  userOwnedPoolSharePercentage: number
}) => {
  return (
    <div className="space-y-2 py-2 text-sm leading-4 font-bold tracking-thin uppercase text-marginalGray-600">
      <ListRow
        item={`Pooled ${token0?.symbol}`}
        value={
          <div className="flex items-center space-x-1 text-marginalGray-200">
            <pre>{quotedToken0Amount ?? "-"}</pre>
            <CurrencyLogo token={token0} size={4} />
            <pre>{token0?.symbol}</pre>
          </div>
        }
      />
      <ListRow
        item={`Pooled ${token1?.symbol}`}
        value={
          <div className="flex items-center space-x-1 text-marginalGray-200">
            <pre>{quotedToken1Amount ?? "-"}</pre>
            <CurrencyLogo token={token1} size={4} />
            <pre>{token1?.symbol}</pre>
          </div>
        }
      />
      <ListRow
        item={`Pool Utilization`}
        value={
          <div className="flex items-center space-x-1 text-marginalGray-200">
            <pre>{poolUtilizationPercentage.toFixed(2)}%</pre>
            <CircularProgressBar
              sqSize={16}
              strokeWidth={2}
              percentage={poolUtilizationPercentage}
            />
          </div>
        }
      />
      <ListRow
        item={`Your Share`}
        value={
          <div className="flex items-center space-x-1 text-marginalGray-200">
            <pre>{userOwnedPoolSharePercentage.toFixed(2)}%</pre>
            <CircularProgressBar
              sqSize={16}
              strokeWidth={2}
              percentage={userOwnedPoolSharePercentage}
            />
          </div>
        }
      />
    </div>
  )
}

import _ from "lodash"
import { BigNumberish } from "ethers"
import { useParams } from "react-router-dom"
import { useNavigateRoutes } from "../hooks/useNavigateRoutes"
import { getPoolAddress, getPoolDataByAddress, usePoolsData } from "../hooks/usePoolsData"
import { ManagePoolContainer } from "../components/ManagePool/ManagePoolContainer"
import { ManagePoolCard } from "../components/ManagePool/ManagePoolCard"
import { ManagePoolHeader } from "../components/ManagePool/ManagePoolTokensHeader"
import { useViewPoolsState } from "../hooks/useViewPoolsState"
import { useAccount } from "wagmi"
import { useUserPoolBalance } from "../hooks/useUserPoolBalance"
import { usePoolLiquidityLocked } from "../hooks/usePoolLiquidityLocked"
import { getMaxLeverage } from "../functions/getMaxLeverage"

const ManagePool = () => {
  const { pools } = usePoolsData()
  const { address } = useAccount()

  const userPoolBalances = useUserPoolBalance(pools, address)
  const poolLiquidityLocked = usePoolLiquidityLocked(pools)

  const { poolAddress: poolAddressKey } = useParams()
  const { poolsDataByAddress } = usePoolsData()

  const { onNavigateToPools, onNavigateToAddLiquidity, onNavigateToRemoveLiquidity } =
    useNavigateRoutes()

  const poolAddress = getPoolAddress(poolAddressKey)
  const poolData = getPoolDataByAddress(poolAddress, poolsDataByAddress)

  const {
    token0,
    token1,
    oracleAddress,
    maintenance,
    decimals: poolDecimals,
  } = poolData || {}

  const poolState = useViewPoolsState(poolAddress)

  const { liquidity: poolLiquidity } = poolState

  const leverageMax = getMaxLeverage(maintenance as string)
  const poolLiquidityLockedIndex = poolLiquidityLocked?.[0]?.liquidityLocked

  const handleReturnToPools = () => onNavigateToPools()
  const handleRedirectToAddLiquidity = () => onNavigateToAddLiquidity(poolAddress)
  const handleRedirectToRemoveLiquidity = () => onNavigateToRemoveLiquidity(poolAddress)

  const totalPoolLiquidity =
    !_.isUndefined(poolLiquidityLockedIndex) && !_.isUndefined(poolLiquidity)
      ? poolLiquidity + poolLiquidityLockedIndex
      : undefined

  const poolUtilization =
    !_.isUndefined(poolLiquidityLockedIndex) && !_.isUndefined(totalPoolLiquidity)
      ? Number(poolLiquidityLockedIndex) / Number(totalPoolLiquidity)
      : undefined

  return (
    <ManagePoolContainer>
      <>
        <div className="flex border-b-2 border-borderGray">
          <div
            onClick={handleReturnToPools}
            className="py-3 text-sm font-bold tracking-wide uppercase transition duration-200 ease-in-out cursor-pointer text-textGray hover:text-marginalOrange-500"
          >
            Back To Pools
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between">
          <ManagePoolHeader
            token0Symbol={token0?.symbol}
            token1Symbol={token1?.symbol}
            token0Address={token0?.address}
            token1Address={token1?.address}
            leverageMax={leverageMax}
            poolUtilization={poolUtilization}
          />
          <div className="flex flex-row items-center mt-3 lg:mt-0 gap-x-2">
            <button
              className={`
                w-full text-sm tracking-wide text-nowrap px-4 py-3 rounded-xl  uppercase
                bg-marginalOrange-500 text-white border-2 border-borderGray 
                disabled:bg-marginalGray-850 disabled:text-textGray
              `}
              onClick={handleRedirectToAddLiquidity}
            >
              Increase Liquidity
            </button>

            <button
              className={`
                w-full text-sm tracking-wide text-nowrap px-4 py-3 rounded-xl  uppercase
                text-marginalGray-200 border-2 border-borderGray 
                disabled:bg-marginalGray-850 disabled:text-textGray
              `}
              onClick={handleRedirectToRemoveLiquidity}
            >
              Remove Liquidity
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-5 lg:flex-row lg:space-y-0 lg:space-x-5">
          <ManagePoolCard title="Liquidity" token0={token0} token1={token1} />
          <ManagePoolCard title="Collected Fees" token0={token0} token1={token1} />
        </div>
      </>
    </ManagePoolContainer>
  )
}

export default ManagePool

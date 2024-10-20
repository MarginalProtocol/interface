import { Routes as BrowserRoutes, Route } from "react-router-dom"
import { Header } from "../components/Header/Header"
import Trade from "../pages/Trade"
import Swap from "../pages/Swap"
import Pools from "../pages/Pools"
import AddLiquidity from "../pages/AddLiquidity"
import RemoveLiquidity from "../pages/RemoveLiquidity"
import Pool from "../pages/Pool"
import ManagePosition from "../pages/ManagePosition"
import ClosePosition from "../pages/ClosePosition"
import Positions from "../pages/Positions"
import Position from "../pages/Position"
import { MobileMenuFooter } from "src/components/MobileMenu/MobileMenu"
import Stake from "src/pages/Stake"
import Unstake from "src/pages/Unstake"

function Routes() {
  return (
    <div className="min-h-dvh sm:h-fit sm:min-h-dvh ">
      <Header />
      <div id="body-wrapper" className="relative flex flex-col w-full p-4 md:pt-24">
        <BrowserRoutes>
          <Route path="positions/position/close/:indexedId" element={<ClosePosition />} />
          <Route
            path="positions/position/manage/:positionKey"
            element={<ManagePosition />}
          />
          <Route path="/pools/unstake/:poolAddress" element={<Unstake />} />
          <Route path="/pools/stake/:poolAddress" element={<Stake />} />
          <Route path="/pools/:poolAddress" element={<Pool />} />
          <Route
            path="/pools/liquidity/remove/:poolAddress"
            element={<RemoveLiquidity />}
          />
          <Route path="/pools/liquidity/add/:poolAddress" element={<AddLiquidity />} />
          <Route path="/positions/position/:positionKey" element={<Position />} />
          <Route path="/positions" element={<Positions />} />
          <Route path="/pools" element={<Pools />} />
          <Route path="/swap" element={<Swap />} />
          <Route path="/" element={<Trade />} />
        </BrowserRoutes>
      </div>
      <MobileMenuFooter />
    </div>
  )
}

export default Routes

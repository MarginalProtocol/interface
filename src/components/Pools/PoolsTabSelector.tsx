import { motion } from "framer-motion"

export const PoolsTabSelector = ({
  view,
  handlePrimaryClick,
  handleSecondaryClick,
}: {
  view: string
  handlePrimaryClick?: any
  handleSecondaryClick?: any
}) => {
  return (
    <div id="pools-tab-selector" className="flex h-10 w-fit">
      <div className="flex">
        <button
          key={`incentivized-tab`}
          onClick={(e: any) => handlePrimaryClick(e)}
          className={`relative w-[135px] pt-2 px-4 pb-4
                text-sm leading-4 font-bold tracking-thin uppercase
                ${view === "Incentivized" ? "text-marginalGray-200" : "text-marginalGray-600 hover:text-marginalGray-400"}`}
        >
          Incentivized
          {view === "Incentivized" && (
            <motion.div
              layoutId="indicator"
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-marginalOrange-500"
            />
          )}
        </button>
        <button
          key={`unincentivized-tab`}
          onClick={(e: any) => handleSecondaryClick(e)}
          className={`relative w-[135px] pt-2 px-4 pb-4
                text-sm leading-4 font-bold tracking-thin uppercase
                ${view === "Incentivized" ? "text-marginalGray-200" : "text-marginalGray-600 hover:text-marginalGray-400"}`}
        >
          Unincentivized
          {view === "Unincentivized" && (
            <motion.div
              layoutId="indicator"
              className="absolute bottom-0 left-0 right-0 h-[1px] bg-marginalOrange-500"
            />
          )}
        </button>
      </div>
    </div>
  )
}

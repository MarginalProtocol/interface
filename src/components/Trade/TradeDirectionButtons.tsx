import _ from "lodash"
import { motion } from "framer-motion"

export const TradeDirectionButtons = ({
  isLong,
  onSelect,
}: {
  isLong: boolean | null
  onSelect: (selected: boolean) => void
}) => {
  return (
    <div
      id="trade-direction-buttons"
      className="grid w-full grid-cols-2 p-1 uppercase rounded-xl bg-marginalBlack shadow-innerBlack text-sm md:text-base"
    >
      <SelectButtons onSelect={onSelect} isLong={Boolean(isLong)} />
    </div>
  )
}

const SelectButtons = ({
  onSelect,
  isLong,
}: {
  onSelect: (selected: boolean) => void
  isLong: boolean
}) => {
  return (
    <>
      <button
        id="long-btn"
        onClick={() => onSelect(true)}
        className={`${
          isLong
            ? "text-white"
            : "bg-marginalBlack text-marginalGray-200 hover:bg-success-500/10"
        } relative h-[38px] flex justify-center rounded-lg uppercase tracking-wide cursor-pointer transition`}
      >
        {isLong && (
          <motion.span
            layoutId="trade-bubble"
            className="absolute inset-0 z-10 rounded-lg bg-success-500 "
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="z-10 m-auto font-bold">Long</span>
      </button>
      <button
        id="short-btn"
        onClick={() => onSelect(false)}
        className={`${
          !_.isNull(isLong) && !isLong
            ? "text-white"
            : "bg-marginalBlack text-marginalGray-200 hover:bg-error-500/10"
        } relative h-[38px] flex justify-center rounded-lg uppercase tracking-wide cursor-pointer transition`}
      >
        {!_.isNull(isLong) && !isLong && (
          <motion.span
            layoutId="trade-bubble"
            className="absolute inset-0 z-10 rounded-lg bg-error-500 "
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="z-10 m-auto font-bold">Short</span>
      </button>
    </>
  )
}

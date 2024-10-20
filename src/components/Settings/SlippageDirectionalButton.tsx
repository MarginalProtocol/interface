import { motion } from "framer-motion"

export const SlippageDirectionButtons = ({
  isAuto,
  onSelect,
}: {
  isAuto: boolean | null
  onSelect: (selected: boolean) => void
}) => {
  return (
    <div
      id="slippage-direction-buttons"
      className="grid w-full max-w-[172px] grid-cols-2 items-center p-1 rounded-lg bg-marginalBlack gap-1"
    >
      <SelectButtons onSelect={onSelect} isAuto={Boolean(isAuto)} />
    </div>
  )
}

const SelectButtons = ({
  onSelect,
  isAuto,
}: {
  onSelect: (selected: boolean) => void
  isAuto: boolean
}) => {
  return (
    <>
      <button
        id="auto-slippage-btn"
        onClick={() => onSelect(true)}
        className={`${
          isAuto
            ? "text-marginalOrange-500"
            : "bg-marginalBlack text-marginalGray-200 hover:bg-marginalOrange-500/10"
        } relative h-6 p-1 flex justify-center rounded-lg text-sm leading-4 tracking-thin font-bold uppercase cursor-pointer transition`}
      >
        {isAuto && (
          <motion.span
            layoutId="slippage-bubble"
            className="absolute inset-0 z-10 rounded-lg bg-marginalOrange-800 "
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="z-10 m-auto">Auto</span>
      </button>
      <button
        id="custom-slippage-btn"
        onClick={() => onSelect(false)}
        className={`${
          !isAuto
            ? "text-marginalOrange-500"
            : "bg-marginalBlack text-marginalGray-200 hover:bg-marginalOrange-500/10"
        } relative h-6 p-1 flex justify-center rounded-lg text-sm leading-4 tracking-thin font-bold uppercase cursor-pointer transition`}
      >
        {!isAuto && (
          <motion.span
            layoutId="slippage-bubble"
            className="absolute inset-0 z-10 rounded-md bg-marginalOrange-800 "
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
        <span className="z-10 m-auto">Custom</span>
      </button>
    </>
  )
}

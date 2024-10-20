import { motion } from "framer-motion"

export const DirectionToggle = ({
  view,
  handlePrimaryClick,
  handleSecondaryClick,
  primaryText = "Open",
  secondaryText = "Closed",
}: {
  view: string
  handlePrimaryClick?: any
  handleSecondaryClick?: any
  primaryText?: string
  secondaryText?: string
}) => {
  return (
    <div className="w-full h-10 bg-marginalBlack rounded-2xl p-1 gap-1">
      <div className="grid w-full grid-cols-2">
        <button
          key="primary-positions-btn"
          onClick={handlePrimaryClick}
          className={`${
            view === primaryText
              ? "text-marginalOrange-500 shadow-outerBlue"
              : "hover:bg-marginalGray-950 text-marginalGray-200"
          } relative h-8 w-full py-1 px-2 flex items-center justify-center rounded-xl text-sm leading-4 tracking-thin font-bold uppercase cursor-pointer transition`}
        >
          {view === primaryText && (
            <motion.span
              layoutId="position-bubble"
              className="absolute inset-0 z-10 rounded-xl bg-marginalOrange-800"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="z-10">{primaryText}</span>
        </button>
        <button
          key="secondary-positions-btn"
          onClick={handleSecondaryClick}
          className={`
          ${view === secondaryText ? "text-marginalOrange-500 shadow-outerBlue" : "hover:bg-marginalGray-950 text-marginalGray-200"} 
          relative h-8 w-full py-1 px-2 flex items-center justify-center rounded-xl text-sm leading-4 tracking-thin font-bold uppercase cursor-pointer transition
        `}
        >
          {view === secondaryText && (
            <motion.span
              layoutId="position-bubble"
              className="absolute inset-0 z-10 rounded-xl bg-marginalOrange-800"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="z-10">{secondaryText}</span>
        </button>
      </div>
    </div>
  )
}

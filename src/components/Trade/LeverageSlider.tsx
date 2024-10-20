import { isNull } from "lodash"
import { HealthFactorIcon } from "../Icons/HealthFactorIcon"

export const LeverageSlider = ({
  selectedLeverage,
  maxLeverage,
  onSelect,
  healthFactor,
}: {
  selectedLeverage: number
  maxLeverage: number | undefined
  onSelect: (value: number) => void
  healthFactor: number | null
}) => {
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

  const handleLeverageChange = (event: any) => {
    const newLeverage = parseFloat(event.target.value)
    onSelect(newLeverage)
  }

  return (
    <div
      id="leverage-slider"
      className={`
        flex flex-col items-start p-4
        rounded-xl bg-marginalBlack shadow-innerBlack 
        focus-within:shadow-innerWhite font-bold tracking-wide
        text-marginalGray-600
      `}
    >
      <div className="mb-2 text-sm tracking-thin font-bold text-center uppercase md:text-base">
        Leverage: {selectedLeverage}x
      </div>
      <input
        type="range"
        min={1.1}
        max={maxLeverage ? maxLeverage - 0.1 : 4.9}
        step={0.1}
        value={selectedLeverage}
        onChange={handleLeverageChange}
        className="w-full cursor-pointer bg-marginalGray-600 accent-marginalOrange-500"
      />
      <div className="mt-1 w-full flex justify-between text-sm tracking-thin font-bold md:text-base">
        <div>1.1x</div>
        <div>5x</div>
      </div>

      {healthFactor && (
        <>
          <div className="my-4 w-full h-[1px] bg-marginalGray-200/20" />
          <div className="w-full flex justify-between text-sm tracking-thin font-bold uppercase md:text-base">
            <div className="">Health Factor</div>

            <div className="flex items-center space-x-1 ">
              <HealthFactorIcon />
              <div className={`${healthFactorIndicator}`}>{healthFactor}</div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

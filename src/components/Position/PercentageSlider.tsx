import JSBI from "jsbi"
import { formatBigIntToString } from "src/utils/formatBigIntToString"

const calculateMarginWithPercentage = (
  rawPositionMargin: bigint,
  percentage: number,
  decimals: number,
) => {
  const percentageMultipliedBy100 = percentage * 100
  const positionMargin = JSBI.BigInt(rawPositionMargin.toString())
  const numerator = JSBI.multiply(
    JSBI.BigInt(percentageMultipliedBy100.toString()),
    positionMargin,
  )
  const denominator = JSBI.BigInt("10000")
  const quotient = JSBI.divide(numerator, denominator)
  return formatBigIntToString(BigInt(quotient.toString()), decimals)
}

export const PercentageSlider = ({
  userInput,
  isInputValid,
  formattedBalance,
  margin,
  decimals,
  onUserInput,
  selectedPercentage,
  setPercentage,
  setPercentError,
  percentError,
}: {
  userInput: string
  isInputValid: boolean
  formattedBalance: string | undefined
  margin: bigint | undefined
  decimals: number | undefined
  onUserInput: (value: string) => void
  selectedPercentage: number
  setPercentage: React.Dispatch<React.SetStateAction<number>>
  setPercentError: React.Dispatch<React.SetStateAction<boolean>>
  percentError: boolean
}) => {
  const handleApplyPercentage = (percentage: number) => {
    if (!margin || !decimals || !formattedBalance) return

    if (Number(formattedBalance) === 0) return

    setPercentage(percentage)
    if (percentage < 100) {
      const formattedInput = calculateMarginWithPercentage(margin, percentage, decimals)
      if (formattedInput) onUserInput(Number(formattedInput).toString())
    } else {
      onUserInput(Number(formattedBalance).toString())
    }
    setPercentError(false)
  }

  const handlePercentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!margin || !decimals || !formattedBalance) return

    if (Number(formattedBalance) === 0) return

    const newPercent = Number(event.target.value)
    const formattedInput = calculateMarginWithPercentage(margin, newPercent, decimals)
    if (formattedInput) onUserInput(Number(formattedInput).toString())
    handleApplyPercentage(newPercent)
  }

  return (
    <div
      id="percentage-slider"
      className={`
        flex flex-col items-start p-4 h-24
        rounded-2xl bg-marginalBlack shadow-innerBlack 
        focus-within:shadow-innerWhite font-bold tracking-wide
        space-y-1
      `}
    >
      <div className="flex items-center space-x-2">
        <div className="text-sm leading-4 tracking-thin font-bold uppercase text-marginalGray-600">
          Amount
        </div>
        <div
          className={`text-sm leading-4 tracking-thin font-bold ${percentError ? "text-error-500" : "text-marginalGray-400"}`}
        >
          {percentError ? "> 100" : selectedPercentage}%
        </div>
      </div>
      <div className="flex flex-col w-full space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={percentError ? 100 : selectedPercentage}
          onChange={handlePercentChange}
          className={`w-full cursor-pointer bg-marginalGray-600 accent-marginalOrange-500`}
          disabled={Number(formattedBalance) === 0}
        />

        <div className="justify-end flex space-x-4 text-xs uppercase text-marginalOrange-500">
          <button className="" onClick={() => handleApplyPercentage(0)}>
            0
          </button>
          <button className="" onClick={() => handleApplyPercentage(25)}>
            25%
          </button>
          <button className="" onClick={() => handleApplyPercentage(50)}>
            50%
          </button>
          <button className="" onClick={() => handleApplyPercentage(75)}>
            75%
          </button>
          <button className="" onClick={() => handleApplyPercentage(100)}>
            Max
          </button>
        </div>
      </div>
    </div>
  )
}

import { useEffect, useState } from "react"
import { cleanInput } from "../../utils/cleanInput"

export const SlippageInput = ({
  inputValue,
  onChange,
  isAuto,
  onSetAuto,
}: {
  inputValue: string
  onChange: (value: string) => void
  isAuto: boolean
  onSetAuto: (selected: boolean) => void
}) => {
  const [maxSlippageError, setMaxSlippageError] = useState<boolean>(false)

  useEffect(() => {
    if (isAuto) {
      onChange(cleanInput("0.5"))
    }
  }, [isAuto, inputValue, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(cleanInput(e.target.value))
    onSetAuto(false)
    if (Number(e.target.value) === 0 || Number(e.target.value) > 50) {
      setMaxSlippageError(true)
    } else {
      setMaxSlippageError(false)
    }
  }

  const handleBlur = (): void => {
    if (Number(inputValue) === 0 || Number(inputValue) > 50) {
      onChange(cleanInput("0.5"))
      setMaxSlippageError(false)
    }
  }

  const handleFocus = (): void => {
    if (isAuto) {
      onSetAuto(false)
    }
  }

  return (
    <div
      id="slippage-input"
      className={`
        h-8 max-w-32 w-full flex space-x-1 bg-marginalBlack text-marginalGray-200 
        text-sm leading-4 tracking-thin font-bold px-3 py-2 items-center rounded-lg
      `}
    >
      <input
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        placeholder="0"
        min="0.01"
        max="50"
        pattern="^[0-9]*[.,]?[0-9]*$"
        autoComplete="off"
        className={`
          h-8 w-full text-sm leading-4 tracking-thin font-bold p-0 border-none outline-none bg-marginalBlack text-right text-marginalGray-600
          focus:outline-none focus:ring-0 focus:border-none disabled:text-marginalGray-600
          ${maxSlippageError && "text-red-500"}
        `}
        name="slippage-input"
      />
      <label htmlFor="slippage-input text-marginalGray-100">% </label>
    </div>
  )
}

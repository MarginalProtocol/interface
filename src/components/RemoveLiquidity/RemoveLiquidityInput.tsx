import { cleanInput } from "src/utils/cleanInput"

export const RemoveLiquidityInput = ({
  inputValue,
  totalLiquidity,
  onChange,
  setPercentage,
  setPercentError,
}: {
  inputValue: string
  totalLiquidity: string | undefined
  onChange: (value: string) => void
  setPercentage: React.Dispatch<React.SetStateAction<number>>
  setPercentError: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const handleApplyFloatToPercentage = (value: string) => {
    if (Number(totalLiquidity) === 0) return

    const percentage = Number(((Number(value) / Number(totalLiquidity)) * 100).toFixed(0))
    if (percentage <= 100) {
      setPercentage(percentage)
      setPercentError(false)
    } else {
      setPercentage(0)
      setPercentError(true)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(cleanInput(e.target.value))
    handleApplyFloatToPercentage(e.target.value)
  }
  return (
    <div id="remove-liquidity-input">
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder="0"
        pattern="^[0-9]*[.,]?[0-9]*$"
        autoComplete="off"
        className={`
          w-full p-0 text-3xl leading-8 tracking-thin font-bold 
          border-none outline-none
          bg-marginalBlack text-marginalGray-200 
          focus:outline-none focus:ring-0 focus:border-none
          caret-marginalOrange-500
        `}
      />
    </div>
  )
}

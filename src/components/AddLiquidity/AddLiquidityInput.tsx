import { cleanInput } from "../../utils/cleanInput"

export const AddLiquidityInput = ({
  inputValue,
  onChange,
}: {
  inputValue: string
  onChange: (value: string) => void
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(cleanInput(e.target.value))
  }
  return (
    <div id="add-liquidity-input">
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

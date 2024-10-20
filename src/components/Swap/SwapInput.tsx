import { cleanInput } from "../../utils/cleanInput"

export const SwapInput = ({
  title,
  inputValue,
  onChange,
}: {
  title: string
  inputValue: string
  onChange: (value: string) => void
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(cleanInput(e.target.value))
  }

  return (
    <div id="swap-input" className="flex-1 space-y-1">
      <div className="text-sm font-bold uppercase text-textGray md:text-base">
        {title}
      </div>
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder="0"
        pattern="^[0-9]*[.,]?[0-9]*$"
        autoComplete="off"
        className={`
          w-full p-0 font-bold border-none outline-none
          bg-marginalBlack text-marginalGray-200 text-3xl 
          focus:outline-none focus:ring-0 focus:border-none
        `}
      />
    </div>
  )
}

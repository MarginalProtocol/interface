import { cleanInput } from "../../utils/cleanInput"

export const TradeInput = ({
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
    <div id="trade-input" className="flex-1 space-y-1">
      <div className="text-sm tracking-thin font-bold uppercase text-textGray md:text-base">
        {title}
      </div>
      <input
        value={inputValue}
        onChange={handleChange}
        placeholder="0"
        pattern="^[0-9]*[.,]?[0-9]*$"
        autoComplete="off"
        className={`
          w-full p-0 text-3xl tracking-thin font-bold 
          border-none outline-none
          bg-marginalBlack text-marginalGray-200 
          focus:outline-none focus:ring-0 focus:border-none
          caret-marginalOrange-500
        `}
      />
    </div>
  )
}

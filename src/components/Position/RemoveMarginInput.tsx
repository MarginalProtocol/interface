import { cleanInput } from "src/utils/cleanInput"

export const RemoveMarginInput = ({
  title,
  inputValue,
  totalBalance,
  onChange,
  setPercentage,
  setPercentError,
}: {
  title: string
  inputValue: string
  totalBalance: string | undefined
  onChange: (value: string) => void
  setPercentage: React.Dispatch<React.SetStateAction<number>>
  setPercentError: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const handleApplyFloatToPercentage = (value: string) => {
    const percentage = Number(((Number(value) / Number(totalBalance)) * 100).toFixed(0))
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
    <div id="remove-margin-input" className="flex-1 space-y-1">
      <div className="text-sm leading-4 tracking-thin font-bold uppercase text-textGray">
        {title}
      </div>
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
        `}
      />
    </div>
  )
}

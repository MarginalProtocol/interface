import { useState } from "react"
import { cleanInput } from "../../utils/cleanInput"

export const TransactionDeadlineInput = ({
  inputValue,
  onChange,
}: {
  inputValue: string
  onChange: (value: string) => void
}) => {
  const [transactionDeadlineError, setTransactionDeadlineError] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(cleanInput(e.target.value))

    if (Number(e.target.value) === 0 || Number(e.target.value) > 999) {
      setTransactionDeadlineError(true)
    } else {
      setTransactionDeadlineError(false)
    }
  }

  const handleBlur = (): void => {
    if (Number(inputValue) === 0 || Number(inputValue) > 999) {
      onChange(cleanInput("10"))
      setTransactionDeadlineError(false)
    }
  }

  return (
    <div
      id="transaction-deadline-input"
      className={`
        h-8 min-w-full flex space-x-1 bg-marginalBlack text-marginalGray-200 
        text-sm leading-4 tracking-thin font-bold rounded-lg items-center px-3 py-2
      `}
    >
      <input
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="10"
        min="1"
        max="999"
        pattern="^[0-9]*[.,]?[0-9]*$"
        autoComplete="off"
        className={`
          h-8 w-full text-sm leading-4 tracking-thin font-bold p-0 border-none outline-none bg-marginalBlack text-right text-marginalGray-600
          focus:outline-none focus:ring-0 focus:border-none
          ${transactionDeadlineError && "text-red-500"}
        `}
        name="transaction-deadline-input"
      />
      <label htmlFor="transaction-deadline-input text-marginalGray-100">M</label>
    </div>
  )
}

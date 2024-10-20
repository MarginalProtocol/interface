export const SwapOutput = ({
  title,
  outputValue,
}: {
  title: string
  outputValue: string | undefined
}) => {
  return (
    <div id="swap-output" className="flex-1 space-y-1">
      <div className="text-sm font-bold uppercase text-textGray md:text-base">
        {title}
      </div>
      <input
        readOnly
        value={outputValue}
        placeholder="-"
        className={`
          w-full p-0 font-bold border-none outline-none 
          bg-marginalBlack text-marginalGray-200 text-3xl 
          focus:outline-none focus:ring-0 focus:border-none
        `}
      />
    </div>
  )
}

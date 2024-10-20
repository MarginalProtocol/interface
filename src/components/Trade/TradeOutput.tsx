export const TradeOutput = ({
  title,
  outputValue,
  secondaryColor = false,
}: {
  title: string
  outputValue: string | undefined
  secondaryColor?: boolean
}) => {
  return (
    <div id="trade-output" className="flex-1 space-y-1">
      <div className="text-sm tracking-thin font-bold uppercase text-textGray md:text-base">
        {title}
      </div>
      <input
        readOnly
        value={outputValue}
        placeholder="0"
        className={`
          w-full p-0 text-3xl tracking-thin font-bold 
          border-none outline-none 
          ${secondaryColor ? "bg-marginalGray-950" : "bg-marginalBlack"}
          text-marginalGray-200
          focus:outline-none focus:ring-0 focus:border-none
        `}
      />
    </div>
  )
}

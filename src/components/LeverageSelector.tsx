export const LeverageSelector = ({
  selectedLeverage,
  onSelect,
}: {
  selectedLeverage: number
  onSelect: (value: number) => void
}) => {
  return (
    <div
      id="leverage-selector"
      className="flex justify-between p-5 rounded-full bg-marginalBlack"
    >
      <SelectorButton value={2} selectedLeverage={selectedLeverage} onSelect={onSelect} />
      <SelectorButton value={3} selectedLeverage={selectedLeverage} onSelect={onSelect} />
      <SelectorButton value={4} selectedLeverage={selectedLeverage} onSelect={onSelect} />
      <SelectorButton value={5} selectedLeverage={selectedLeverage} onSelect={onSelect} />
    </div>
  )
}

const SelectorButton = ({
  value,
  selectedLeverage,
  onSelect,
}: {
  value: number
  selectedLeverage: number
  onSelect: (value: number) => void
}) => {
  const isSelected = value === selectedLeverage

  const handleSelect = (value: number) => {
    onSelect(value)
  }

  return (
    <div
      id="leverage-selector"
      onClick={() => handleSelect(value)}
      className={`
        py-2 px-4 rounded-full font-bold cursor-pointer
        ${isSelected ? "bg-[#4F4F4F] text-white" : "bg-none text-textGray"}
      `}
    >
      {value}x
    </div>
  )
}

export default function ToggleButton({
  isToggled,
  handleClick,
}: {
  isToggled: boolean
  handleClick: Function
}) {
  return (
    <div className="relative">
      {/* Switch */}
      <button
        className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer border border-transparent focus:ring-2 focus:ring-marginalOrange-300
          ${
            isToggled
              ? "bg-marginalOrange-800 hover:border-marginalOrange-600"
              : "bg-marginalGray-800 hover:border-marginalGray-600"
          }
        `}
        onClick={() => handleClick()}
      >
        {/* Handle */}
        <div
          className={`relative w-6 h-6 z-40 rounded-[40px] 
            ${
              isToggled
                ? "translate-x-full transition-all bg-marginalOrange-500"
                : "-translate-x-1/5 transition-all bg-marginalGray-400"
            }
          `}
        />
      </button>
    </div>
  )
}

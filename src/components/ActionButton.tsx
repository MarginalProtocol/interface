export const ActionButton = ({
  action,
  onClick,
  primary = true,
  size = "lg",
  disabled = false,
  textSize = "sm",
}: {
  action: string
  onClick?: any
  primary?: boolean
  size?: "lg" | "sm" | "xs"
  disabled?: boolean
  textSize?: "sm" | "lg"
}) => {
  const primaryClasses =
    "bg-marginalOrange-500 border border-marginalOrange-500 text-marginalGray-100 hover:bg-marginalOrange-600 active:text-[#F1F1F1] active:bg-marginalOrange-800 disabled:border disabled:border-marginalGray-800"

  const secondaryClasses =
    "bg-marginalGray-800 border border-transparent text-marginalGray-200 hover:border-marginalGray-600 active:bg-marginalGray-800 active:border-marginalGray-800 disabled:border disabled:border-transparent"

  return (
    <button
      id={`${action}-button`}
      onClick={onClick}
      className={`
        ${size === "lg" ? "h-11 py-3.5 px-7" : size === "sm" ? "h-10 py-3 px-4" : ""}
        ${primary ? primaryClasses : secondaryClasses} 
        ${textSize === "lg" ? "text-sm md:text-base" : "text-sm"}
        w-full flex justify-center items-center focus:outline-none focus:ring-1 focus:ring-marginalOrange-300 disabled:bg-marginalGray-900 disabled:text-marginalGray-600 text-sm tracking-thin font-bold uppercase rounded-xl whitespace-nowrap`}
      disabled={disabled}
    >
      {action}
    </button>
  )
}

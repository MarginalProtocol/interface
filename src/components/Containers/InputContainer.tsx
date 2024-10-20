export const InputContainer = ({
  id,
  children,
  secondaryColor = false,
}: {
  id: string
  children: any
  secondaryColor?: boolean
}) => {
  return (
    <div
      id={id}
      className={`
        flex justify-between py-4 px-4 space-x-2 items-center
        rounded-2xl shadow-innerBlack border border-transparent 
        ${secondaryColor ? "bg-marginalGray-950 border border-marginalGray-800 " : "bg-marginalBlack focus-within:border-marginalGray-600"}
      `}
    >
      {children}
    </div>
  )
}

export const Container = ({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) => {
  return (
    <div
      id={id}
      className={`
        rounded-3xl p-px mx-auto my-16 shadow-lg sm:w-[480px]
        bg-gradient-to-b from-[#616161] to-[rgba(79,79,79,0.5)] 
      `}
    >
      <div className="relative p-3 space-y-1  font-bold rounded-3xl bg-marginalGray-850">
        {children}
      </div>
    </div>
  )
}

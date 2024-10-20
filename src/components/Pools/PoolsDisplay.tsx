export const PoolsDisplay = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="pools-display"
      className="
        bg-gradient-to-b from-[#616161] 
        to-[rgba(79,79,79,0.5)] shadow-md
        rounded-2xl p-0.5 mx-auto min-w-128
      "
    >
      <div className="p-4 space-y-3  font-bold shadow-sm rounded-2xl bg-marginalGray">
        {children}
      </div>
    </div>
  )
}

export const PoolsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="pools-container"
      className="w-[343px] md:w-[760px] lg:w-[800px] xl:w-[1000px] min-w-min mx-auto md:mt-12 shadow-none md:shadow-outerBlack rounded-3xl border border-marginalGray-800 md:border-none"
    >
      {children}
    </div>
  )
}

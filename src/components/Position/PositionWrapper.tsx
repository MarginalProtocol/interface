export const PositionWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="position-wrapper"
      className={`
        space-y-4 sm:space-y-6 m-auto
        w-full max-w-[343px] sm:max-w-[440px]
        mb-[96px] md:mb-0 md:mt-8
      `}
    >
      {children}
    </div>
  )
}

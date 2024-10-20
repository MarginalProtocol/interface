export const HeaderContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="header-container"
      className="p-5 fixed top-0 left-0 z-30 w-full bg-transparent"
    >
      {children}
    </div>
  )
}

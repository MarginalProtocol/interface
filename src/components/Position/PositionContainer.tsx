export const PositionContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="position-container"
      className={`
        p-4 space-y-4 m-auto mt-10
      `}
    >
      {children}
    </div>
  )
}

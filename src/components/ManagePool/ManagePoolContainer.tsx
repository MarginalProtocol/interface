export const ManagePoolContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      id="manage-pool-container"
      className={`
        p-4 space-y-4 m-auto
        w-full lg:max-w-[800px]
         uppercase
      `}
    >
      {children}
    </div>
  )
}

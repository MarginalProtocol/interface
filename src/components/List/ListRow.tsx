export const ListRow = ({
  item,
  value,
}: {
  item: string | any
  value?: string | any
}) => {
  return (
    <div id="list-row" className="flex items-center justify-between space-x-5">
      <div className="whitespace-nowrap">{item}</div>
      <div className="flex space-x-2 text-right">
        <div className="text-white">{value ? value : "-"}</div>
      </div>
    </div>
  )
}

export const ManagePoolOutput = ({
  outputValue,
}: {
  outputValue: string | undefined
}) => {
  return (
    <div id="trade-output" className="flex-1 py-2 space-y-1">
      <input
        readOnly
        value={outputValue}
        placeholder=""
        className={`
          w-full p-0 font-bold border-none outline-none 
          bg-marginalBlack text-marginalGray-200 text-3xl 
          focus:outline-none focus:ring-0 focus:border-none
        `}
      />
      {/* <div className='text-sm uppercase text-textGray'>$0</div> */}
    </div>
  )
}

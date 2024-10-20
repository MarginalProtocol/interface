import { Token } from "../../types"
import { ListRow } from "../List/ListRow"
import { getAddressLink } from "../../utils/getAddressLink"
import { TokenAsset } from "../Token/TokenAsset"
import { ManagePoolOutput } from "./ManagePoolOutput"

interface Props {
  title: string
  token0: Token | undefined
  token1: Token | undefined
}

export const ManagePoolCard = ({ title, token0, token1 }: Props) => {
  return (
    <div
      id="manage-pool-card"
      className="
        p-0.5 rounded-xl h-fit
        bg-gradient-to-b from-[#616161] 
        to-[rgba(79,79,79,0.5)] 
      "
    >
      <div className="p-2 space-y-2  font-bold rounded-xl bg-marginalGray">
        <div className="p-3 text-xl text-marginalGray-200 uppercase tracking-wide">
          {title}
        </div>
        <div className="py-2 px-4 text-sm divide-y divide-marginalGray-200/20 bg-marginalBlack rounded-lg">
          <ManagePoolOutput outputValue="-" />
          <div className="py-2 space-y-1">
            <ListRow
              item={<TokenAsset token={token0} className="!w-4 !h-4" />}
              // value={<div className=''>0.000045</div>}
            />
            <ListRow
              item={<TokenAsset token={token1} className="!w-4 !h-4" />}
              // value={<div className=''>SIZE</div>}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

import { SettingsModal } from "./SettingsModal"
import { isOnlyZeroes } from "../../utils/isOnlyZeroes"
import { Cog6ToothIcon } from "@heroicons/react/20/solid"

export const SlippageButton = ({
  maxSlippage,
  showSettings,
  showSlippageHeader = true,
  onClose,
  onOpen,
  textSize = "sm",
}: {
  maxSlippage: string
  showSettings: boolean
  showSlippageHeader?: boolean
  onClose: () => void
  onOpen: () => void
  textSize?: "sm" | "lg"
}) => {
  return (
    <div className="relative z-30 my-auto cursor-pointer text-marginalGray-200">
      {isOnlyZeroes(maxSlippage) ? (
        <div
          className="flex items-center py-2 pl-4 pr-3 space-x-2 text-xs hover:opacity-80"
          onClick={showSettings ? onClose : onOpen}
        >
          <Cog6ToothIcon className="w-5 h-5 text-marginalGray-200" />
        </div>
      ) : (
        <div
          className={`h-8 flex items-center py-2 pl-2.5 pr-1.5 space-x-2 ${textSize === "lg" ? "text-xs md:text-sm" : "text-xs"} tracking-thin font-bold uppercase text-marginalGray-400 rounded-xl hover:opacity-80 ${showSlippageHeader ? "bg-marginalGray-800 " : ""}`}
          onClick={showSettings ? onClose : onOpen}
        >
          {showSlippageHeader && <div>{maxSlippage}% slippage</div>}
          <Cog6ToothIcon className="w-6 h-6 text-marginalGray-200" />
        </div>
      )}
      <div className="relative">
        <SettingsModal showSettings={showSettings} onCloseSettings={onClose} />
      </div>
    </div>
  )
}

import { useState } from "react"
import { type Token } from "src/types"
import { TokenAsset } from "../Token/TokenAsset"
import { TokenInfo } from "@uniswap/token-lists"
import { DropdownArrow } from "../DropdownArrow"

export const TokenSelector = ({
  onClick,
  selectedToken,
  tokenOptions,
  onSelect,
  showFullTokenName = false,
  showSwapStyles = false,
}: {
  onClick: () => void
  selectedToken: Token | null
  tokenOptions: (Token | TokenInfo)[] | null
  onSelect: (token: Token) => void
  showFullTokenName?: boolean
  showSwapStyles?: boolean
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const handleOpen = () => setIsOpen(true)

  const handleClose = () => setIsOpen(false)

  const handleSelectToken = (token: Token) => {
    onSelect(token)
    handleClose()
  }

  return (
    <div
      id="token-selector"
      className={`flex items-center justify-between space-x-1 cursor-pointer min-w-fit hover:opacity-60 ${showSwapStyles && !selectedToken ? "px-2.5 py-2 bg-marginalGray-800 rounded-lg text-marginalGray-200" : "text-xl tracking-thin font-bold"}`}
      onClick={onClick}
    >
      <TokenAsset
        token={selectedToken}
        showFullTokenName={showFullTokenName}
        className="!w-6 !h-6"
      />
      <DropdownArrow isActive={false} className="mt-0.5" />
    </div>
  )
}

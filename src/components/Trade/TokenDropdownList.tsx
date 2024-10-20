import { useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Token } from "../../types"
import { TokenSelect } from "./TokenSelect"
import _ from "lodash"
import useCloseOnExternalClick from "../../hooks/useCloseOnExternalClick"
import { DropdownArrow } from "../DropdownArrow"
import { TokenInfo } from "@uniswap/token-lists"

export const TokenDropdownList = ({
  isOpen,
  tokenOptions,
  onSelect,
  onOpen,
  onClose,
}: {
  isOpen: boolean
  tokenOptions: (Token | TokenInfo)[] | null
  onSelect: any
  onOpen: () => void
  onClose: () => void
}) => {
  const dropdownRef = useRef(null)

  useCloseOnExternalClick(dropdownRef, !isOpen ? onClose : () => null)

  const hasTokenOptions = !_.isNull(tokenOptions) && !_.isEmpty(tokenOptions)

  return (
    <div id="token-dropdown-list" className="relative">
      <DropdownArrow isActive={isOpen} />

      {isOpen && (
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0 }}
          animate={
            isOpen
              ? { opacity: 1, transition: { delay: 0.1 } }
              : {
                  opacity: 0,
                }
          }
          className={`
            absolute right-0 z-50 flex flex-col w-48 
            h-auto overflow-hidden rounded-md top-8
            bg-marginalBlack border-2 border-borderGray 
            `}
        >
          {hasTokenOptions &&
            tokenOptions.map((token: Token | TokenInfo, key: number) => (
              <TokenSelect key={key} token={token} onSelect={() => onSelect(token)} />
            ))}
        </motion.div>
      )}
    </div>
  )
}

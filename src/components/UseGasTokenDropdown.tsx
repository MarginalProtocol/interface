import { useState } from "react"
import { DropdownArrow } from "./DropdownArrow"
import { Token } from "../types"
import { GAS_TOKEN_MAP, WRAPPED_GAS_TOKEN_MAP } from "../constants/tokens"

export const UseGasTokenDropdown = ({
  useGas,
  setUseGas,
  chainId,
}: {
  useGas: boolean
  setUseGas: React.Dispatch<React.SetStateAction<boolean>>
  chainId: number
}) => {
  const WRAPPED_GAS_TOKEN = WRAPPED_GAS_TOKEN_MAP[chainId]
  const GAS_TOKEN = GAS_TOKEN_MAP[chainId]
  const options: Token[] = [WRAPPED_GAS_TOKEN, GAS_TOKEN]
  const [token, setToken] = useState(GAS_TOKEN)
  const [showOptions, setShowOptions] = useState(false)

  return (
    <div className="relative">
      <div
        id="use-gas-token-dropdown"
        className="flex items-center justify-between space-x-2 cursor-pointer w-fit hover:opacity-60"
        onClick={() => setShowOptions(!showOptions)}
      >
        <DropdownArrow isActive={showOptions} className="mt-0.5" />
      </div>

      {showOptions && (
        <div className="absolute right-0 z-20 flex flex-col px-3 py-3 mt-2 space-y-1 text-white border shadow-xl top-4 rounded-xl w-28 bg-bgGray transform-gpu duration-175 border-borderGray">
          {options.map((option) => (
            <button
              id={`${option.symbol}-tab-button`}
              key={option.symbol}
              onClick={() => {
                setToken(
                  option.symbol === GAS_TOKEN.symbol ? GAS_TOKEN : WRAPPED_GAS_TOKEN,
                )
                setUseGas(option.symbol === GAS_TOKEN.symbol ? true : false)
                setShowOptions(false)
              }}
              className={`${
                token.symbol === option.symbol
                  ? ""
                  : "hover:text-marginalOrange-500 hover:opacity-100 opacity-60"
              } 
              relative uppercase font-bold tracking-wide text-marginalGray-200`}
            >
              {option.symbol}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

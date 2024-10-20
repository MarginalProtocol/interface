import { useRef, useState } from "react"
import { useSettingsActionHandlers, useSettingsState } from "../../state/settings/hooks"
import useCloseOnExternalClick from "../../hooks/useCloseOnExternalClick"
import { SlippageInput } from "./SlippageInput"
import { DropdownArrow } from "../DropdownArrow"
import { SlippageDirectionButtons } from "./SlippageDirectionalButton"
import { TransactionDeadlineInput } from "./TransactionDeadlineInput"
import { InfoTip } from "../ToolTip/ToolTip"
import ToggleButton from "../ToggleButton"

export const SettingsModal = ({
  showSettings,
  onCloseSettings,
}: {
  showSettings: boolean
  onCloseSettings: () => void
}) => {
  const settingsRef = useRef(null)
  const { maxSlippage, transactionDeadline } = useSettingsState()
  const { onSetMaxSlippage, onSetTransactionDeadline } = useSettingsActionHandlers()
  const [showInput, setShowInput] = useState(true)
  const [showTransactionDeadline, setShowTransactionDeadline] = useState(true)
  const [isAutoSlippage, setIsAutoSlippage] = useState(true)
  // const [isDefaultOptions, setIsDefaultOptions] = useState(false)

  const resetDefaults = (): void => {
    if (Number(maxSlippage) === 0 || Number(maxSlippage) > 50) {
      onSetMaxSlippage("0.5")
    }
    if (Number(transactionDeadline) === 0 || Number(transactionDeadline) > 999) {
      onSetTransactionDeadline("10")
    }
    onCloseSettings()
  }

  useCloseOnExternalClick(settingsRef, showSettings ? resetDefaults : () => null)

  if (showSettings) {
    return (
      <div
        ref={settingsRef}
        className="absolute top-0 -right-8 md:right-0 w-[359px] md:w-[366px] p-5 mt-2 text-white border bg-marginalGray-950 border-marginalGray-800 drop-shadow-blur rounded-3xl transform-gpu duration-175 cursor-default"
      >
        <div className="mb-2 py-1 flex items-center justify-between text-sm leading-4 tracking-thin font-bold text-marginalGray-200 uppercase">
          <pre className="flex gap-0.5">
            Max slippage
            <InfoTip width={16} height={16}>
              Your transaction will revert if the price changes unfavorably by more than
              this percentage.
            </InfoTip>
          </pre>
          <div
            className="flex items-center space-x-1 cursor-pointer hover:opacity-60"
            onClick={() => setShowInput(!showInput)}
          >
            <div className="">{maxSlippage}%</div>
            <DropdownArrow isActive={showInput} />
          </div>
        </div>

        <div
          className={`
            flex items-center justify-between overflow-y-hidden 
            transition-max-height ease-in-out transform-gpu duration-300 mb-3
            ${showInput ? "max-h-[32px]" : "max-h-0"}
          `}
        >
          <SlippageDirectionButtons
            isAuto={isAutoSlippage}
            onSelect={setIsAutoSlippage}
          />
          <SlippageInput
            inputValue={maxSlippage}
            onChange={onSetMaxSlippage}
            isAuto={isAutoSlippage}
            onSetAuto={setIsAutoSlippage}
          />
        </div>

        <div className="flex items-center justify-between text-sm leading-4 tracking-thin font-bold text-marginalGray-200 uppercase py-1 mb-2">
          <pre className="flex gap-0.5">
            Transaction deadline
            <InfoTip width={16} height={16}>
              Your transaction will revert if it is pending for more than this period of
              time.
            </InfoTip>
          </pre>
          <div
            className="flex items-center space-x-1 cursor-pointer hover:opacity-60"
            onClick={() => setShowTransactionDeadline(!showTransactionDeadline)}
          >
            <div className="">{transactionDeadline}m</div>
            <DropdownArrow isActive={showTransactionDeadline} />
          </div>
        </div>
        <div
          className={`
            flex items-center justify-between overflow-y-hidden 
            transition-max-height ease-in-out transform-gpu duration-300
            ${showTransactionDeadline ? "max-h-[30px]" : "max-h-0"}
          `}
        >
          <TransactionDeadlineInput
            inputValue={transactionDeadline}
            onChange={onSetTransactionDeadline}
          />
        </div>

        {/* TODO: Add functionality to Default Trade Options */}
        {/* <div className="my-4 h-[1px] bg-marginalGray-800" />

        <div id="default-trade-options" className="flex justify-between">
          <div className="flex flex-col space-y-2">
            <span className="text-sm leading-4 tracking-thin font-bold text-marginalGray-200 uppercase">
              Default Trade Options
            </span>
            <span className="max-w-60 text-sm leading-4 tracking-thin font-bold text-marginalGray-600">
              The Marginal client selects the cheapest trade option factoring price and
              network costs.
            </span>
          </div>

          <ToggleButton
            isToggled={isDefaultOptions}
            handleClick={() => setIsDefaultOptions(!isDefaultOptions)}
          />
        </div> */}
      </div>
    )
  } else {
    return null
  }
}

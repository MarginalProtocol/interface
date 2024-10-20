import { useState } from "react"
import { DropdownArrow } from "../DropdownArrow"

export const useAccordionToggle = () => {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = () => setIsExpanded((prevExpanded) => !prevExpanded)

  return { isExpanded, setIsExpanded, handleToggle }
}

export const PoolAccordion = ({
  title,
  content,
  poolUtilization,
}: {
  title: any
  content: any
  poolUtilization: number | undefined
}) => {
  const { isExpanded, setIsExpanded, handleToggle } = useAccordionToggle()

  return (
    <div className="w-full space-x-4">
      <AccordionTitle
        handleToggle={handleToggle}
        title={title}
        isExpanded={isExpanded}
        poolUtilization={poolUtilization}
      />
      <AccordionContent content={content} isExpanded={isExpanded} />
    </div>
  )
}

const AccordionTitle = ({
  handleToggle,
  title,
  isExpanded,
  poolUtilization,
}: {
  handleToggle: () => void
  title: any
  isExpanded: boolean
  poolUtilization: number | undefined
}) => {
  let poolUnlocked: number | undefined

  if (typeof poolUtilization === "number") {
    const poolUtilizationPercentage = Number(poolUtilization * 100)
    poolUnlocked = parseFloat((100 - poolUtilizationPercentage).toFixed(2))
  } else {
    poolUnlocked = undefined
  }

  return (
    <div
      id="accordion-title"
      className="flex items-center justify-between space-x-48 cursor-pointer hover:opacity-70"
      onClick={handleToggle}
    >
      {title}
      <div className="flex items-center space-x-6">
        <div className="text-xs text-green-500">
          {poolUnlocked ? `${poolUnlocked}% unlocked` : null}
        </div>
        <DropdownArrow isActive={isExpanded} />
      </div>
    </div>
  )
}
const AccordionContent = ({
  content,
  isExpanded,
}: {
  content: any
  isExpanded: boolean
}) => {
  return (
    <>
      <div
        className={`
          px-0.5 text-sm tracking-wide rounded-2xl
          text-marginalGray-200 overflow-y-hidden 
          ${isExpanded ? "max-h-[600px]" : "max-h-0"}
        `}
      >
        {content}
      </div>
    </>
  )
}

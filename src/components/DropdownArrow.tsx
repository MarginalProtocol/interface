import { motion } from "framer-motion"
import { ChevronDownIcon } from "@heroicons/react/24/outline"

export const DropdownArrow = ({
  isActive,
  className,
}: {
  isActive: boolean
  className?: string
}) => {
  return (
    <motion.div
      initial={false}
      animate={isActive ? "enter" : "exit"}
      variants={{
        enter: {
          rotate: "180deg",
          transition: { duration: 0.2, ease: "easeInOut" },
        },
        exit: {
          rotate: "0deg",
          transition: { duration: 0.2, ease: "easeInOut" },
        },
      }}
    >
      <ChevronDownIcon
        className={`w-4 h-4 font-bold text-marginalGray-200 stroke-[3px] ${className}`}
      />
    </motion.div>
  )
}

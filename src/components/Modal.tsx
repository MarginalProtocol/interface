import { useRef, useEffect, ReactNode } from "react"
import { motion } from "framer-motion"
import useCloseOnExternalClick from "../hooks/useCloseOnExternalClick"

const dropInVariants = {
  hidden: {
    y: "100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 30,
      stiffness: 350,
    },
  },
}

const Modal = ({
  open,
  onOpen,
  onClose,
  children,
  disableExternalClickClose,
}: {
  open: boolean
  onOpen: () => void
  onClose: () => void
  children: ReactNode
  disableExternalClickClose?: boolean
}) => {
  const dialogRef = useRef(null)

  useCloseOnExternalClick(
    dialogRef,
    !disableExternalClickClose && open ? onClose : () => null,
  )

  return (
    <DialogWrapper open={open}>
      <motion.dialog
        id="dialog"
        variants={dropInVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        ref={dialogRef}
        open={open}
        className="absolute z-50 m-auto border shadow-md border-opacity-40 rounded-3xl bg-marginalGray-900 border-marginalGray-800 overflow-y-auto max-h-[90vh] md:max-h-none"
      >
        {children}
      </motion.dialog>
    </DialogWrapper>
  )
}

export default Modal

const DialogWrapper = ({ open, children }: { open: boolean; children: ReactNode }) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [open])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={
        open
          ? "fixed inset-0 z-50 flex items-center justify-center bg-marginalBlack backdrop-blur-sm bg-opacity-80"
          : ""
      }
    >
      {children}
    </motion.div>
  )
}

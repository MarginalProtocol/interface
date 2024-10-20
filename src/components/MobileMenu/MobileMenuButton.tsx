import { motion, MotionConfig } from "framer-motion"

interface Props {
  isOpen: boolean
  setOpenMobileMenu: (open: boolean) => void
}

export const MobileMenuButton = ({ isOpen, setOpenMobileMenu }: Props) => {
  return (
    <MotionConfig
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
    >
      <motion.button
        initial={false}
        onClick={() => setOpenMobileMenu(!isOpen)}
        className="relative h-10 w-10 rounded-full bg-white/0 transition-colors hover:bg-white/20 z-40"
        animate={isOpen ? "open" : "closed"}
      >
        <motion.span
          style={{
            left: "50%",
            top: "35%",
            x: "-50%",
            y: "-50%",
          }}
          className="absolute h-0.5 w-5 bg-white rounded"
          variants={{
            open: {
              rotate: ["0deg", "0deg", "45deg"],
              top: ["35%", "50%", "50%"],
            },
            closed: {
              rotate: ["45deg", "0deg", "0deg"],
              top: ["50%", "50%", "35%"],
            },
          }}
        />
        <motion.span
          style={{
            left: "50%",
            top: "50%",
            x: "-50%",
            y: "-50%",
          }}
          className="absolute h-0.5 w-5 bg-white rounded"
          variants={{
            open: {
              rotate: ["0deg", "0deg", "-45deg"],
            },
            closed: {
              rotate: ["-45deg", "0deg", "0deg"],
            },
          }}
        />
        <motion.span
          style={{
            left: "50%",
            bottom: "35%",
            x: "-50%",
            y: "50%",
          }}
          className="absolute h-0.5 w-5 bg-white rounded"
          variants={{
            open: {
              rotate: ["0deg", "0deg", "45deg"],
              bottom: ["35%", "50%", "50%"],
            },
            closed: {
              rotate: ["45deg", "0deg", "0deg"],
              bottom: ["50%", "50%", "35%"],
            },
          }}
        />
      </motion.button>
    </MotionConfig>
  )
}

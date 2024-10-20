import { useState } from "react"

export const useInversePrice = (): [
  boolean,
  () => void,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const [useInverse, setUseInverse] = useState<boolean>(false)

  const onToggleInverse = () => setUseInverse(!useInverse)

  return [useInverse, onToggleInverse, setUseInverse]
}

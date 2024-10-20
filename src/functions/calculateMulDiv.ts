import { isUndefined } from "lodash"
import JSBI from "jsbi"

export const calculateMulDiv = (
  x?: bigint, 
  y?: bigint,
  d?: bigint,
) => {
  if (isUndefined(x) || isUndefined(y) || isUndefined(d)) return undefined

  const x_JSBI = JSBI.BigInt(x.toString())
  const y_JSBI = JSBI.BigInt(y.toString())
  const d_JSBI = JSBI.BigInt(d.toString())
  
  if (d_JSBI == JSBI.BigInt(0)) return undefined

  const result = JSBI.divide(
    JSBI.multiply(x_JSBI, y_JSBI),
    d_JSBI
  )
  return result.toString()
}

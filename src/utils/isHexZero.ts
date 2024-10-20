/**
 * Returns true if the string value is zero in hex
 * @param hexNumberString
 */
export default function isHexZero(hexNumberString: string) {
  return /^0x0*$/.test(hexNumberString)
}

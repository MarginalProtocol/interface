export const isOnlyZeroes = (input: string): boolean => {
  return /^0*(\.0*)?$/.test(input) || input === "."
}

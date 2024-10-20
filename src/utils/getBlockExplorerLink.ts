// TODO: Allow function to be dynamic
// Add chainId prop to determine which block explorer url to use
export const getBlockExplorerLink = (address: string) => {
  return `https://basescan.org/address/${address}`
}

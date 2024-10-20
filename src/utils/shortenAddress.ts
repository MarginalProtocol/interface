export const shortenAddress = (address: string | undefined, chars = 4) => {
  if (address) {
    const start = address.slice(0, chars + 1)
    const end = address.slice(-chars)
    return `${start}...${end}`
  } else {
    return ""
  }
}

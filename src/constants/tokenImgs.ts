// Dynamically import SVG files
const EthLogo = require("../assets/logos/eth.svg").default
const UniLogo = require("../assets/logos/uni.svg").default
const WethLogo = require("../assets/logos/weth.svg").default
const marginalLogo = require("../assets/logos/marginal.svg").default

// Define TokenImageMap with file paths
export const TokenImageMap: { [x: string]: string } = {
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984":
    "https://raw.githubusercontent.com/Uniswap/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
  "0xfff9976782d46cc05630d1f6ebab18b2324d6b14": WethLogo,
  "0x43bdd46b310a78c8f077c162d45dbe7e70f32217": marginalLogo,
  "0x0000000000000000000000000000000000000000": EthLogo,
}

// Function to get local image URL
export const getImageUrlFromAddress = (address: string): string | undefined => {
  const lowercaseAddress = address.toLowerCase()
  return TokenImageMap[lowercaseAddress]
}

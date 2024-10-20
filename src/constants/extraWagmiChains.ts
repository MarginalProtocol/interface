import { Chain } from "wagmi"

//@ts-ignore
export const berachainTestnetbArtio = {
  id: 80084,
  network: "bartio",
  name: "Berachain bArtio",
  iconUrl:
    "https://imgproxy-testnet.avascan.com/C1UMBnSstUKvhQT62pkhbT5d-gMTRwRjnD0CpWMhzAg/pr:thumb_32/aHR0cHM6Ly9jbXMtY2RuLmF2YXNjYW4uY29tL2NtczIvYmVyYXRyYWlsLmUxN2E3OWY3MDE2OC5wbmc",
  iconBackground: "#fff",
  nativeCurrency: {
    decimals: 18,
    name: "BERA Token",
    symbol: "BERA",
  },
  rpcUrls: {
    public: {
      http: ["https://bera-testnet.nodeinfra.com"],
    },
    default: {
      http: ["https://bera-testnet.nodeinfra.com"],
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 109269,
    },
  },
  blockExplorers: {
    default: {
      name: "Berachain bArtio Beratrail",
      url: "https://bartio.beratrail.io",
    },
  },
  testnet: true,
} as const as Chain

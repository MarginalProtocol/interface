import "./index.css"
import "@rainbow-me/rainbowkit/styles.css"
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import store from "./store"

import { Provider } from "react-redux"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { mainnet, sepolia, base } from "viem/chains"
import { berachainTestnetbArtio } from "./constants/extraWagmiChains"
import { publicProvider } from "wagmi/providers/public"
import { alchemyProvider } from "@wagmi/core/providers/alchemy"
import ListsUpdater from "./state/lists/updater"
import ApplicationUpdater from "./state/application/updater"
import {
  getDefaultWallets,
  RainbowKitProvider,
  connectorsForWallets,
  darkTheme,
  Theme,
} from "@rainbow-me/rainbowkit"
import { frameWallet, rabbyWallet } from "@rainbow-me/rainbowkit/wallets"
import { merge } from "lodash"
import PricesUpdater from "src/state/prices/updater"

const appName = "Marginal App"
const projectId = "8086f382c384d69b52b07654ae394a46"
const sepoliaRpc = process.env.REACT_APP_SEPOLIA_ALCHEMY_RPC ?? ""

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, base, berachainTestnetbArtio, sepolia],
  [alchemyProvider({ apiKey: sepoliaRpc }), publicProvider()],
)

export { publicClient }

const { wallets } = getDefaultWallets({
  appName,
  projectId,
  chains,
})

const connectors = connectorsForWallets([
  ...wallets,
  {
    groupName: "Other",
    wallets: [rabbyWallet({ chains }), frameWallet({ chains })],
  },
])

const config = createConfig({
  autoConnect: true,
  publicClient,
  connectors,
  webSocketPublicClient,
})

const theme = merge(darkTheme(), {
  colors: {
    accentColor: "#FF6B26",
    accentColorForeground: "#FFF",
    modalBackground: "#2C2C2C",
    modalBorder: "#3A3A3A",
    modalTextSecondary: "#CACACA",
    modalText: "#BEBEBE",
  },
  fonts: {
    body: "PP Fraktion Mono, monaco, monospace",
  },
  radii: {
    modal: "20px",
    actionButton: "8px",
  },
} as Theme)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

function Updater() {
  return (
    <>
      <ApplicationUpdater />
      <PricesUpdater />
      <ListsUpdater />
    </>
  )
}

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <WagmiConfig config={config}>
        <RainbowKitProvider chains={chains} theme={theme}>
          <Updater />
          <App />
        </RainbowKitProvider>
      </WagmiConfig>
    </Provider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()

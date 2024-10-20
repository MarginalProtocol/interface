import { ConnectButton } from "@rainbow-me/rainbowkit"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"

export const CustomConnectButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== "loading"
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated")

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button
                    onClick={openConnectModal}
                    type="button"
                    className="max-w-40 h-10 py-3 px-4 flex items-center text-sm leading-4 tracking-thin font-bold uppercase text-marginalGray-100  border-2 rounded-lg bg-marginalOrange-500 border-marginalOrange-500"
                  >
                    Connect Wallet
                  </button>
                )
              }

              if (chain.unsupported) {
                return (
                  <button
                    onClick={openChainModal}
                    type="button"
                    className="flex items-center h-8 px-2.5 py-2 rounded-lg bg-marginalGray-800 text-marginalGray-200 text-sm leading-4 tracking-thin font-bold uppercase"
                  >
                    <ExclamationTriangleIcon width={20} height={20} />
                    Wrong network
                  </button>
                )
              }

              return (
                <div className="flex py-1 gap-1">
                  <button
                    onClick={openChainModal}
                    className="h-8 px-2.5 py-2 flex items-center text-marginalGray-200 text-sm leading-4 tracking-thin font-bold uppercase hover:opacity-80"
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 16,
                          height: 16,
                          borderRadius: 999,
                          overflow: "hidden",
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? "Chain icon"}
                            src={chain.iconUrl}
                            style={{ width: 16, height: 16 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name?.slice(0, 3)}
                  </button>
                  <button
                    onClick={openAccountModal}
                    type="button"
                    className="h-8 px-2.5 py-2 rounded-lg bg-marginalGray-800 text-marginalGray-200 text-sm leading-4 tracking-thin font-bold uppercase"
                  >
                    <span className="">{account.displayName}</span>
                    {/* <span className="block lg:hidden">
                      {account.displayName?.slice(0, 5)}
                    </span> */}

                    {account.displayBalance ? ` (${account.displayBalance})` : ""}
                  </button>
                </div>
              )
            })()}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

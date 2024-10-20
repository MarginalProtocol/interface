import { HeaderContainer } from "./HeaderContainer"
import { NavLinks } from "./NavLinks"
import { HeaderLogo } from "./HeaderLogo"
import { useMobileView } from "../../hooks/useMobileView"
import { CustomConnectButton } from "./CustomConnectButton"

export const Header = () => {
  const { isMobileView } = useMobileView()
  return (
    <>
      {isMobileView ? (
        <div className="md:hidden z-[999] w-full h-[72px] bg-marginalGray-950 p-4">
          <div className="flex items-center justify-between">
            <HeaderLogo />
            <CustomConnectButton />
          </div>
        </div>
      ) : (
        <HeaderContainer>
          <div className="w-full h-[72px] max-w-[1440px] mx-auto flex items-center bg-marginalGray-950 border-2 border-marginalGray-800 rounded-2xl p-2">
            <div
              id="menu-container"
              className="w-full rounded-xl bg-marginalBlack flex justify-between items-center px-2.5 py-2 "
            >
              <HeaderLogo />
              <NavLinks />
              <CustomConnectButton />
            </div>
          </div>
        </HeaderContainer>
      )}
    </>
  )
}

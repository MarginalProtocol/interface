import { NavLink } from "react-router-dom"
import { marginalDocsPageUrl } from "../../constants/links"

export const MobileMenuFooter = () => {
  return (
    <div className="z-40 block md:hidden fixed bottom-0 left-0 w-full h-20 bg-marginalBlack p-4 border-t border-marginalGray-800">
      <div className="flex w-full items-center justify-between">
        <StyledMobileNavLink to="/">Trade</StyledMobileNavLink>
        <StyledMobileNavLink to="/swap">Swap</StyledMobileNavLink>
        <StyledMobileNavLink to="/positions">Positions</StyledMobileNavLink>
        <StyledMobileNavLink to="/pools">Pools</StyledMobileNavLink>
        <StyledMobileNavLink to={marginalDocsPageUrl} external={true}>
          Docs
        </StyledMobileNavLink>
      </div>
    </div>
  )
}

const StyledMobileNavLink = ({
  to,
  external,
  children,
}: {
  to: string
  external?: boolean
  children: React.ReactNode
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "text-marginalOrange-500 text-sm leading-4 tracking-thin font-bold uppercase w-fit py-1 px-1.5"
          : "text-marginalGray-100 text-sm leading-4 tracking-thin font-bold uppercase py-1 px-1.5"
      }
      target={external ? "_blank" : undefined}
    >
      {children}
    </NavLink>
  )
}

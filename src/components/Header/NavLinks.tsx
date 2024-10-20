import { StyledNavLink } from "./StyledNavLink"
import { marginalDocsPageUrl } from "../../constants/links"

export const NavLinks = () => {
  return (
    <div
      id="nav-links"
      className="hidden space-x-12 tracking-wide capitalize md:flex md:visible"
    >
      <StyledNavLink to="/">Trade</StyledNavLink>
      <StyledNavLink to="/swap">Swap</StyledNavLink>
      <StyledNavLink to="/positions">Positions</StyledNavLink>
      <StyledNavLink to="/pools">Pools</StyledNavLink>
      <StyledNavLink to={marginalDocsPageUrl} external={true}>
        Docs
      </StyledNavLink>
      {/* <StyledNavLink to="/overview">Overview</StyledNavLink> */}
    </div>
  )
}

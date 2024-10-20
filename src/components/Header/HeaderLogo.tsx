import { NavLink } from "react-router-dom"
import marginalLogo from "../../assets/logos/marginal.svg"
import { marginalLandingPageUrl } from "src/constants/links"

export const HeaderLogo = () => {
  return (
    <NavLink to={marginalLandingPageUrl} target="_blank" className="w-fit">
      <img src={marginalLogo} alt="Marginal Logo" />
    </NavLink>
  )
}

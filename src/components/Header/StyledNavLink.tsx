import { NavLink } from "react-router-dom"

export const StyledNavLink = ({
  to,
  external,
  children,
}: {
  to: string
  external?: boolean
  children: React.ReactNode
}) => {
  const hoverClass =
    "hover:bg-marginalGray-900 rounded-lg px-1.5 py-1 transition duration-300 ease-out "
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `text-marginalOrange-500 text-sm leading-4 tracking-thin font-bold uppercase ${hoverClass}`
          : `text-marginalGray-100 text-sm leading-4 tracking-thin font-bold uppercase hover:text-marginalGray-200 aria-selected:text-marginalGray-200 active:text-marginalGray-200 ${hoverClass} focus:outline-none focus:ring-2 focus:ring-marginalOrange-300`
      }
      target={external ? "_blank" : undefined}
    >
      {children}
    </NavLink>
  )
}

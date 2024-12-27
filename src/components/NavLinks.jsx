import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import links from '../utils/links.jsx'

const NavLinks = () => {
  const user = useSelector((state) => state.userState.user)

  return (
    <>
      {links.map((link) => {
        // conditions to display routes links
        const isAdmin = !user.roles.includes('ROLE_ADMIN')

        if (isAdmin && link.url === 'admin') return null

        //
        return (
          <li key={link.id}>
            <NavLink
              className='capitalize text-base'
              to={link.url}
              target={link.target}
            >
              {link.icon}
              {link.text}
            </NavLink>
          </li>
        )
      })}
    </>
  )
}
export default NavLinks

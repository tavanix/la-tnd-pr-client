import { Link, useNavigate } from 'react-router-dom'
import NavLinks from './NavLinks'

import { useDispatch } from 'react-redux'
import { toggleTheme, logoutUser } from '../features/user/userSlice'

import { useQueryClient } from '@tanstack/react-query'

import { CiLight, CiDark, CiUser, CiMenuBurger } from 'react-icons/ci'
import { RxExit } from 'react-icons/rx'
import { RiUserSmileLine } from 'react-icons/ri'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const handleTheme = () => {
    dispatch(toggleTheme())
  }

  const handleLogout = () => {
    navigate('/login')
    dispatch(logoutUser())
    queryClient.removeQueries()
  }

  return (
    <div className='navbar bg-neutral'>
      <div className='navbar-start z-0'>
        <div className='dropdown'>
          <div tabIndex={0} role='button' className='btn btn-ghost btn-rounded'>
            <CiMenuBurger className='w-6 h-6 text-5xl' />
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[50] p-2 shadow bg-base-100 rounded-box w-32'
          >
            <NavLinks />
          </ul>
        </div>
      </div>

      <div className='navbar-center'>
        <h1 className='font-bold text-[1.3rem]'>H2 2024: Performance Review</h1>
      </div>
      <div className='navbar-end'>
        <label className='swap swap-rotate text-4xl btn btn-ghost btn-rounded'>
          <input type='checkbox' onChange={handleTheme} />
          <CiLight className='text-xl swap-on h-6 w-6 rounded-full' />
          <CiDark className='text-xl swap-off h-6 w-6 rounded-full' />
        </label>
        <div className='dropdown dropdown-end'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost btn-rounded avatar'
          >
            <CiUser className='w-6 h-6 rounded-full text-2xl flex items-center justify-center' />
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-36'
          >
            <li>
              <Link to='/profile' className='text-base'>
                <RiUserSmileLine />
                Профиль
              </Link>
            </li>
            <li>
              <Link to='/login' onClick={handleLogout} className='text-base'>
                <RxExit />
                Выход
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
export default Navbar

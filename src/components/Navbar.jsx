import { Link, useNavigate } from 'react-router-dom'
import NavLinks from './NavLinks'

import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/user/userSlice'

import { useQueryClient } from '@tanstack/react-query'

import logo from '../assets/logoWhite.png'
import arrowRight from '../assets/arrowRight.png'
import editPen from '../assets/editPen.png'
import faqLogo from '../assets/faqLogo.png'
import exit from '../assets/exit.png'
import target from '../assets/target.png'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const user = useSelector((state) => state.userState.user)
  const isAdmin = user.roles.includes('ROLE_ADMIN')

  const handleLogout = () => {
    navigate('/login')
    dispatch(logoutUser())
    queryClient.removeQueries()
  }

  return (
    <div className='group z-50 flex flex-col pl-2 pr-2 pt-4 w-24 bg-black transition-all duration-800 ease-in-out hover:w-64 hover:transition-all'>
      {/* logo */}
      <div className='group w-18 h-12 flex items-center justify-center mb-12'>
        <img src={arrowRight} alt='logo' className='group-hover:hidden' />
        <img src={logo} alt='logo' className='h-8 hidden group-hover:flex' />
      </div>

      {isAdmin && (
        <Link
          to='/admin'
          className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
        >
          <div className='rounded bg-[#ededed] h-6 w-6 ml-7'></div>
          <span className='text-[#ededed] ml-4 hidden group-hover:flex'>
            Админка
          </span>
        </Link>
      )}

      {/* calibration */}
      <div className=''>
        <Link
          to='/employees'
          className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
        >
          <img src={editPen} alt='exit' className='h-6 ml-7' />
          <span className='text-[#ededed] ml-4 hidden group-hover:flex'>
            Калибровка
          </span>
        </Link>

        {/* dasboard */}
        <Link
          to='/dashboard'
          className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
        >
          <img src={target} alt='exit' className='h-6 ml-7' />
          <span className='text-[#ededed] ml-4 hidden group-hover:flex'>
            Дешборд
          </span>
        </Link>

        {/* faq */}
        <Link
          to='/faq'
          className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
        >
          <img src={faqLogo} alt='exit' className='h-6 ml-7' />
          <span className='text-[#ededed] ml-4 hidden group-hover:flex'>
            F.A.Q.
          </span>
        </Link>
      </div>

      {/* logout */}
      <Link
        to='/login'
        onClick={handleLogout}
        className='group h-12 flex justify-start items-center cursor-pointer absolute bottom-0 mb-8 rounded-[16px]  hover:bg-[#484848] hover:w-60'
      >
        <img src={exit} alt='exit' className='h-6 ml-6' />
        <span className='text-[#ededed] ml-4 hidden group-hover:flex'>
          Выйти
        </span>
      </Link>
    </div>
  )
}
export default Navbar

import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../features/user/userSlice'
import { useQueryClient } from '@tanstack/react-query'

import logo from '../assets/logoWhite.png'
import { FaUserEdit } from 'react-icons/fa'
import { FaChartSimple } from 'react-icons/fa6'
import { FaQuestion } from 'react-icons/fa'
import { MdVerifiedUser } from 'react-icons/md'
import { RiArrowRightSLine } from 'react-icons/ri'
import { FaWalking } from 'react-icons/fa'
import { FaPersonWalking } from 'react-icons/fa6'
import { FaUserCircle } from 'react-icons/fa'
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
    <div className='group z-50 flex flex-col p-2 pt-5 w-24 bg-black transition-all duration-500 ease-in-out hover:w-56 hover:transition-all'>
      {/* logo */}
      <div className='group w-18 h-12 flex items-center justify-center mb-12'>
        <RiArrowRightSLine className='w-10 h-10 text-white group-hover:hidden' />
        <img src={logo} alt='logo' className='h-8 hidden group-hover:flex' />
      </div>

      <div className='flex flex-col content-between h-full justify-between'>
        <div>
          {/* admin */}
          {isAdmin && (
            <Link
              to='/admin'
              className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
            >
              <div className='ml-7 flex gap-4'>
                <MdVerifiedUser className='w-6 h-6 text-white' />
                <span className='text-[#ededed] hidden group-hover:flex'>
                  Админ
                </span>
              </div>
            </Link>
          )}

          {/* calibration */}
          <Link
            to='/employees'
            className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
          >
            <div className='ml-7 flex gap-4'>
              <FaUserEdit className='w-6 h-6 text-white' />
              <span className='text-[#ededed] hidden group-hover:flex'>
                Калибровка
              </span>
            </div>
          </Link>

          {/* dashboard */}
          <Link
            to='/dashboard'
            className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
          >
            <div className='ml-7 flex gap-4'>
              <FaChartSimple className='w-6 h-6 text-white' />
              <span className='text-[#ededed] hidden group-hover:flex'>
                Дешборд
              </span>
            </div>
          </Link>

          {/* faq */}
          <Link
            to='/faq'
            className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
          >
            <div className='ml-7 flex gap-4'>
              <FaQuestion className='w-6 h-6 text-white' />
              <span className='text-[#ededed] hidden group-hover:flex'>
                F.A.Q.
              </span>
            </div>
          </Link>
        </div>

        <div className=''>
          {/* logout */}
          <Link
            to='/profile'
            className='group h-12 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
          >
            <div className='ml-7 flex gap-4'>
              <FaUserCircle className='transform -scale-x-100 w-6 h-6 text-white' />
              <span className='text-[#ededed] hidden group-hover:flex'>
                Профиль
              </span>
            </div>
          </Link>
          {/* logout */}
          <Link
            to='/login'
            onClick={handleLogout}
            className='group bg-[#1a1a1a] h-12 mb-4 flex justify-start items-center cursor-pointer rounded-[16px] transition-all duration-500 ease-in-out hover:transition-all hover:bg-[#484848]'
          >
            <div className='ml-7 flex gap-4'>
              <FaPersonWalking className='transform -scale-x-100 w-6 h-6 text-white' />
              <span className='text-[#ededed] hidden group-hover:flex'>
                Выйти
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Navbar

import { SubmitBtn } from '../components'
import { Form, redirect } from 'react-router-dom'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'
import { loginUser } from '../features/user/userSlice'

import logoBlack from '../assets/logoBlack.png'
import logoWhite from '../assets/logoWhite.png'

export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    try {
      const response = await customFetch.post('/auth/login', data)

      store.dispatch(loginUser(response.data))

      toast.success('Успешный вход в систему!')
      return redirect('/')
    } catch (error) {
      const errorMesssage =
        error?.response?.data?.error?.message ||
        'Ошибка! Пожалуйста, проверьте корректность предоставленных данных...'
      toast.error(errorMesssage)
      return null
    }
  }

const Login = () => {
  const theme = localStorage.getItem('theme')

  const logo = theme === 'lamodaBlack' ? logoWhite : logoBlack

  return (
    <section className='h-screen flex flex-col items-center justify-center m-auto gap-20'>
      <div className='flex flex-col justify-between items-center gap-8 mt-64'>
        <div className='flex flex-col items-center'>
          <h2 className='text-4xl font-bold'>H2 2024 Performance review</h2>
          <h1 className='text-7xl font-bold'>Calibration Tool</h1>
        </div>
        <Form method='POST' className='p-4 flex gap-x-1'>
          <h4 className='text-xl font-bold'></h4>
          <label className='input input-bordered flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='w-4 h-4 opacity-70'
            >
              <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z' />
            </svg>
            <input
              autoFocus
              required
              type='text'
              label='username'
              name='username'
              placeholder='username'
              className='grow bg-base-100'
            />
          </label>
          <label className='input input-bordered flex items-center gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 16 16'
              fill='currentColor'
              className='w-4 h-4 opacity-70'
            >
              <path
                fillRule='evenodd'
                d='M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z'
                clipRule='evenodd'
              />
            </svg>

            <input
              required
              type='password'
              label='password'
              name='password'
              placeholder='password'
              className='grow bg-base-100'
            />
          </label>
          <div className='w-48'>
            <SubmitBtn text='Login' block='true' btnType='secondary' />
          </div>
        </Form>
        <div className='h-64 flex justify-center items-center'>
          <img src={logo} alt='logo' className='h-24 w-124 cover' />
        </div>
      </div>

      <div className='w-full flex flex-col items-center justify-center'>
        <p className='pb-2'>HR PMO & Analytics Team</p>
        <span className='text-xs text-gray-500'>App v.1.0.0</span>
      </div>
    </section>
  )
}
export default Login

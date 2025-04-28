import { SubmitBtn } from '../components'
import { Form, redirect } from 'react-router-dom'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'
import { loginUser } from '../features/user/userSlice'

import logo from '../assets/logo.png'
import elem1 from '../assets/LAMODA_STRIPES_1.png'
import elem2 from '../assets/LAMODA_STRIPES_2.png'
import elem3 from '../assets/Rectangle.png'

export const action =
  (store) =>
  async ({ request }) => {
    // const formData = await request.formData()
    // const data = Object.fromEntries(formData)

    try {
      // TODO: add SSO
      const response = await customFetch.post('/auth/login')

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
  return (
    <section className='h-screen flex justify-center items-center m-auto'>
      <img
        src={elem2}
        alt='elem2'
        className='absolute -left-36 -top-36 z-47 h-124 /w-124'
      />
      <img
        src={elem1}
        alt='elem1'
        className='absolute bottom-0 right-0 z-49 h-2/4'
      />
      <img
        src={elem3}
        alt='elem3'
        className='absolute bottom-0 left-0 z-49 h-1/3'
      />

      <Form
        method='GET'
        className='w-[550px] h-[270px] rounded-[16px] bg-white p-[64px] flex justify-center items-center absolute z-50 shadow-2xl'
      >
        <div className='flex flex-col justify-between w-full h-full'>
          <div className='h-64 flex justify-center items-center'>
            <img src={logo} alt='logo' className='h-39 w-189 cover' />
          </div>
          <div className='text-xl font-bold m-4 flex justify-center items-center text-neutral'>
            Калибровка Н1 2025
          </div>
          <SubmitBtn
            text='Войти на портал'
            block='false'
            btnType='secondary'
            otherParams='w-[422px] h-[48px] size-xl'
            onClick={() => console.log('click')}
          />
        </div>
      </Form>
      {/* <Form method='POST' className='p-4 flex gap-x-1'>
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
        </Form> */}
    </section>
  )
}
export default Login

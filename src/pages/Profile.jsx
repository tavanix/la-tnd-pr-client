import { toast } from 'react-toastify'
import { redirect, Form } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { SectionTitle, SubmitBtn } from '../components'
import { customFetch } from '../utils'
import { updatePassword } from '../features/user/userSlice'

export const loader = (store) => () => {
  const user = store.getState().userState.user

  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  return null
}

export const action =
  (store) =>
  async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    try {
      const response = await customFetch.post('/auth/updatePassword', data)
      store.dispatch(updatePassword(response.data))
      return null
    } catch (error) {
      const errorMesssage =
        error?.response?.data?.error?.message ||
        'Ошибка! Пожалуйста, проверьте корректность предоставленных данных...'
      toast.error(errorMesssage)
      return null
    }
  }

const Profile = () => {
  const user = useSelector((state) => state.userState.user)

  return (
    <div className='w-[1280px]'>
      <SectionTitle text='Профиль пользователя' />

      <div className='flex flex-col gap-2 mb-4 p-4 w-full border rounded-[16px] shadow-lg'>
        <h2 className='font-bold text-xl'>Данные пользователя</h2>
        <section className='flex flex-col gap-2'>
          <div className='grid grid-cols-2 w-32'>
            <span className=''>Логин:</span>
            <span className='text-secondary font-light'>{user.username}</span>
          </div>
          <div className='grid grid-cols-2 w-32'>
            <span className='text-md'>Роль:</span>
            <ul className='container'>
              {user.roles.map((role) => (
                <li key={role} className='text-secondary text-md font-light'>
                  {role}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <div className='flex flex-col gap-2 p-4 w-full border rounded-[16px] shadow-lg'>
        <h2 className='font-bold text-xl'>Сменить пароль</h2>
        <p className='text-primary'>
          (!) запомните новый пароль, после смены пароля его сбросить сможет
          только администратор
        </p>

        <Form
          method='POST'
          className='card w-full bg-base-100 rounded-md flex flex-row gap-y-4'
        >
          <input
            type='text'
            hidden
            label='username'
            name='username'
            defaultValue={user.username}
          />
          <label className='input input-bordered w-64 flex items-center gap-8 mr-2'>
            <input
              required
              type='password'
              label='password'
              name='password'
              placeholder='новый пароль'
              className='bg-base-100 input-primary font-thin'
            />
          </label>
          <SubmitBtn
            text='Обновить'
            block='false'
            btnType='neutral'
            btnOutline='true'
          />
        </Form>
      </div>
    </div>
  )
}

export default Profile

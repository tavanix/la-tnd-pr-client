import { toast } from 'react-toastify'
import { redirect, Form } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { SectionTitle, SubmitBtn } from '../components'
import { customFetch } from '../utils'
import { updatePassword } from '../features/user/userSlice'

export const loader = (store) => () => {
  const user = store.getState().userState.user

  if (!user) {
    toast.warn('You must be logged in!')
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
        'Please double check your credentials'
      toast.error(errorMesssage)
      return null
    }
  }

const Profile = () => {
  const user = useSelector((state) => state.userState.user)

  return (
    <>
      <SectionTitle text='Информация о пользователе:' />
      <section className='flex flex-col mt-4 mb-8'>
        <div className='grid grid-cols-2 w-96 mb-2'>
          <span className=''>User ID:</span>
          <span className='text-primary font-light'>{user.employeeId}</span>
        </div>
        <div className='grid grid-cols-2 w-96 mb-2'>
          <span className=''>Username:</span>
          <span className='text-primary font-light'>{user.username}</span>
        </div>
        <div className='grid grid-cols-2 w-96 mb-2'>
          <span className=''>E-mail:</span>
          <span className='text-primary font-light'>{user.email}</span>
        </div>
        <div className='grid grid-cols-2 w-96'>
          <span className='text-md'>Assigned roles:</span>
          <ul className='container'>
            {user.roles.map((role) => (
              <li key={role} className='text-primary text-md font-light'>
                {role}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <SectionTitle text='Вы можете изменить свой текущий пароль в форме ниже:' />
      <Form
        method='POST'
        className='card mt-4 w-full bg-base-100 rounded-md flex flex-row gap-y-4 border-b border-base-300 pb-4'
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
          btnType='primary'
          btnOutline='true'
        />
      </Form>
    </>
  )
}

export default Profile

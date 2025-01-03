import { useEffect, useState } from 'react'
import {
  SectionTitle,
  FormInput,
  ExportToExcel,
  ExportToCsv,
} from '../components'
import { toast } from 'react-toastify'
import { customFetch } from '../utils'
import { redirect } from 'react-router-dom'

import authHeader from '../utils/authHeader'

export const loader = (store, queryClient) => async () => {
  // ROLES CHECK
  const user = store.getState().userState.user

  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  if (!user.roles.includes('ROLE_ADMIN')) {
    toast.error(
      'У вас должны быть права администратора, чтобы видеть эту страницу... Пожалуйста обратитесь к администратору...'
    )
    return redirect('/')
  }

  return null
}

const initUserPassword = {
  username: '',
  password: '',
}

const AdminPanel = () => {
  const [userPassword, setUserPassword] = useState(initUserPassword)
  const [employees, setEmployees] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseEmployees = await customFetch.get('/admin', {
          headers: authHeader(),
        })
        setEmployees(responseEmployees.data)
      } catch (error) {
        console.log(error.message)
      }
    }
    fetchData()
  }, [])

  const handleChangeUserPassword = (e) => {
    const name = e.target.name
    const value = e.target.value
    setUserPassword({ ...userPassword, [name]: value })
  }

  const onSubmitUserPassword = (e) => {
    e.preventDefault()

    try {
      customFetch.post('/auth/updatePassword', userPassword)
      setUserPassword(initUserPassword)
      toast.success('Изменения успешно сохранены!')
    } catch (error) {
      // error handler via slicer with thunkAPI
      toast.error('Возникла непредвиденная ошибка...')
    }
  }

  return (
    <>
      <SectionTitle text='Панель администратора' />

      {/* change password */}
      <div className='flex flex-col mb-4 p-6 w-full border rounded shadow-lg'>
        <h3 className='font-bold'>Скинуть пароль</h3>
        <p className='text-primary'>
          Введите username пользователя, которому нужно изменить пароль (который
          придумаете сами)
        </p>

        <form className='form mt-4' onSubmit={onSubmitUserPassword}>
          <div className='grid grid-cols-4 gap-2 mb-4'>
            <FormInput
              label='Username'
              type='text'
              maxLength='8'
              name='username'
              value={userPassword.username}
              handleChange={handleChangeUserPassword}
              required='required'
            />
            <FormInput
              label='NEW Password'
              type='text'
              name='password'
              placeholder='новый пароль'
              value={userPassword.password}
              handleChange={handleChangeUserPassword}
            />
          </div>
          <button type='submit' className='btn btn-success btn-outline'>
            Обновить
          </button>
        </form>
      </div>

      {/* export data */}
      <div className='flex gap-8 mb-4 p-6 w-full border rounded shadow-lg'>
        <div className=''>
          <h3 className='mb-4 font-bold'>Выгрузить список позиций:</h3>
          <div className='flex gap-4 justify-center'>
            <ExportToExcel
              data={employees}
              bookTitle={`List of employees_${Date.now()}`}
            />
            <ExportToCsv
              data={employees}
              bookTitle={`List of employees_${Date.now()}`}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default AdminPanel

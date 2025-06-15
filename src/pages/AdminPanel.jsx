import { useEffect, useState } from 'react'
import {
  SectionTitle,
  FormInput,
  ExportToExcel,
  UploadData,
  MultiSelect,
  FormSelect,
} from '../components'
import { toast } from 'react-toastify'
import { customFetch } from '../utils'
import { redirect } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import { setFilter } from '../features/employees/employeesSlice'

import authHeader from '../utils/authHeader'
import { AdminApprovalTable } from '../components/AdminApprovalTable'

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

const initUpdateEmployeeData = {
  email: '',
  calibration: '',
  calibrationComment: '',
}

const AdminPanel = () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.userState.user)

  const employeesAll = useSelector((state) => state.employeesState.employees)
  const filters = useSelector((state) => state.employeesState.filters.filters1)

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const getFilteredEmployeesExcluding = (excludeKey) => {
    return employeesAll.filter((employee) =>
      Object.entries(filters).every(([key, selected]) => {
        if (key === excludeKey || !selected?.length) return true
        const field =
          key
            .replace(/^selected/, '')
            .charAt(0)
            .toLowerCase() + key.replace(/^selected/, '').slice(1)
        return selected.includes(employee[field])
      })
    )
  }

  const getOptions = (fieldKey) => {
    const filtered = getFilteredEmployeesExcluding(
      `selected${capitalize(fieldKey)}`
    )
    return [...new Set(filtered.map((e) => e[fieldKey]))].map((value) => ({
      label: value,
      value,
    }))
  }

  let selectedLevel1FromStore = useSelector(
    (state) => state.employeesState.filters.filters1.selectedLevel1
  )

  const [userPassword, setUserPassword] = useState(initUserPassword)
  const [employees, setEmployees] = useState([])
  const [updateEmployeeData, setUpdateEmployeeData] = useState(
    initUpdateEmployeeData
  )

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employees = await customFetch.get('/employees', {
          headers: authHeader(),
        })
        setEmployees(employees.data)
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

  const handleUpdateEmployee = (e) => {
    const { name, value } = e.target
    setUpdateEmployeeData({ ...updateEmployeeData, [name]: value })
  }

  const onSubmitUserPassword = (e) => {
    e.preventDefault()
    try {
      customFetch.post('/auth/updatePassword', userPassword)
      setUserPassword(initUserPassword)
      toast.success('Изменения успешно сохранены!')
    } catch (error) {
      toast.error('Возникла непредвиденная ошибка при обновлении пароля...')
    }
  }

  const onSubmitUpdateEmployee = (e) => {
    console.log(updateEmployeeData)

    e.preventDefault()
    try {
      customFetch.put('/updateEmployee', updateEmployeeData)
      setUpdateEmployeeData(initUpdateEmployeeData)
      toast.success('Изменения успешно сохранены!')
    } catch (error) {
      toast.error('Возникла непредвиденная ошибка при обновлении сотрудника...')
    }
  }

  return (
    <div className='w-[1280px]'>
      <SectionTitle text='Панель администратора' />
      <div className=' flex flex-col flex-start gap-4'>
        {/* import and export data */}
        <div className='flex justify-between p-4 w-full border rounded-[16px] shadow-lg'>
          {/* import data */}
          <div className=''>
            <h3 className='mb-2 font-bold'>Загрузить:</h3>
            <UploadData />
          </div>
          {/* export data */}
          <div className=''>
            <h3 className='mb-2 font-bold'>Выгрузить:</h3>
            <div className='flex gap-4 justify-start'>
              <ExportToExcel data={employees} bookTitle={`PR_${Date.now()}`} />
            </div>
          </div>
        </div>

        {/* level 1 filter */}
        <div className='flex flex-col gap-2 p-4 w-full border rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Выбор популяции для калибровки</h2>
          <MultiSelect
            options={getOptions('level1')}
            selected={selectedLevel1FromStore}
            setSelected={(optionsLevel1) => {
              dispatch(
                setFilter({
                  filterId: 'filters1',
                  field: 'selectedLevel1',
                  values: [...optionsLevel1],
                })
              )
              dispatch(
                setFilter({
                  filterId: 'filters2',
                  field: 'selectedLevel1',
                  values: [...optionsLevel1],
                })
              )
            }}
            label='Для начала выберите Level 1, которое будем калибровать'
          />
        </div>

        {/* change single employee */}
        <div className='flex flex-col gap-2 p-4 w-full border rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Перекалибровать сотрудника</h2>
          <form className='form' onSubmit={onSubmitUpdateEmployee}>
            <div className='grid grid-cols-4 gap-2 mb-4'>
              <FormInput
                label='Email'
                type='email'
                name='email'
                value={updateEmployeeData.email || ''}
                handleChange={handleUpdateEmployee}
                required='required'
              />
              <FormSelect
                label='Калибровка'
                name='calibration'
                list={['', 'Топ', 'Отлично', 'Хорошо', 'Можешь лучше', 'Плохо']}
                value={updateEmployeeData.calibration || ''}
                handleChange={handleUpdateEmployee}
                required='required'
              />
              <FormInput
                label='Комментарий'
                type='text'
                name='calibrationComment'
                value={updateEmployeeData.calibrationComment || ''}
                handleChange={handleUpdateEmployee}
              />
              <button
                type='submit'
                className='mt-9 btn btn-success btn-outline'
              >
                Обновить
              </button>
            </div>
          </form>
        </div>

        {/* approve or decline level1 */}
        <div className='flex flex-col gap-2 p-4 w-full border rounded-[16px] shadow-lg'>
          <AdminApprovalTable />
        </div>

        {/* change password */}
        <div className='flex flex-col gap-2 p-4 w-full border rounded-[16px] shadow-lg mb-8'>
          <h3 className='font-bold'>Скинуть пароль активного пользователя</h3>
          <p className='text-neutral'>
            Обязательно введите имя пользователя, которому нужно изменить пароль
          </p>

          <form className='form' onSubmit={onSubmitUserPassword}>
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
              <button
                type='submit'
                className='mt-9 btn btn-success btn-outline'
              >
                Обновить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel

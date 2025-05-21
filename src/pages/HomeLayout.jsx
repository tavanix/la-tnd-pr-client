import { Outlet, useNavigation } from 'react-router-dom'
import { Navbar, Loading } from '../components'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'

import { setEmployees } from '../features/employees/employeesSlice'
import { customFetch } from '../utils'
import authHeader from '../utils/authHeader'

export const loader = (store, queryClient) => async () => {
  const user = store.getState().userState.user

  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  // FETCH DATA AND STORE
  try {
    const employees = await customFetch.get(`/employees`, {
      headers: authHeader(),
    })

    // user roles and access management
    let result = []
    if (
      user.roles.includes('ROLE_ADMIN') ||
      user.roles.includes('ROLE_CNB') ||
      user.roles.includes('ROLE_TND')
    )
      result = employees.data

    if (user.roles.includes('ROLE_HRBP_IT'))
      result = employees.data.filter(
        (item) =>
          item.level1 === 'Дирекция информационных технологий' ||
          item.level1 === 'Дирекция развития продукта'
      )

    if (user.roles.includes('ROLE_HRBP_HR'))
      result = employees.data.filter(
        (item) =>
          item.level1 ===
          'Дирекция по управлению персоналом и административной деятельности'
      )

    store.dispatch(setEmployees(result))
  } catch (error) {
    const errorMesssage =
      error?.response?.data?.error?.message || 'Что-то пошло не так...'
    toast.error(errorMesssage)
    return null
  }

  return null
}

const HomeLayout = () => {
  const navigation = useNavigation()
  const isPageLoding = navigation.state === 'loading'

  return (
    <div className='h-screen grid grid-cols-[64px_1fr] bg-[#fff]'>
      <Navbar />
      {isPageLoding ? (
        <Loading />
      ) : (
        <section className='align-element mt-7'>
          <Outlet />
        </section>
      )}
    </div>
  )
}
export default HomeLayout

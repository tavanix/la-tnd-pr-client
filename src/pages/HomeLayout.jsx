import { Outlet, useNavigation } from 'react-router-dom'
import { Navbar, Loading } from '../components'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'

import { customFetch } from '../utils'
import { setEmployees } from '../features/employees/employeesSlice'
import authHeader from '../utils/authHeader'

export const loader = (store, queryClient) => async () => {
  const user = store.getState().userState.user

  if (!user) {
    toast.warn('You must be logged in!')
    return redirect('/login')
  }

  // FETCH DATA AND STORE
  try {
    const employees = await customFetch.get(`/employees`, {
      headers: authHeader(),
    })

    store.dispatch(setEmployees(employees.data))
  } catch (error) {
    const errorMesssage =
      error?.response?.data?.error?.message || 'Something went wrong...'
    toast.error(errorMesssage)
    return null
  }

  return null
}

const HomeLayout = () => {
  const navigation = useNavigation()
  const isPageLoding = navigation.state === 'loading'

  return (
    <>
      <Navbar />
      {isPageLoding ? (
        <Loading />
      ) : (
        <section className='align-element py-24'>
          <Outlet />
        </section>
      )}
    </>
  )
}
export default HomeLayout

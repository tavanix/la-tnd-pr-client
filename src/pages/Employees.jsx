import { toast } from 'react-toastify'
import { ExportToExcel, SectionTitle } from '../components'
import { useSelector } from 'react-redux'

import { customFetch } from '../utils'
import authHeader from '../utils/authHeader'

export const loader = (store, queryClient) => async () => {
  // ROLES CHECK
  const user = store.getState().userState.user

  if (!user) {
    toast.warn('You must be logged in!')
    return redirect('/login')
  }
  return null
}

const Employees = () => {
  const user = useSelector((state) => state.userState.user)
  const employees = useSelector((state) => state.employeesState.employees)

  console.log(employees)

  return (
    <>
      <SectionTitle text='Калибровка оценок сотрудников' />
      <div className='mt-4'>
        <ExportToExcel data={employees} bookTitle={`PR_${Date.now()}`} />
      </div>
    </>
  )
}

export default Employees

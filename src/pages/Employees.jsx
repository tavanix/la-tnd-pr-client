import { toast } from 'react-toastify'
import { ExportToExcel, SectionTitle, Table } from '../components'
import { useSelector } from 'react-redux'

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

  return (
    <>
      <SectionTitle text='Калибровка оценок сотрудников' />
      <Table />
      <div className='mt-4'>
        <ExportToExcel data={employees} bookTitle={`PR_${Date.now()}`} />
      </div>
    </>
  )
}

export default Employees

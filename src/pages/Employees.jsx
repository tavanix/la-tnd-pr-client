import { toast } from 'react-toastify'
import { SectionTitle, Table, ExportToExcel } from '../components'
import { useSelector } from 'react-redux'

export const loader = (store, queryClient) => async () => {
  // ROLES CHECK
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  return null
}

const Employees = () => {
  const employees = useSelector((state) => state.employeesState.employees)

  return (
    <>
      <SectionTitle text='Калибровка' />
      <Table />
      <div className='mt-4'>
        <ExportToExcel data={employees} bookTitle={`PR_${Date.now()}`} />
      </div>
    </>
  )
}

export default Employees

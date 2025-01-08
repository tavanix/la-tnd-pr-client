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
  const user = useSelector((state) => state.userState.user)
  const employees = useSelector((state) => state.employeesState.employees)

  return (
    <>
      <SectionTitle text='Калибровка' />
      <Table />
      <div className='mt-4'>
        <ExportToExcel
          data={employees}
          bookTitle={`Калибровка_${user.roles[0].slice(5)}_${Date.now()}`}
        />
      </div>
    </>
  )
}

export default Employees

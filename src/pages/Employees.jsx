import { useState } from 'react'
import { useSelector } from 'react-redux'
import { SectionTitle, Table, ExportToExcel } from '../components'
import { toast } from 'react-toastify'

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

  const [employees, setEmployees] = useState(
    useSelector((state) => state.employeesState.employees)
  )

  return (
    <>
      <SectionTitle text='Калибровка' />
      <Table employeesFromStore={employees} />
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

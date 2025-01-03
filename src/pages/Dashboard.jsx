import { ExportToExcel, SectionTitle } from '../components'
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

const Dashboard = () => {
  const employees = useSelector((state) => state.employeesState.employees)

  return (
    <>
      <SectionTitle text='Дешборд' />
      <div className=''></div>
      <div className='mt-4'>
        <ExportToExcel data={employees} bookTitle={`PR_${Date.now()}`} />
      </div>
    </>
  )
}

export default Dashboard

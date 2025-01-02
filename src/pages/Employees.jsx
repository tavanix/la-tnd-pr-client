import { toast } from 'react-toastify'
import { SectionTitle, Table } from '../components'

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
  return (
    <>
      <SectionTitle text='Калибровка оценок сотрудников' />
      <Table />
    </>
  )
}

export default Employees

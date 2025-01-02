import { ExportToExcel, SectionTitle } from '../components'
import { useSelector } from 'react-redux'

const Dashboard = () => {
  const employees = useSelector((state) => state.employeesState.employees)

  console.log(employees)

  return (
    <>
      <SectionTitle text='Дешборд' />
      <div className='mt-4'>
        <ExportToExcel data={employees} bookTitle={`PR_${Date.now()}`} />
      </div>
    </>
  )
}

export default Dashboard

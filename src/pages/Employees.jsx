import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { customFetch } from '../utils'

import {
  SectionTitle,
  Table,
  ExportToExcel,
  FilteringOptions,
} from '../components'

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

  const employees = useSelector((state) => state.employeesState.employees)
  const filteredEmployees = useSelector(
    (state) => state.employeesState.filteredEmployees
  )
  const data = filteredEmployees.length ? filteredEmployees : employees

  //

  const { data: approvedLevels = [] } = useQuery({
    queryKey: ['approvedLevels'],
    queryFn: async () => {
      const token = localStorage.getItem('token')
      const res = await customFetch.get('/approved-levels')
      return res.data
    },
    refetchOnWindowFocus: false,
  })

  //

  return (
    <div className='flex flex-col w-[1280px]'>
      <SectionTitle text='Калибровка' />
      <FilteringOptions />
      <Table employeesFromStore={data} approvedLevels={approvedLevels} />
      <div className='mt-4 mb-4'>
        <ExportToExcel
          data={data}
          bookTitle={`Калибровка_${user.roles[0].slice(5)}_${Date.now()}`}
        />
      </div>
    </div>
  )
}

export default Employees

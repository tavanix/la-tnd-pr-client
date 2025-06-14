import { useSelector } from 'react-redux'
import { redirect } from 'react-router-dom'

import { FilteringOptions, SectionTitle } from '../components'

export const loader = (store, queryClient) => async (request) => {
  // ROLES CHECK
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  return { user }
}

const Dashboard = () => {
  const data1 = useSelector((state) => state.employeesState.filteredEmployees1)
  const data2 = useSelector((state) => state.employeesState.filteredEmployees2)

  return (
    <div className='w-[1280px]'>
      <SectionTitle text='Дешборд' />

      <div className='grid grid-cols-[265px_1fr_265px] gap-2 h-full'>
        <div className='p-2 bg-green-50 rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Фильтры: калибровка</h2>
          <FilteringOptions colsNumber='grid-cols-1' filterId='filters1' />
        </div>
        <div className='p-2 bg-gray-50 rounded-[16px] flex flex-col gap-4 shadow-lg'>
          <h2 className='font-bold'>Сравнение двух выбранных популяций:</h2>
          {/* table */}
          {/* barchart */}
        </div>
        <div className='p-2 bg-red-50 rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Фильтры: для сравнения</h2>
          <FilteringOptions colsNumber='grid-cols-1' filterId='filters2' />
        </div>
        {/* buffer */}
        <div className='h-[200px] m-4'></div>
      </div>
    </div>
  )
}

export default Dashboard

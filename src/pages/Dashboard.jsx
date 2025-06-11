import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { redirect, useLoaderData } from 'react-router-dom'

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
  const { user } = useLoaderData()

  const employeesInitialState = useSelector(
    (state) => state.employeesState.employees
  )

  // actions:
  // 1. get all employees from store
  // 1.1 re-generate filtering multiselect for employees for Filter 1
  // 2. get filtered employees from store
  // 3. process data to acquire data for charts (F1 vs F2) - use existing functions and visuals, just adopt data -- trick part is to join filtered at F1 with filtered at F2

  return (
    <div className='w-[1280px]'>
      <SectionTitle text='Дешборд' />

      <div className='grid grid-cols-[250px_1fr_250px] gap-2 h-full'>
        <div className='p-2 bg-green-50 rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Фильтры: калибровка</h2>
          <FilteringOptions colsNumber='grid-cols-1' />
        </div>
        <div className='p-2 bg-gray-50 rounded-[16px] flex flex-col gap-4 shadow-lg'>
          <h2 className='font-bold'>Сравнение двух выбранных популяций:</h2>
          {/* table */}
          {/* barchart */}
        </div>
        <div className='p-2 bg-red-50 rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Фильтры: для сравнения</h2>
          <FilteringOptions colsNumber='grid-cols-1' />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

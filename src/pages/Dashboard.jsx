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
  const userRole = user.roles[0]
  const isAdmin = userRole === 'ROLE_ADMIN'

  const employeesInitialState = useSelector(
    (state) => state.employeesState.employees
  )

  return (
    <div className='w-[1280px]'>
      <SectionTitle text='Дешборд' />

      <div className='grid grid-cols-[250px_1fr_250px] gap-2 h-full'>
        <div className='p-2 bg-green-50 rounded-[16px]'>
          <h2 className='font-bold'>Filters 1</h2>
          <FilteringOptions colsNumber='grid-cols-1' />
        </div>
        <div className='p-2 bg-gray-50 rounded-[16px]'>1</div>
        <div className='p-2 bg-red-50 rounded-[16px]'>1</div>
      </div>
    </div>
  )
}

export default Dashboard

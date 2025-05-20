import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { redirect, useLoaderData } from 'react-router-dom'

import { SectionTitle } from '../components'

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
    <div className='mb-4'>
      <SectionTitle text='Дешборд' />
      <div className=''>your role is {userRole}</div>
    </div>
  )
}

export default Dashboard

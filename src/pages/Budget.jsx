import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { redirect, useLoaderData } from 'react-router-dom'

import {
  SectionTitle,
  ChartBudget,
  ChartBarSimple,
  ChartTable,
  FilteringOptions,
} from '../components'

import { calculateTotalBonus, prepareDataForTable } from '../utils/'

export const loader = (store, queryClient) => async (request) => {
  // ROLES CHECK
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  return { user }
}

const Budget = () => {
  const employees = useSelector((state) => state.employeesState.employees)
  const filteredEmployees = useSelector(
    (state) => state.employeesState.filteredEmployees
  )
  const data = filteredEmployees.length > 0 ? filteredEmployees : employees

  // DATA FOR KPI CARDS
  const bonusBudget = data
    .map((employee) => {
      return +employee.targetBonusBudget
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  const bonusBeforeCalibration = calculateTotalBonus(data, 'before')
  const bonusAfterCalibration = calculateTotalBonus(data, 'after')
  const dataForTable = prepareDataForTable(data)

  return (
    <div className='mb-4 w-[1280px]'>
      <SectionTitle text='Бюджет' />

      <FilteringOptions colsNumber='grid-cols-4' />

      <div className='flex flex-col gap-4 rounded-[16px] '>
        <ChartBudget
          budget={bonusBudget}
          bonusBeforeCalibration={bonusBeforeCalibration}
          bonusAfterCalibration={bonusAfterCalibration}
        />

        <ChartBarSimple
          title='Распределение оценок (до/после калибровки)'
          data={dataForTable}
        />

        <ChartTable
          title='Распределение оценок и бюджета (до/после калибровки)'
          data={dataForTable}
        />
      </div>
    </div>
  )
}

export default Budget

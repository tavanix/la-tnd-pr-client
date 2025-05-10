import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { redirect, useLoaderData } from 'react-router-dom'

import {
  SectionTitle,
  CollapseWithArrow,
  MultiSelect2,
  ChartBudget,
  ChartBarSimple,
  ChartTable,
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

const Dashboard = () => {
  const { user } = useLoaderData()
  const userRole = user.roles[0]
  const isAdmin = userRole === 'ROLE_ADMIN'

  const employeesInitialState = useSelector(
    (state) => state.employeesState.employees
  )

  const [employees, setEmployees] = useState(employeesInitialState)
  const [selectedLevel1, setSelectedLevel1] = useState([])
  const [selectedLevel2, setSelectedLevel2] = useState([])

  // options for level1
  let level1 = [...new Set(employeesInitialState.map((e) => e.level1))]
  level1 = level1.map((item) => {
    return {
      label: item,
      value: item,
    }
  })

  useEffect(() => {
    !isAdmin ? setSelectedLevel1([level1[0].value]) : level1
  }, [isAdmin])

  // options for level2
  let level2 = selectedLevel1
    .map((elem) => employeesInitialState.filter((e) => e.level1 === elem))
    .map((elem) => elem.map((e) => e.level2))
  // .map((e) => e.map((el) => el.level2))

  level2 = [...new Set(level2.flat())].map((item) => {
    return {
      label: item,
      value: item,
    }
  })

  // FILTER BY PARAMS
  useEffect(() => {
    if (selectedLevel1.length === 0) {
      setEmployees(employeesInitialState)
      return
    }

    let filteredEmployees = selectedLevel1
      .map((elem) => employeesInitialState.filter((e) => e.level1 === elem))
      .flat()

    if (selectedLevel2.length > 0) {
      filteredEmployees = selectedLevel2
        .map((elem) => filteredEmployees.filter((e) => e.level2 === elem))
        .flat()
    }

    setEmployees(filteredEmployees)
  }, [selectedLevel1, selectedLevel2])

  // DATA FOR KPI CARDS
  const bonusBudget = employees
    .map((employee) => {
      return +employee.targetBonusBudget
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)
  const bonusBeforeCalibration = calculateTotalBonus(employees, 'before')
  const bonusAfterCalibration = calculateTotalBonus(employees, 'after')
  const dataForTable = prepareDataForTable(employees)

  return (
    <div className='mb-4'>
      <SectionTitle text='Дешборд' />
      <CollapseWithArrow
        title='Фильтры'
        content={
          <div className='bg-base-100 flex gap-2 h-full'>
            {isAdmin && (
              <MultiSelect2
                options={level1}
                selected={selectedLevel1}
                setSelected={setSelectedLevel1}
                label='Уровень 1'
              />
            )}
            <MultiSelect2
              options={level2}
              selected={selectedLevel2}
              setSelected={setSelectedLevel2}
              label='Уровень 2'
            />
          </div>
        }
      />

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

export default Dashboard

const resetBelow = (level) => {
  if (level === 'level1') {
    setSelectedLevel2(null)
    setSelectedLevel3(null)
  } else if (level === 'level2') {
    setSelectedLevel3(null)
  } else if (level === 'level3') {
    setSelectedLevel4(null)
  }
}

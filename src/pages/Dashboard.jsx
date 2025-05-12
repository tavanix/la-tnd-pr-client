import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { redirect, useLoaderData } from 'react-router-dom'

import {
  SectionTitle,
  CollapseWithArrow,
  MultiSelect,
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
  const [selectedLevel3, setSelectedLevel3] = useState([])
  const [selectedLevel4, setSelectedLevel4] = useState([])
  const [selectedPositions, setSelectedPositions] = useState([])

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

  level2 = [...new Set(level2.flat())].map((item) => {
    return {
      label: item,
      value: item,
    }
  })

  // options for level3
  let level3 = selectedLevel2
    .map((elem) => employeesInitialState.filter((e) => e.level2 === elem))
    .map((elem) => elem.map((e) => e.level3))

  level3 = [...new Set(level3.flat())].map((item) => {
    return {
      label: item,
      value: item,
    }
  })

  // options for level4
  let level4 = selectedLevel3
    .map((elem) => employeesInitialState.filter((e) => e.level3 === elem))
    .map((elem) => elem.map((e) => e.level4))

  level4 = [...new Set(level4.flat())].map((item) => {
    return {
      label: item,
      value: item,
    }
  })

  // options for positions
  // let positions = [
  //   ...new Set(
  //     selectedLevel1
  //       .map((e) => employeesInitialState.filter((el) => el.level1 === e))
  //       .flat()
  //   ),
  // ].map((e) => {
  //   return {
  //     level1: e.level1,
  //     level2: e.level2,
  //     level3: e.level3,
  //     level4: e.level4,
  //     position: e.positionTitle,
  //   }
  // })

  let positions = selectedLevel1
    .map((elem) => employeesInitialState.filter((e) => e.level1 === elem))
    .flat()

  positions =
    selectedLevel2.length > 0
      ? selectedLevel2
          .map((elem) => positions.filter((e) => e.level2 === elem))
          .flat()
      : positions

  positions =
    selectedLevel3.length > 0
      ? selectedLevel3
          .map((elem) => positions.filter((e) => e.level3 === elem))
          .flat()
      : positions

  positions =
    selectedLevel4.length > 0
      ? selectedLevel4
          .map((elem) => positions.filter((e) => e.level4 === elem))
          .flat()
      : positions

  let test = [
    ...new Set(
      [...new Set(positions.flat())].map((elem) => elem.positionTitle)
    ),
  ]

  positions = [
    ...new Set(
      [...new Set(positions.flat())].map((elem) => elem.positionTitle)
    ),
  ]

  positions = positions.map((item) => {
    return {
      value: item,
      label: item,
    }
  })

  // FILTERS
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

    if (selectedLevel3.length > 0) {
      filteredEmployees = selectedLevel3
        .map((elem) => filteredEmployees.filter((e) => e.level3 === elem))
        .flat()
    }

    if (selectedLevel4.length > 0) {
      filteredEmployees = selectedLevel4
        .map((elem) => filteredEmployees.filter((e) => e.level4 === elem))
        .flat()
    }

    if (selectedPositions.length > 0) {
      filteredEmployees = selectedPositions
        .map((elem) =>
          filteredEmployees.filter((e) => e.positionTitle === elem)
        )
        .flat()
    }

    setEmployees(filteredEmployees)
  }, [
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    selectedLevel4,
    selectedPositions,
  ])

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
          <div className='bg-base-100 grid grid-cols-4 gap-2 h-full'>
            {isAdmin && (
              <MultiSelect
                options={level1}
                selected={selectedLevel1}
                setSelected={setSelectedLevel1}
                label='Уровень 1'
              />
            )}
            <MultiSelect
              options={level2}
              selected={selectedLevel2}
              setSelected={setSelectedLevel2}
              label='Уровень 2'
            />
            <MultiSelect
              options={level3}
              selected={selectedLevel3}
              setSelected={setSelectedLevel3}
              label='Уровень 3'
            />
            <MultiSelect
              options={level4}
              selected={selectedLevel4}
              setSelected={setSelectedLevel4}
              label='Уровень 4'
            />
            <MultiSelect
              options={positions}
              selected={selectedPositions}
              setSelected={setSelectedPositions}
              label='Должность'
            />
          </div>
        }
      />

      <div className='flex flex-col gap-4 rounded-[16px] '>
        <div className='divider my-0'></div>
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

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { redirect, Form, useLoaderData, Link } from 'react-router-dom'

import {
  useLevel1,
  useLevel2,
  useLevel3,
  useLevel4,
} from '../hooks/useLevelData.js'

import {
  ChartBarSimple,
  ChartBudget,
  ChartTable,
  CollapseWithArrow,
  SectionTitle,
  SubmitBtn,
  MultiSelect,
} from '../components'

import { calculateTotalBonus, prepareDataForTable } from '../utils/'

const departments = [
  {
    id: '1',
    name: 'Дирекция по управлению персоналом и административной деятельности',
    value: 'Дирекция по управлению персоналом и административной деятельности',
    label: 'Дирекция по управлению персоналом и административной деятельности',
    role: 'ROLE_HRBP_HR',
  },
  {
    id: '2',
    name: 'Дирекция информационных технологий',
    value: 'Дирекция информационных технологий',
    label: 'Дирекция информационных технологий',
    role: 'ROLE_HRBP_IT',
  },
]

export const loader = (store, queryClient) => async (request) => {
  // ROLES CHECK
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  // PARAMS QUERY
  let params = Object.fromEntries([
    ...new URL(request.request.url).searchParams.entries(),
  ])

  return { user, params }
}

const Dashboard = () => {
  const [selectedDepartments, setSelectedDepartments] = useState([]) //!!!!

  const { user, params } = useLoaderData()
  const userRole = user.roles[0]
  const isAdmin = userRole === 'ROLE_ADMIN'

  const employeesInitialState = useSelector(
    (state) => state.employeesState.employees
  )
  const [employees, setEmployees] = useState(employeesInitialState)

  const [selectedLevel1, setSelectedLevel1] = useState(null)
  const [selectedLevel2, setSelectedLevel2] = useState(null)
  const [selectedLevel3, setSelectedLevel3] = useState(null)
  const [selectedLevel4, setSelectedLevel4] = useState(null)
  const [selectedPosition, setSelectedPosition] = useState(null)

  const { data: level1FromDB, isLoading: loadingLevel1 } = useLevel1()
  const { data: level2, isLoading: loadingLevel2 } = useLevel2(selectedLevel1)
  const { data: level3, isLoading: loadingLevel3 } = useLevel3(selectedLevel2)
  const { data: level4, isLoading: loadingLevel4 } = useLevel4(selectedLevel3)

  let level1 = isAdmin
    ? level1FromDB
    : level1FromDB?.filter((l) => l.role === userRole)

  // FILTER BY PARAMS
  useEffect(() => {
    if (params.level1 === 'Все' || !params.level1) {
      setEmployees(employeesInitialState)
      return
    }

    const filteredResult = employeesInitialState.filter(
      (e) => e.level1 === params.level1
    )

    setEmployees(filteredResult)
    setSelectedLevel1(params.level1)
  }, [params])

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

  // DATA FOR KPI CARDS
  // total budget
  const bonusBudget = employees
    .map((employee) => {
      return +employee.targetBonusBudget
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  // calculations
  const bonusBeforeCalibration = calculateTotalBonus(employees, 'before')
  const bonusAfterCalibration = calculateTotalBonus(employees, 'after')
  const dataForTable = prepareDataForTable(employees)

  return (
    <div className='mb-4'>
      <SectionTitle text='Дешборд' />
      <CollapseWithArrow
        title='Фильтры'
        content={
          <Form method='GET' className='bg-base-100 flex flex-col gap-y-2 mt-4'>
            <section className='grid grid-cols-3 gap-2 mb-8'>
              <div className='form-control'>
                <label className='label label-text capitalize text-neutral-500'>
                  Уровень 1:
                </label>
                <select
                  name='level1'
                  value={selectedLevel1 || ''}
                  onChange={(e) => {
                    setSelectedLevel1(e.target.value)
                    resetBelow('level1')
                  }}
                  className='select select-bordered w-full'
                >
                  {isAdmin && <option value='Все'>Все</option>}
                  {loadingLevel1 ? (
                    <option disabled>Загрузка...</option>
                  ) : (
                    level1?.map((value) => (
                      <option key={value.id} value={value.name}>
                        {value.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </section>

            <div className='flex gap-2'>
              <SubmitBtn text='Применить' block='false' btnType='secondary' />
              <SubmitBtn
                text='reset'
                block='false'
                btnType='btn-warning'
                onClick={() => {
                  console.log('clicked')
                }} // TODO
              />
            </div>
          </Form>
        }
      />

      <div className='flex flex-col gap-4 rounded-[16px] '>
        <MultiSelect
          options={departments}
          selected={selectedDepartments}
          setSelected={setSelectedDepartments}
          label='Департамент'
        />

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

// restrict data by user role
// if (userRole === 'ROLE_HRBP_HR') {
//   employees = employees.filter(
//     (employee) =>
//       employee.level1 ===
//       'Дирекция по управлению персоналом и административной деятельности'
//   )
// }

// filtering
// if (selectedLevel1 && selectedLevel1 !== null) {
//   employees = employees.filter(
//     (employee) => employee.level1 === selectedLevel1
//   )
// }

// if (selectedLevel2 && selectedLevel2 !== 'Все') {
//   employees = employees.filter(
//     (employee) => employee.level2 === selectedLevel2
//   )
// }

// if (selectedLevel3 && selectedLevel3 !== 'Все') {
//   employees = employees.filter(
//     (employee) => employee.level3 === selectedLevel3
//   )
// }

// if (selectedLevel4 && selectedLevel4 !== 'Все') {
//   employees = employees.filter(
//     (employee) => employee.level4 === selectedLevel4
//   )
// }

// if (
//   selectedLevel1 === 'Все' ||
//   selectedLevel1 === null ||
//   selectedLevel1 === '' ||
//   selectedLevel1 === undefined
// ) {
//   employees = employeesInitialState
// }

// const positions = [
//   ...new Set(employees.map((employee) => employee.positionTitle).sort()),
// ]

// const level_1 = [
//   ...new Set(employees.map((employee) => employee.level1).sort()),
// ]

// // if (selectedPosition === 'Все') {
// //   employees = employees
// // }

// if (selectedPosition && selectedPosition !== 'Все') {
//   employees = employees.filter(
//     (employee) => employee.positionTitle === selectedPosition
//   )
// }

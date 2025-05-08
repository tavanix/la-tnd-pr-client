import { useState } from 'react'
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
} from '../components'

export const loader = (store, queryClient) => async (request) => {
  // ROLES CHECK
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }
  return { user }
}

function calculateTotalBonus(data, calcType) {
  const getMultiplier = (evaluation) => {
    switch (evaluation) {
      case 'Топ':
        return 3
      case 'Отлично':
        return 1.5
      case 'Хорошо':
        return 1
      case 'Можешь лучше':
        return 0.5
      case 'Плохо':
        return 0
      default:
        return 0
    }
  }

  return data.reduce((total, employee) => {
    let evaluation = employee.managerEvaluation

    if (
      calcType === 'after' &&
      employee.calibration &&
      employee.calibration !== ''
    ) {
      evaluation = employee.calibration
    }

    const multiplier = getMultiplier(evaluation)
    const bonus = +employee.targetBonusSum

    return total + bonus * multiplier
  }, 0)
}

const mergeArrays = (arr1, arr2) => {
  return arr1.map((item) => ({
    ...item,
    ...arr2.find((obj) => obj.rate === item.rate && obj.target === item.target),
  }))
}

// v2
const prepareDataForTable = (employees) => {
  const totalEmployees = employees.length
  const bonusFundTotal = employees.reduce(
    (accumulator, employee) => accumulator + +employee.targetBonusBudget,
    0
  )

  const iterationKeys = [
    { rate: 'Топ', target: '1%', multiplier: 3 },
    { rate: 'Отлично', target: '15%', multiplier: 1.5 },
    { rate: 'Хорошо', target: '75%', multiplier: 1 },
    { rate: 'Можешь лучше', target: '7%', multiplier: 0.5 },
    { rate: 'Плохо', target: '2%', multiplier: 0 },
  ]

  const processEmployees = (evaluationKey, evaluationField) => {
    return iterationKeys.map((key) => {
      const filteredEmployees = employees.filter(
        (employee) => employee[evaluationField] === key.rate
      )

      const headcount = filteredEmployees.length
      const bonusFund = filteredEmployees.reduce(
        (accumulator, employee) =>
          accumulator + +employee.targetBonusSum * key.multiplier,
        0
      )

      return {
        rate: key.rate,
        target: key.target,
        [`${evaluationKey}Hc`]: headcount,
        [`${evaluationKey}Percent`]:
          ((headcount / totalEmployees) * 100).toFixed(1) + '%',
        [`${evaluationKey}FundPercent`]:
          ((bonusFund / bonusFundTotal) * 100).toFixed(1) + '%',
        bonusFundTotal: bonusFundTotal,
        [`${evaluationKey}Fund`]: bonusFund,
      }
    })
  }

  const arrayBefore = processEmployees('before', 'managerEvaluation')
  const arrayAfter = processEmployees('after', 'calibration')

  return mergeArrays(arrayBefore, arrayAfter)
}

const Dashboard = () => {
  const { user } = useLoaderData()
  const userRole = user.roles[0]

  const [selectedLevel1, setSelectedLevel1] = useState(null)
  const [selectedLevel2, setSelectedLevel2] = useState(null)
  const [selectedLevel3, setSelectedLevel3] = useState(null)
  const [selectedLevel4, setSelectedLevel4] = useState(null)
  const [selectedPosition, setSelectedPosition] = useState(null)

  const { data: level1, isLoading: loadingLevel1 } = useLevel1()
  const { data: level2, isLoading: loadingLevel2 } = useLevel2(selectedLevel1)
  const { data: level3, isLoading: loadingLevel3 } = useLevel3(selectedLevel2)
  const { data: level4, isLoading: loadingLevel4 } = useLevel4(selectedLevel3)

  // FILTER BY PARAMS
  const initEmployees = useSelector((state) => state.employeesState.employees)
  let employees = useSelector((state) => state.employeesState.employees)

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

  // restrict data by user role
  if (userRole === 'ROLE_HRBP_HR') {
    employees = employees.filter(
      (employee) =>
        employee.level1 ===
        'Дирекция по управлению персоналом и административной деятельности'
    )
  }

  // filtering
  if (selectedLevel1 && selectedLevel1 !== null) {
    employees = employees.filter(
      (employee) => employee.level1 === selectedLevel1
    )
  }

  if (selectedLevel2 && selectedLevel2 !== 'Все') {
    employees = employees.filter(
      (employee) => employee.level2 === selectedLevel2
    )
  }

  if (selectedLevel3 && selectedLevel3 !== 'Все') {
    employees = employees.filter(
      (employee) => employee.level3 === selectedLevel3
    )
  }

  if (selectedLevel4 && selectedLevel4 !== 'Все') {
    employees = employees.filter(
      (employee) => employee.level4 === selectedLevel4
    )
  }

  if (
    selectedLevel1 === 'Все' ||
    selectedLevel1 === null ||
    selectedLevel1 === '' ||
    selectedLevel1 === undefined
  ) {
    employees = initEmployees
  }

  const positions = [
    ...new Set(employees.map((employee) => employee.positionTitle).sort()),
  ]

  const level_1 = [
    ...new Set(employees.map((employee) => employee.level1).sort()),
  ]

  // if (selectedPosition === 'Все') {
  //   employees = employees
  // }

  if (selectedPosition && selectedPosition !== 'Все') {
    employees = employees.filter(
      (employee) => employee.positionTitle === selectedPosition
    )
  }

  // DATA FOR KPI CARDS
  // total budget
  const bonusBudget = employees
    .map((employee) => {
      return +employee.targetBonusBudget
    })
    .reduce((accumulator, currentValue) => accumulator + currentValue, 0)

  // bonus sum before calibration
  const bonusBeforeCalibration = calculateTotalBonus(employees, 'before')

  // bonus sum after calibration
  const bonusAfterCalibration = calculateTotalBonus(employees, 'after')

  // DATA FOR TABLE
  const dataForTable = prepareDataForTable(employees)

  return (
    <div className='mb-4'>
      <SectionTitle text='Дешборд' />
      <CollapseWithArrow
        title='Фильтры'
        content={
          <div className='grid grid-cols-4 gap-4'>
            {/* level1 */}
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
                <option value='Все'>Все</option>
                {loadingLevel1 ? (
                  <option disabled>Загрузка...</option>
                ) : (
                  level_1?.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))
                  // level1?.map((value) => (
                  //   <option key={value.id} value={value.id}>
                  //     {value.name}
                  //   </option>
                  // ))
                )}
              </select>
            </div>

            {/* level2 */}
            <div className='form-control'>
              <label className='label label-text capitalize text-neutral-500'>
                Уровень 2:
              </label>
              <select
                name='level2'
                value={selectedLevel2 || ''}
                onChange={(e) => {
                  setSelectedLevel2(e.target.value)
                  resetBelow('level2')
                }}
                className='select select-bordered w-full'
                disabled={!selectedLevel1 || selectedLevel1 === 'Все'}
              >
                <option value='Все'>Все</option>
                {loadingLevel2 ? (
                  <option disabled>Загрузка...</option>
                ) : (
                  level2?.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* level3*/}
            <div className='form-control'>
              <label className='label label-text capitalize text-neutral-500'>
                Уровень 3:
              </label>
              <select
                name='level3'
                value={selectedLevel3 || ''}
                onChange={(e) => {
                  setSelectedLevel3(e.target.value)
                  resetBelow('level3')
                }}
                className='select select-bordered w-full'
                disabled={!selectedLevel2 || selectedLevel2 === 'Все'}
              >
                <option value='Все'>Все</option>
                {loadingLevel3 ? (
                  <option disabled>Загрузка...</option>
                ) : (
                  level3?.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* level3*/}
            <div className='form-control'>
              <label className='label label-text capitalize text-neutral-500'>
                Уровень 4:
              </label>
              <select
                name='level4'
                value={selectedLevel4 || ''}
                onChange={(e) => {
                  setSelectedLevel4(e.target.value)
                  resetBelow('level4')
                }}
                className='select select-bordered w-full'
                disabled={!selectedLevel3 || selectedLevel3 === 'Все'}
              >
                <option value='Все'>Все</option>
                {loadingLevel4 ? (
                  <option disabled>Загрузка...</option>
                ) : (
                  level4?.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* positions */}
            <div className='form-control'>
              <label className='label label-text capitalize text-neutral-500'>
                Должность:
              </label>
              <select
                name='positionTitle'
                onChange={(e) => {
                  setSelectedPosition(e.target.value)
                }}
                className='select select-bordered w-full'
                disabled={!selectedLevel1 || selectedLevel1 === 'Все'}
              >
                <option value='Все'>Все</option>
                {positions?.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
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

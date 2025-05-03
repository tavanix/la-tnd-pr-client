import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { redirect, Form, useLoaderData, Link } from 'react-router-dom'

import {
  ChartBarSimple,
  ChartBudget,
  ChartTable,
  CollapseWithArrow,
  SectionTitle,
  SubmitBtn,
  LevelSelector,
} from '../components'

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
  let { user, params } = useLoaderData()

  // const [employees, setEmployees] = useState(
  //   useSelector((state) => state.employeesState.employees)
  // )

  // FILTER BY PARAMS
  console.log(params)
  let employees = useSelector((state) => state.employeesState.employees)

  if (params.level1 === 'ROLE_HRBP_HR' && params.level2 === '') {
    console.log('yes')

    employees = employees.filter(
      (employee) =>
        employee.level1 ===
        'Дирекция по управлению персоналом и административной деятельности'
    )
  }

  if (
    params.level2 !== undefined &&
    params.level2 !== null &&
    params.level2 !== ''
  ) {
    employees = employees.filter(
      (employee) => employee.level2 === params.level2
    )
  }

  console.log(employees)

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
          <Form method='GET' className='bg-base-100 flex flex-col gap-y-2 mt-4'>
            <section className='grid mb-4'>
              <LevelSelector user={user} />
            </section>
            <div className='flex gap-2'>
              <SubmitBtn
                text='Применить'
                block='false'
                btnOutline='btn-outline'
                btnType='success'
              />
              <Link
                to='/dashboard'
                className='btn btn-outline btn-primary text-white w-36 '
              >
                Сбросить
              </Link>
            </div>
          </Form>
        }
      />

      <div className='flex flex-col gap-4 rounded-[16px]'>
        {/* {params.level1 && (
          <div className='rounded-[7px] w-full flex flex-col border shadow-lg p-6'>
            <h2 className='font-bold'>Примененные фильтры:</h2>
            <h3>Level 1 = {params.level1}</h3>
            <h3>Level 2 = {params.level2}</h3>
            <h3>Bonus = {params.hasBonus}</h3>
            <h3>Должность = {params.positionTitle}</h3>
          </div>
        )} */}

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
          title='Распределение оценок и бюджета (до и после калибровки)'
          data={dataForTable}
        />
      </div>
    </div>
  )
}

export default Dashboard

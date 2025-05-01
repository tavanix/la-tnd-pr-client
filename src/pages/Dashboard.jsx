import {
  ChartBarSimple,
  ChartBudget,
  ChartTable,
  CollapseWithArrow,
  SectionTitle,
  FormSelect,
  SubmitBtn,
} from '../components'
import { useSelector } from 'react-redux'
import { redirect, Form, useLoaderData, Link } from 'react-router-dom'

import { customFetch } from '../utils'

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

  return { params }
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
  let { params } = useLoaderData()
  const employeesInitialState = useSelector(
    (state) => state.employeesState.employees
  )

  console.log(employeesInitialState)

  let employees = employeesInitialState.filter(
    (employee) => employee.level1 === params.level1
  )
  // .filter((employee) => employee.level2 === params.level2)
  // .filter((employee) => employee.bonus === params.bonus)
  // .filter((employee) => employee.positionTitle === params.positionTitle)

  if (params.level1 === undefined) {
    employees = employeesInitialState
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
          <Form method='GET' className='bg-base-100 flex flex-col gap-y-2 mt-4'>
            <section className='grid grid-cols-3 gap-2 mb-8'>
              <FormSelect
                label='Level 1'
                name='level1'
                value={params.level1}
                list={employeesInitialState.map((employee) => employee.level1)}
              />
              {/* <FormSelect
                label='Level 2'
                name='level2'
                list={employeesInitialState.map((employee) => employee.level2)}
              />
              <FormSelect
                label='Bonus'
                name='hasBonus'
                list={employeesInitialState.map(
                  (employee) => employee.hasBonus
                )}
              />
              <FormSelect
                label='Должность'
                name='positionTitle'
                list={employeesInitialState.map(
                  (employee) => employee.positionTitle
                )}
              /> */}
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

      <div className='flex flex-col gap-2 rounded'>
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

        <div className=''>
          <ChartBarSimple
            title='Распределение оценок (до/после калибровки)'
            data={dataForTable}
          />
        </div>

        <ChartTable
          title='Распределение оценок и бюджета (до и после калибровки)'
          data={dataForTable}
        />
      </div>
    </div>
  )
}

export default Dashboard

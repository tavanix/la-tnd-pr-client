import { useSelector } from 'react-redux'
import { redirect } from 'react-router-dom'

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
    (state) => state.employeesState.filteredEmployees1
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

  // transform data
  const translitData = dataForTable.map((item) => {
    return {
      rate: item.rate,
      до: item.beforeHc,
      после: item.afterHc,
    }
  })

  const totalAfterSum = dataForTable.reduce(
    (acc, item) => acc + (item.afterSum || 0),
    0
  )

  const mergedDataForTable = (() => {
    const rest = dataForTable.filter(
      (item) => item.rate !== 'Можешь лучше' && item.rate !== 'Плохо'
    )

    const ml = dataForTable.find((item) => item.rate === 'Можешь лучше') || {}
    const bad = dataForTable.find((item) => item.rate === 'Плохо') || {}

    const sumNumeric = (a, b) => (a || 0) + (b || 0)
    const sumPercent = (a = '0%', b = '0%') =>
      `${(
        parseFloat(a.replace('%', '')) + parseFloat(b.replace('%', ''))
      ).toFixed(1)}%`

    const merged = {
      rate: 'Можешь лучше / Плохо',
      target: `${sumPercent(ml.target, bad.target)}`,
      beforeHc: sumNumeric(ml.beforeHc, bad.beforeHc),
      beforePercent: sumPercent(ml.beforePercent, bad.beforePercent),
      beforeFundPercent: sumPercent(
        ml.beforeFundPercent,
        bad.beforeFundPercent
      ),
      afterHc: sumNumeric(ml.afterHc, bad.afterHc),
      afterPercent: sumPercent(ml.afterPercent, bad.afterPercent),
      afterFundPercent: 0, // временно, будет пересчитан позже
    }

    return [...rest, merged]
  })()

  const mergedDataForTableFinal = mergedDataForTable.map((item) => ({
    ...item,
    afterFundPercent:
      totalAfterSum === 0
        ? '0%'
        : `${((item.afterSum / totalAfterSum) * 100).toFixed(1)}%`,
  }))

  return (
    <div className='mb-4 w-[1280px]'>
      <SectionTitle text='Бюджет' />

      <FilteringOptions colsNumber='grid-cols-5' filterId='filters1' />

      <div className='flex flex-col gap-4 rounded-[16px] '>
        <ChartBudget
          budget={bonusBudget}
          bonusBeforeCalibration={bonusBeforeCalibration}
          bonusAfterCalibration={bonusAfterCalibration}
        />

        <ChartBarSimple
          title='Распределение оценок (до/после калибровки)'
          data={translitData}
          arg1='до'
          arg2='после'
          color1='#b9b9ba'
          color2='#47b872'
        />

        <ChartTable
          title='Распределение оценок и бюджета (до/после калибровки)'
          data={mergedDataForTableFinal}
        />
      </div>
    </div>
  )
}

export default Budget

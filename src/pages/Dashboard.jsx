import {
  ChartBudget,
  ChartDomainRadar,
  ChartTable,
  ChartTreeMap,
  SectionTitle,
} from '../components'
import { useSelector } from 'react-redux'

export const loader = (store, queryClient) => async () => {
  // ROLES CHECK
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  return null
}

function calculateTotalBonus(data, calcType) {
  return data.reduce((total, employee) => {
    let multiplier = 0

    // Проверка типа расчета
    if (calcType === 'before') {
      // Если перед калибровкой, используем managerEvaluation
      if (employee.managerEvaluation === 'Топ') {
        multiplier = 3
      } else if (employee.managerEvaluation === 'Отлично') {
        multiplier = 1.5
      } else if (employee.managerEvaluation === 'Хорошо') {
        multiplier = 1
      } else if (employee.managerEvaluation === 'Можешь лучше') {
        multiplier = 0.5
      } else if (employee.managerEvaluation === 'Плохо') {
        multiplier = 0
      }
    } else if (calcType === 'after') {
      // Если после калибровки, сначала проверяем calibration
      if (employee.calibration && employee.calibration !== '') {
        if (employee.calibration === 'Топ') {
          multiplier = 3
        } else if (employee.calibration === 'Отлично') {
          multiplier = 1.5
        } else if (employee.calibration === 'Хорошо') {
          multiplier = 1
        } else if (employee.calibration === 'Можешь лучше') {
          multiplier = 0.5
        } else if (employee.calibration === 'Плохо') {
          multiplier = 0
        }
      } else {
        // Если нет калибровки, используем managerEvaluation
        if (employee.managerEvaluation === 'Топ') {
          multiplier = 3
        } else if (employee.managerEvaluation === 'Отлично') {
          multiplier = 1.5
        } else if (employee.managerEvaluation === 'Хорошо') {
          multiplier = 1
        } else if (employee.managerEvaluation === 'Можешь лучше') {
          multiplier = 0.5
        } else if (employee.managerEvaluation === 'Плохо') {
          multiplier = 0
        }
      }
    }

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

const prepareDataForTable = (employees) => {
  const totalEmployees = employees.length
  // TODO: refactor - DRY
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

  let arrayBefore = []
  let arrayAfter = []

  // PROCESSING BEFORE
  iterationKeys.map((key) => {
    // check for empty rates
    if (
      !employees
        .map((employee) => employee.managerEvaluation)
        .includes(key.rate)
    ) {
      arrayBefore.push({
        rate: key.rate,
        target: key.target,
        beforeHc: 0,
        beforePercent: '0%',
        beforeFundPercent: '0%',
      })
    }

    // logic
    const filteredEmployeesBefore = employees.filter(
      (employee) => employee.managerEvaluation === key.rate
    )

    if (filteredEmployeesBefore.length === 0) return

    let bonusFundBefore = 0
    let bonusFundAtCurrentRate = 0

    arrayBefore.push(
      filteredEmployeesBefore.reduce((accumalator, employee) => {
        bonusFundBefore += +employee.targetBonusSum * key.multiplier
        bonusFundAtCurrentRate += +employee.targetBonusBudget

        return {
          rate: key.rate,
          target: key.target,
          beforeHc: filteredEmployeesBefore.length,
          beforePercent:
            ((filteredEmployeesBefore.length / totalEmployees) * 100).toFixed(
              1
            ) + '%',
          beforeFundPercent:
            ((bonusFundBefore / bonusFundTotal) * 100).toFixed(1) + '%',
          bonusFundTotal: bonusFundTotal,
          bonusFundBefore: bonusFundBefore,
          bonusFundAtCurrentRate: bonusFundAtCurrentRate,
        }
      }, [])
    )
  })

  // PROCESSING AFTER
  iterationKeys.map((key) => {
    // check for empty rates
    if (!employees.map((employee) => employee.calibration).includes(key.rate)) {
      arrayAfter.push({
        rate: key.rate,
        target: key.target,
        afterHc: 0,
        afterPercent: '0%',
        afterFundPercent: '0%',
      })
    }

    // logic
    let bonusFundAfter = 0

    const filteredEmployeesAfter = employees.filter(
      (employee) => employee.calibration === key.rate
    )

    if (filteredEmployeesAfter === null) return

    arrayAfter.push(
      filteredEmployeesAfter.reduce((accumalator, employee) => {
        bonusFundAfter += +employee.targetBonusSum * key.multiplier

        return {
          rate: key.rate,
          target: key.target,
          afterHc: filteredEmployeesAfter.length,
          afterPercent:
            ((filteredEmployeesAfter.length / totalEmployees) * 100).toFixed(
              1
            ) + '%',
          afterFundPercent:
            ((bonusFundAfter / bonusFundTotal) * 100).toFixed(1) + '%',
          bonusFundTotal: bonusFundTotal,
          bonusFundAfter: bonusFundAfter,
        }
      }, [])
    )
  })

  return mergeArrays(arrayBefore, arrayAfter)
}

const Dashboard = () => {
  const employees = useSelector((state) => state.employeesState.employees)

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

  // DATA FOR RADAR
  const dataForRadarRates = dataForTable.reduce((accumulator, current) => {
    const newObject = {
      rate: current.rate,
      target: +((employees.length * current.target.slice(0, -1)) / 100).toFixed(
        0
      ), // рассчитываем целевую численность по рейтингу
      actual: current.afterHc,
    }

    accumulator.push(newObject)
    return accumulator
  }, [])

  const dataForRadarBudget = dataForTable.reduce((accumulator, current) => {
    const newObject = {
      rate: current.rate,
      target: current.bonusFundAtCurrentRate / 1000,
      actual: current.bonusFundAfter / 1000,
    }

    accumulator.push(newObject)
    return accumulator
  }, [])

  // DATA FOR TREEMAP
  const dataForTreemapBefore = dataForTable.reduce((accumulator, current) => {
    const newObject = {
      name: current.rate,
      value: current.beforeHc,
    }

    accumulator.push(newObject)
    return accumulator
  }, [])

  const dataForTreemapAfter = dataForTable.reduce((accumulator, current) => {
    const newObject = {
      name: current.rate,
      value: current.afterHc,
    }

    accumulator.push(newObject)
    return accumulator
  }, [])

  return (
    <div className='mb-16'>
      <SectionTitle text='Дешборд' />
      <div className='flex flex-col gap-2'>
        <ChartBudget
          budget={bonusBudget}
          bonusBeforeCalibration={bonusBeforeCalibration}
          bonusAfterCalibration={bonusAfterCalibration}
        />

        <ChartTable
          title='Распределение до и после калибровки'
          data={dataForTable}
        />

        <div className='flex gap-2'>
          <ChartDomainRadar
            title='Распределение оценок'
            planLegend='Цель'
            actualLegend='Факт'
            data={dataForRadarRates}
          />
          <ChartDomainRadar
            title='Распределение бюджета (тыс.руб.)'
            planLegend='Бюджет'
            actualLegend='Факт'
            data={dataForRadarBudget}
          />
        </div>

        <div className='flex gap-2'>
          <ChartTreeMap
            title='Распределение оценок (до)'
            data={dataForTreemapBefore}
          />
          <ChartTreeMap
            title='Распределение оценок (после)'
            data={dataForTreemapAfter}
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

// Функция для группировки элементов массива по значению поля rate
// const groupByRate = (array) => {
//   return array.reduce((acc, item) => {
//     if (!acc[item.managerEvaluation]) {
//       acc[item.managerEvaluation] = []
//     }
//     acc[item.managerEvaluation].push(item)
//     return acc
//   }, {})
// }

// Группируем элементы массива по полю rate
// const groupedData = groupByRate(employees)

// console.log('groupped: ', groupedData['Топ'])

// giga chat
// function groupByDate(array) {
//   const temp = array.reduce((acc, item) => {
//     if (!acc[item.managerEvaluation]) {
//       acc[item.managerEvaluation] = []
//     }
//     acc[item.managerEvaluation].push(item)
//     return acc
//   }, {})

//   return Object.getOwnPropertyNames(temp).map((elem) => temp[elem])
// }
// console.log('giga chat: ', groupByDate(employees))

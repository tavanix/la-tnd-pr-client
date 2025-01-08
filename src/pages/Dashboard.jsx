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

    arrayBefore.push(
      filteredEmployeesBefore.reduce((accumalator, employee) => {
        bonusFundBefore += +employee.targetBonusSum * key.multiplier

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
  const dataForRadarBefore = [
    {
      rate: 'Top',
      target: 1,
      actual: 1,
    },
    {
      rate: 'Отлично',
      target: 20,
      actual: 25,
    },
    {
      rate: 'Молодец',
      target: 59,
      actual: 54,
    },
    {
      rate: 'Хорошо',
      target: 12,
      actual: 17,
    },
    {
      rate: 'Можешь лучше',
      target: 8,
      actual: 3,
    },
  ]

  const dataForRadarAfter = [
    {
      rate: 'Top',
      target: 120,
      actual: 110,
    },
    {
      rate: 'Отлично',
      target: 98,
      actual: 130,
    },
    {
      rate: 'Молодец',
      target: 86,
      actual: 130,
    },
    {
      rate: 'Хорошо',
      target: 99,
      actual: 100,
    },
    {
      rate: 'Можешь лучше',
      target: 85,
      actual: 90,
    },
  ]

  // DATA FOR TREEMAP
  const dataForTreemapBefore = [
    {
      name: 'Top',
      value: 1,
      color: '#e09d00',
    },
    {
      name: 'Perfect',
      value: 15,
      color: '#83a6ed',
    },
    {
      name: 'Good',
      value: 54,
      color: '#9ab972',
    },
    {
      name: 'Can better',
      value: 20,
      color: '#a26969',
    },
    {
      name: 'Bad',
      value: 10,
      color: '#146200',
    },
  ]

  const dataForTreemapAfter = [
    {
      name: 'Top',
      value: 1,
      color: '#8884d8',
    },
    {
      name: 'Perfect',
      value: 21,
      color: '#83a6ed',
    },
    {
      name: 'Good',
      value: 60,
      color: '#83a6ed',
    },
    {
      name: 'Can better',
      value: 10,
      color: '#83a6ed',
    },
    {
      name: 'Bad',
      value: 8,
      color: '#83a6ed',
    },
  ]

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
            data={dataForRadarBefore}
          />
          <ChartDomainRadar
            title='Распределение бюджета'
            planLegend='Бюджет'
            actualLegend='Факт'
            data={dataForRadarAfter}
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

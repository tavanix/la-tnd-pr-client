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

const Dashboard = () => {
  const employees = useSelector((state) => state.employeesState.employees)

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

  const dataRates = [
    {
      subject: 'Top',
      target: 1,
      actual: 1,
      fullMark: 100,
    },
    {
      subject: 'Отлично',
      target: 20,
      actual: 25,
      fullMark: 100,
    },
    {
      subject: 'Молодец',
      target: 59,
      actual: 54,
      fullMark: 100,
    },
    {
      subject: 'Хорошо',
      target: 12,
      actual: 17,
      fullMark: 100,
    },
    {
      subject: 'Можешь лучше',
      target: 8,
      actual: 3,
      fullMark: 100,
    },
  ]

  const dataBudget = [
    {
      subject: 'Top',
      target: 120,
      actual: 110,
      fullMark: 150,
    },
    {
      subject: 'Отлично',
      target: 98,
      actual: 130,
      fullMark: 150,
    },
    {
      subject: 'Молодец',
      target: 86,
      actual: 130,
      fullMark: 150,
    },
    {
      subject: 'Хорошо',
      target: 99,
      actual: 100,
      fullMark: 150,
    },
    {
      subject: 'Можешь лучше',
      target: 85,
      actual: 90,
      fullMark: 150,
    },
  ]

  const dataBefore = [
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

  const dataAfter = [
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
        <ChartTable title='Распределение до и после калибровки' />
        <div className='flex gap-2'>
          <ChartDomainRadar
            title='Распределение оценок'
            planLegend='Цель'
            actualLegend='Факт'
            data={dataRates}
          />
          <ChartDomainRadar
            title='Распределение бюджета'
            planLegend='Бюджет'
            actualLegend='Факт'
            data={dataBudget}
          />
        </div>
        <div className='flex gap-2'>
          <ChartTreeMap title='Распределение оценок (до)' data={dataBefore} />
          <ChartTreeMap title='Распределение оценок (после)' data={dataAfter} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard

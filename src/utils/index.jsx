import axios from 'axios'

const url = 'http://localhost:1007/api/'
// const url = 'http://192.168.1.84:1007/api/'
// const url = 'http://10.163.17.110:1007/api/' // network

const customFetch = axios.create({
  baseURL: url,
})

customFetch.interceptors.request.use((config) => {
  const token = JSON.parse(localStorage.getItem('user'))?.token

  if (token) {
    // config.headers.Authorization = `Bearer ${token}`
    config.headers['x-access-token'] = token
  }
  return config
})

export { customFetch }

export const currentDate = () => {
  const date = new Date()

  let day = date.getDate()
  if (day < 10) day = '0' + day

  let month = date.getMonth() + 1
  if (month < 10) month = '0' + month

  const year = date.getFullYear()

  const currentDate = `${year}-${month}-${day}`

  return currentDate
}

// dashboard
export function calculateTotalBonus(data, calcType) {
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

export const prepareDataForTable = (employees) => {
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

export const mergeArrays = (arr1, arr2) => {
  return arr1.map((item) => ({
    ...item,
    ...arr2.find((obj) => obj.rate === item.rate && obj.target === item.target),
  }))
}

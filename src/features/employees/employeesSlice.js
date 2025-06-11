import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  employees: [],
  filteredEmployees: [],

  optionsLevel1: [],
  optionsLevel2: [],
  optionsLevel3: [],
  optionsLevel4: [],
  optionsPositionTitle: [],
  optionsEmployeeName: [],
  optionsHasBonus: [],
  optionsLevelFromCeo: [],
  optionsCalibration: [],

  filters: {
    selectedLevel1: [],
    selectedLevel2: [],
    selectedLevel3: [],
    selectedLevel4: [],
    selectedPositionTitle: [],
    selectedEmployeeName: [],
    selectedHasBonus: [],
    selectedLevelFromCeo: [],
    selectedCalibration: [],
  },
}

const applyAllFilters = (state) => {
  const { filters } = state
  const { employees } = state

  // Шаг 1. Получаем filteredEmployees на основе всех фильтров
  let filtered = employees.filter((employee) => {
    return Object.entries(filters).every(([key, selected]) => {
      if (!selected || selected.length === 0) return true
      const fieldKey =
        key
          .replace(/^selected/, '')
          .charAt(0)
          .toLowerCase() + key.replace(/^selected/, '').slice(1)
      return selected.includes(employee[fieldKey])
    })
  })

  state.filteredEmployees = filtered

  // Шаг 2. Обновляем options* для всех фильтров, с исключением самого себя
  const getOptions = (excludeKey) => {
    const base = employees.filter((employee) =>
      Object.entries(filters).every(([key, selected]) => {
        if (key === excludeKey || selected.length === 0) return true
        const fieldKey =
          key
            .replace(/^selected/, '')
            .charAt(0)
            .toLowerCase() + key.replace(/^selected/, '').slice(1)
        return selected.includes(employee[fieldKey])
      })
    )

    return (key) =>
      [...new Set(base.map((e) => e[key]))].map((value) => ({
        label: value,
        value,
      }))
  }

  const get = getOptions

  state.optionsLevel1 = get('selectedLevel1')('level1')
  state.optionsLevel2 = get('selectedLevel2')('level2')
  state.optionsLevel3 = get('selectedLevel3')('level3')
  state.optionsLevel4 = get('selectedLevel4')('level4')
  state.optionsPositionTitle = get('selectedPositionTitle')('positionTitle')
  state.optionsEmployeeName = get('selectedEmployeeName')('employeeName')
  state.optionsHasBonus = get('selectedHasBonus')('hasBonus')
  state.optionsLevelFromCeo = get('selectedLevelFromCeo')('levelFromCeo')
  state.optionsCalibration = get('selectedCalibration')('calibration')
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload
      applyAllFilters(state)
    },

    setFilter: (state, action) => {
      const { field, values } = action.payload
      state.filters[field] = values
      applyAllFilters(state)
    },

    resetFilters: (state) => {
      state.filters = {
        selectedLevel1: [],
        selectedLevel2: [],
        selectedLevel3: [],
        selectedLevel4: [],
        selectedPositionTitle: [],
        selectedEmployeeName: [],
        selectedHasBonus: [],
        selectedLevelFromCeo: [],
        selectedCalibration: [],
      }
      applyAllFilters(state)
    },

    editEmployee: (state, action) => {
      const updatedEmployee = action.payload
      const { email: updatedEmail } = updatedEmployee

      // 1) Найти и заменить запись в полном списке state.employees
      const indexInAll = state.employees.findIndex(
        (emp) => emp.email === updatedEmail
      )
      if (indexInAll !== -1) {
        state.employees[indexInAll] = updatedEmployee
      }

      // 2) Найти и заменить запись в state.filteredEmployees
      const indexInFiltered = state.filteredEmployees.findIndex(
        (emp) => emp.email === updatedEmail
      )
      if (indexInFiltered !== -1) {
        state.filteredEmployees[indexInFiltered] = updatedEmployee
      }

      // 3) Повторить фильтрацию
      applyAllFilters(state)

      toast.success('Изменения успешно сохранены!')
    },
  },
})

export const { setEmployees, setFilter, resetFilters, editEmployee } =
  employeesSlice.actions

export default employeesSlice.reducer

// editEmployee: (state, action) => {
//       const updatedEmployee = action.payload
//       const employeeIndex = state.employees.findIndex(
//         (employee) => employee.email === updatedEmployee.email
//       )

//       // fix the bug with index in filtered
//       // it can not change correctly by index because employees are full data
//       if (employeeIndex !== -1) {
//         state.employees[employeeIndex] = updatedEmployee
//         state.filteredEmployees[employeeIndex] = updatedEmployee

//         toast.success('Изменения успешно сохранены!')
//       }
//     },

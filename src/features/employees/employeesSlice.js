import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialFilterSet = {
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

const initialState = {
  employees: [],

  filteredEmployees1: [],
  filteredEmployees2: [],

  filters: {
    filters1: { ...initialFilterSet },
    filters2: { ...initialFilterSet },
  },
}

const applyFilters = (employees, filters) => {
  return employees.filter((employee) =>
    Object.entries(filters).every(([key, selected]) => {
      if (!selected?.length) return true
      const field =
        key
          .replace(/^selected/, '')
          .charAt(0)
          .toLowerCase() + key.replace(/^selected/, '').slice(1)
      return selected.includes(employee[field])
    })
  )
}

const applyAllFilters = (state) => {
  const { employees, filters } = state
  state.filteredEmployees1 = applyFilters(employees, filters.filters1)
  state.filteredEmployees2 = applyFilters(employees, filters.filters2)
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
      const { filterId, field, values } = action.payload
      if (!state.filters[filterId]) return
      state.filters[filterId][field] = values
      applyAllFilters(state)
    },

    resetFilters: (state, action) => {
      const { filterId } = action.payload
      if (!state.filters[filterId]) return
      state.filters[filterId] = { ...initialFilterSet }
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
      const indexInFiltered = state.filteredEmployees1.findIndex(
        (emp) => emp.email === updatedEmail
      )
      if (indexInFiltered !== -1) {
        state.filteredEmployees1[indexInFiltered] = updatedEmployee
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

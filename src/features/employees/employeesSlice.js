import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  employees: [],
  filteredEmployees: [],
  optionsLevel1: {},
  filters: {
    selectedLevel1: [],
  },
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // инициализация в при первом входе HomeLayout
    setEmployees: (state, action) => {
      state.employees = action.payload

      // сразу же подготавливаем выпадающий список для Уровень1
      state.optionsLevel1 = [
        ...new Set(state.employees.map((e) => e.level1)),
      ].map((item) => {
        return {
          label: item,
          value: item,
        }
      })

      // если зашел партнер, у которого 1 функция только, то сразу выбираем эту функцию для Уровень1
      if (state.optionsLevel1.length === 1) {
        state.filters.selectedLevel1 = state.optionsLevel1
        state.filteredEmployees = state.filters.selectedLevel1
          .map((filter) =>
            state.employees.filter(
              (employee) => employee.level1 === filter.value
            )
          )
          .flat()
      }
    },

    setOptionsLevel1: (state, action) => {
      state.filters.selectedLevel1 = action.payload

      // если выбран Уровень1, то фильтруем состояние отфильтрованных
      state.filteredEmployees = state.filters.selectedLevel1
        .map((filter) =>
          state.employees.filter((employee) => employee.level1 === filter)
        )
        .flat()
    },

    // setOptionsLevel2: (state, action) => {
    //   console.log('here: ', action.payload)
    // },

    editEmployee: (state, action) => {
      const updatedEmployee = action.payload
      const employeeIndex = state.employees.findIndex(
        (employee) => employee.email === updatedEmployee.email
      )

      if (employeeIndex !== -1) {
        state.employees[employeeIndex] = updatedEmployee
        state.filteredEmployees[employeeIndex] = updatedEmployee

        toast.success('Изменения успешно сохранены!')
      }
    },

    resetState(state) {
      state.employees = []
      state.filteredEmployees = []
      state.optionsLevel1 = {}
      state.filters = {
        selectedLevel1: undefined,
      }
    },
  },
})

export const { setEmployees, editEmployee, resetState } = employeesSlice.actions

export default employeesSlice.reducer

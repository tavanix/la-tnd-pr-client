import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  employees: [],
  filteredEmployees: [],
  optionsLevel1: {},
  optionsLevel2: {},
  filters: {
    selectedLevel1: [],
  },
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // init in HomeLayout
    setEmployees: (state, action) => {
      state.employees = action.payload

      // Map the employees data to optionsLevel1
      state.optionsLevel1 = [
        ...new Set(state.employees.map((e) => e.level1)),
      ].map((item) => {
        return {
          label: item,
          value: item,
        }
      })
    },

    setOptionsLevel1: (state, action) => {
      state.filters.selectedLevel1 = action.payload
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
        toast.success('Изменения успешно сохранены!')
      }
    },
  },
})

export const { setEmployees, editEmployee } = employeesSlice.actions

export default employeesSlice.reducer

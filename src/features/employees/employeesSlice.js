import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  employees: [],
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    setEmployees: (state, action) => {
      state.employees = action.payload
    },
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

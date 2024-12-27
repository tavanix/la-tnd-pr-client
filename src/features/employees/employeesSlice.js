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
      console.log(action.payload)
      toast.success(
        'Изменения успешно сохранены, обновите страницу для отображения изменений!'
      )
    },
  },
})

export const { setEmployees, editEmployee } = employeesSlice.actions

export default employeesSlice.reducer

import { configureStore } from '@reduxjs/toolkit'

import userReducer from './features/user/userSlice'
import employeesReducer from './features/employees/employeesSlice'

export const store = configureStore({
  reducer: {
    userState: userReducer,
    employeesState: employeesReducer,
  },
})

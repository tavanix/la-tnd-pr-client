import { createSlice } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

const themes = {
  white: 'lamodaLight',
  black: 'lamodaBlack',
}

const getUserFromLocalStorage = () => {
  return JSON.parse(localStorage.getItem('user')) || null
}

const getThemeFromLocalStorage = () => {
  const theme = localStorage.getItem('theme') || themes.white
  document.documentElement.setAttribute('data-theme', theme)
  return theme
}

const initialState = {
  user: getUserFromLocalStorage(),
  theme: getThemeFromLocalStorage(),
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => {
      const user = {
        employeeId: action.payload.employeeId,
        username: action.payload.username,
        token: action.payload.accessToken,
        roles: [...action.payload.roles],
        email: action.payload.email,
      }
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },

    logoutUser: (state) => {
      state.user = null
      localStorage.removeItem('user')
      useDispatch().dispatch({ type: 'employees/resetState' })
      toast.success('Logged out successfully!')
    },

    updatePassword: () => {
      toast.success('You have successfully changed your password!')
    },

    toggleTheme: (state) => {
      const { white, black } = themes
      state.theme = state.theme === white ? black : white
      document.documentElement.setAttribute('data-theme', state.theme)
      localStorage.setItem('theme', state.theme)
    },
  },
})

export const { loginUser, logoutUser, updatePassword, toggleTheme } =
  userSlice.actions

export default userSlice.reducer

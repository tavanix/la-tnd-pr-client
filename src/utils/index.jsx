import axios from 'axios'

const url = 'http://localhost:1007/api/'

export const customFetch = axios.create({
  baseURL: url,
})

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

// mass signup
import users from './massSignupList'

const signupUsers = async (array) => {
  await array.map((item) => {
    try {
      const response = customFetch.post('/auth/signup', item)
    } catch (error) {
      const errorMesssage =
        error?.response?.data?.error?.message ||
        'Please double check your credentials'
      return null
    }
  })
}

// signupUsers(users)

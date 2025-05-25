import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  employees: [],
  filteredEmployees: [],
  optionsLevel1: [],
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
      ].map((item) => ({ label: item, value: item }))

      // если зашел партнер, у которого 1 функция только, то сразу выбираем эту функцию для Уровень1
      if (state.optionsLevel1.length === 1) {
        state.filters.selectedLevel1 = [state.optionsLevel1[0].value]

        state.filteredEmployees = state.employees.filter(
          (e) => e.level1 === state.optionsLevel1[0].value
        )

        // строим опции Level2 из уже отфильтрованных
        state.optionsLevel2 = [
          ...new Set(state.filteredEmployees.map((e) => e.level2)),
        ].map((item) => ({ label: item, value: item }))
      }
    },

    setOptionsLevel1: (state, action) => {
      // action.payload — массив выбранных Level1.value
      state.filters.selectedLevel1 = [...action.payload]

      // сброс всех Level2-фильтров
      state.filters.selectedLevel2 = []

      // пересчитаем optionsLevel2
      const byLevel1 = state.employees.filter((e) =>
        state.filters.selectedLevel1.includes(e.level1)
      )
      state.optionsLevel2 = Array.from(
        new Set(byLevel1.map((e) => e.level2))
      ).map((val) => ({ label: val, value: val }))

      // если сразу нужно фильтровать таблицу только по Level1:
      state.filteredEmployees = byLevel1
    },

    setOptionsLevel2: (state, action) => {
      // 1) Сохраняем выбранные значения Level 2
      state.filters.selectedLevel2 = action.payload

      // 2) Определяем базовый массив, откуда будем фильтровать:
      //    если Level 1 выбран — используем уже отфильтрованные по нему,
      //    иначе — весь список сотрудников
      const base =
        state.filters.selectedLevel1.length > 0
          ? state.employees.filter((e) =>
              state.filters.selectedLevel1.includes(e.level1)
            )
          : state.employees

      // 3) Теперь ужесточаем фильтрацию по Level 2
      state.filteredEmployees =
        action.payload.length > 0
          ? base.filter((e) => action.payload.includes(e.level2))
          : base
    },

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
      state.optionsLevel1 = []
      state.filters = {
        selectedLevel1: [],
      }
    },
  },
})

export const {
  setEmployees,
  setOptionsLevel1,
  setOptionsLevel2,
  editEmployee,
  resetState,
} = employeesSlice.actions

export default employeesSlice.reducer

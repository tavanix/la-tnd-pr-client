import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  employees: [],
  filteredEmployees: [],
  optionsLevel1: [],
  optionsLevel2: [],
  optionsLevel3: [],
  optionsLevel4: [],
  optionsPositionTitles: [],
  filters: {
    selectedLevel1: [],
    selectedLevel2: [],
    selectedLevel3: [],
    selectedLevel4: [],
    selectedPositionTitles: [],
  },
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // инициализация в при первом входе HomeLayout
    setEmployees: (state, action) => {
      state.employees = action.payload

      // сразу же подготавливаем выпадающий список для Level1
      state.optionsLevel1 = [
        ...new Set(state.employees.map((e) => e.level1)),
      ].map((item) => ({ label: item, value: item }))

      // сразу же подготавливаем выпадающий список для PositionTitle
      state.optionsPositionTitles = [
        ...new Set(state.employees.map((e) => e.positionTitle)),
      ].map((item) => ({ label: item, value: item }))

      // если зашел партнер, у которого 1 функция только, то сразу выбираем эту функцию для Level1
      if (state.optionsLevel1.length === 1) {
        state.filters.selectedLevel1 = [state.optionsLevel1[0].value]
        const filteredData = state.employees.filter(
          (e) => e.level1 === state.optionsLevel1[0].value
        )
        state.filteredEmployees = filteredData

        // строим опции Level2 из уже отфильтрованных
        if (action.payload.length > 0) {
          state.optionsLevel2 = [
            ...new Set(state.filteredEmployees.map((e) => e.level2)),
          ].map((item) => ({ label: item, value: item }))
        } else {
          state.optionsLevel2 = []
        }

        // строим опции PositionTitle из уже отфильтрованных
        if (action.payload.length > 0) {
          state.optionsPositionTitles = [
            ...new Set(state.filteredEmployees.map((e) => e.positionTitle)),
          ].map((item) => ({ label: item, value: item }))
        } else {
          state.optionsPositionTitles = []
        }
      }
    },

    setOptionsLevel1: (state, action) => {
      state.filters.selectedLevel1 = [...action.payload]

      // сброс всех фильтров
      state.optionsLevel2 = []
      state.optionsLevel3 = []
      state.optionsLevel4 = []
      state.optionsPositionTitles = []

      state.filters.selectedLevel2 = []
      state.filters.selectedLevel3 = []
      state.filters.selectedLevel4 = []
      state.filters.selectedPositionTitles = []

      // если сразу нужно фильтровать таблицу только по Level1:
      const filteredByLevel1 = state.employees.filter((e) =>
        state.filters.selectedLevel1.includes(e.level1)
      )
      state.filteredEmployees = filteredByLevel1

      // пересчитаем optionsLevel2
      state.optionsLevel2 = [
        ...new Set(state.filteredEmployees.map((e) => e.level2)),
      ].map((item) => ({ label: item, value: item }))

      // пересчитаем positionTitles
      state.optionsPositionTitles = [
        ...new Set(state.filteredEmployees.map((e) => e.positionTitle)),
      ].map((item) => ({ label: item, value: item }))
    },

    setOptionsLevel2: (state, action) => {
      // 1) Сохраняем выбранные значения Level 2
      state.filters.selectedLevel2 = action.payload

      // сброс всех фильтров
      state.optionsLevel3 = []
      state.optionsLevel4 = []
      // state.optionsPositionTitles = []

      // state.filters.selectedLevel3 = []
      // state.filters.selectedLevel4 = []
      // state.filters.selectedPositionTitles = []

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

      // 4) Определяем опции для Level3
      if (action.payload.length > 0) {
        state.optionsLevel3 = [
          ...new Set(state.filteredEmployees.map((e) => e.level3)),
        ].map((item) => ({ label: item, value: item }))
      } else {
        state.optionsLevel3 = []
      }

      // пересчитаем positionTitles
      state.optionsPositionTitles = [
        ...new Set(state.filteredEmployees.map((e) => e.positionTitle)),
      ].map((item) => ({ label: item, value: item }))
    },

    // один редьюсер, который в переменную будет обрабатывать все фильтры и в стейт возвращать

    setOptionsLevel3: (state, action) => {
      state.filters.selectedLevel3 = action.payload

      // 1) сброс всех фильтров
      // state.filters.selectedLevel4 = []
      // state.filters.selectedPositionTitles = []
      state.optionsLevel4 = []
      // state.optionsPositionTitles = []

      // 2) Определяем базовый массив
      const base =
        state.filters.selectedLevel2.length > 0
          ? state.employees.filter((e) =>
              state.filters.selectedLevel2.includes(e.level2)
            )
          : state.filteredEmployees

      // 3) Теперь ужесточаем фильтрацию по Level 3
      state.filteredEmployees =
        action.payload.length > 0
          ? base.filter((e) => action.payload.includes(e.level3))
          : base

      // 4) Определяем опции для Level4
      if (action.payload.length > 0) {
        state.optionsLevel4 = [
          ...new Set(state.filteredEmployees.map((e) => e.level4)),
        ].map((item) => ({ label: item, value: item }))
      } else {
        state.optionsLevel4 = []
      }

      // пересчитаем positionTitles
      state.optionsPositionTitles = [
        ...new Set(state.filteredEmployees.map((e) => e.positionTitle)),
      ].map((item) => ({ label: item, value: item }))
    },

    setOptionsLevel4: (state, action) => {
      state.filters.selectedLevel4 = action.payload

      // 2) Определяем базовый массив
      const base =
        state.filters.selectedLevel3.length > 0
          ? state.employees.filter((e) =>
              state.filters.selectedLevel3.includes(e.level3)
            )
          : state.filteredEmployees

      // 3) Теперь ужесточаем фильтрацию по Level 3
      state.filteredEmployees =
        action.payload.length > 0
          ? base.filter((e) => action.payload.includes(e.level4))
          : base

      // пересчитаем positionTitles
      state.optionsPositionTitles = [
        ...new Set(state.filteredEmployees.map((e) => e.positionTitle)),
      ].map((item) => ({ label: item, value: item }))
    },

    setPositionTitles: (state, action) => {
      state.filters.selectedPositionTitles = action.payload

      // 1) сброс всех фильтров
      // не нужно сбрасывать Level1, Level2, Level3, Level4

      // 2) Определяем базовый массив
      const base =
        state.filters.selectedPositionTitles.length > 0
          ? state.employees.filter((e) =>
              state.filters.selectedPositionTitles.includes(e.positionTitle)
            )
          : state.employees

      // 3) Теперь ужесточаем фильтрацию по positionTitle
      state.filteredEmployees =
        action.payload.length > 0
          ? base.filter((e) => action.payload.includes(e.positionTitle))
          : base

      // пересчитаем
      state.optionsLevel2 = [
        ...new Set(state.filteredEmployees.map((e) => e.level2)),
      ].map((item) => ({ label: item, value: item }))

      // state.optionsLevel3 = [
      //   ...new Set(state.filteredEmployees.map((e) => e.level3)),
      // ].map((item) => ({ label: item, value: item }))

      // state.optionsLevel4 = [
      //   ...new Set(state.filteredEmployees.map((e) => e.level4)),
      // ].map((item) => ({ label: item, value: item }))
    },

    // TODO!!!
    editEmployee: (state, action) => {
      const updatedEmployee = action.payload
      const employeeIndex = state.employees.findIndex(
        (employee) => employee.email === updatedEmployee.email
      )

      // fix the bug with index in filtered
      // it can not change correctly by index because employees are full data
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
      state.optionsLevel2 = []
      state.optionsLevel3 = []
      state.optionsLevel4 = []
      state.optionsPositionTitles = []
      state.filters = {
        selectedLevel1: [],
        selectedLevel2: [],
        selectedLevel3: [],
        selectedLevel4: [],
        selectedPositionTitles: [],
      }
    },
  },
})

export const {
  setEmployees,
  setOptionsLevel1,
  setOptionsLevel2,
  setOptionsLevel3,
  setOptionsLevel4,
  setPositionTitles,
  editEmployee,
  resetState,
} = employeesSlice.actions

export default employeesSlice.reducer

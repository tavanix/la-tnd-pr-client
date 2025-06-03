// src/features/employees/employeesSlice.js

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  employees: [],
  filteredEmployees: [],

  optionsLevel1: [],
  optionsLevel2: [],
  optionsLevel3: [],
  optionsLevel4: [],
  optionsPositionTitles: [],
  optionsEmployeeName: [],
  optionsHasBonus: [],
  optionsLevelFromCeo: [],
  optionsScoreCalibrated: [],

  filters: {
    selectedLevel1: [],
    selectedLevel2: [],
    selectedLevel3: [],
    selectedLevel4: [],
    selectedPositionTitles: [],
    selectedEmployeeName: [],
    selectedHasBonus: [],
    selectedLevelFromCeo: [],
    selectedScoreCalibrated: [],
  },
}

const applyAllFilters = (state) => {
  const {
    selectedLevel1,
    selectedLevel2,
    selectedLevel3,
    selectedLevel4,
    selectedPositionTitles,
    selectedEmployeeName,
    selectedHasBonus,
    selectedLevelFromCeo,
    selectedScoreCalibrated,
  } = state.filters

  const filtered = state.employees.filter((e) => {
    return (
      (selectedLevel1.length === 0 || selectedLevel1.includes(e.level1)) &&
      (selectedLevel2.length === 0 || selectedLevel2.includes(e.level2)) &&
      (selectedLevel3.length === 0 || selectedLevel3.includes(e.level3)) &&
      (selectedLevel4.length === 0 || selectedLevel4.includes(e.level4)) &&
      (selectedPositionTitles.length === 0 ||
        selectedPositionTitles.includes(e.positionTitle)) &&
      (selectedEmployeeName.length === 0 ||
        selectedEmployeeName.includes(e.employeeName)) &&
      (selectedHasBonus.length === 0 ||
        selectedHasBonus.includes(e.hasBonus)) &&
      (selectedLevelFromCeo.length === 0 ||
        selectedLevelFromCeo.includes(e.levelFromCeo)) &&
      (selectedScoreCalibrated.length === 0 ||
        selectedScoreCalibrated.includes(e.calibration))
    )
  })

  state.filteredEmployees = filtered

  // Обновим выпадающие списки на основе уже отфильтрованных данных
  const getOptions = (key) =>
    [...new Set(filtered.map((e) => e[key]))]
      .filter(Boolean)
      .map((item) => ({ label: item, value: item }))

  state.optionsLevel1 = getOptions('level1')
  state.optionsLevel2 = getOptions('level2')
  state.optionsLevel3 = getOptions('level3')
  state.optionsLevel4 = getOptions('level4')
  state.optionsPositionTitles = getOptions('positionTitle')
  state.optionsEmployeeName = getOptions('employeeName')
  state.optionsHasBonus = getOptions('hasBonus')
  state.optionsLevelFromCeo = getOptions('levelFromCeo')
  state.optionsScoreCalibrated = getOptions('calibration')
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
      const { field, values } = action.payload
      state.filters[field] = values
      applyAllFilters(state)
    },

    resetFilters: (state) => {
      state.filters = {
        selectedLevel1: [],
        selectedLevel2: [],
        selectedLevel3: [],
        selectedLevel4: [],
        selectedPositionTitles: [],
        selectedEmployeeName: [],
        selectedHasBonus: [],
        selectedLevelFromCeo: [],
        selectedScoreCalibrated: [],
      }
      applyAllFilters(state)
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
  },
})

export const { setEmployees, setFilter, resetFilters, editEmployee } =
  employeesSlice.actions

export default employeesSlice.reducer

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

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // 1) Инициализация полного списка сотрудников
    setEmployees(state, action) {
      state.employees = action.payload
      state.filteredEmployees = [...action.payload]

      // Заполняем все опции из полного массива сотрудников
      state.optionsEmployeeName = [
        ...new Set(state.employees.map((e) => e.employeeName)),
      ].map((val) => ({ label: val, value: val }))

      state.optionsPositionTitles = [
        ...new Set(state.employees.map((e) => e.positionTitle)),
      ].map((val) => ({ label: val, value: val }))

      state.optionsLevel1 = [
        ...new Set(state.employees.map((e) => e.level1)),
      ].map((val) => ({ label: val, value: val }))

      state.optionsLevel2 = [
        ...new Set(state.employees.map((e) => e.level2)),
      ].map((val) => ({ label: val, value: val }))

      state.optionsLevel3 = [
        ...new Set(state.employees.map((e) => e.level3)),
      ].map((val) => ({ label: val, value: val }))

      state.optionsLevel4 = [
        ...new Set(state.employees.map((e) => e.level4)),
      ].map((val) => ({ label: val, value: val }))

      state.optionsHasBonus = [
        ...new Set(state.employees.map((e) => e.hasBonus)),
      ].map((val) => ({ label: String(val), value: val }))

      state.optionsLevelFromCeo = [
        ...new Set(state.employees.map((e) => e.levelFromCeo)),
      ].map((val) => ({ label: val, value: val }))

      state.optionsScoreCalibrated = [
        ...new Set(state.employees.map((e) => e.calibration)),
      ].map((val) => ({ label: String(val), value: val }))
    },

    // 2) Приватная функция: пересчитывает filteredEmployees и ВСЕ опции
    _recomputeFilters(state) {
      // 2.1. Берём полный список
      let base = [...state.employees]

      // 2.2. Фильтруем по выбранным именам (если есть)
      const nameSel = state.filters.selectedEmployeeName
      let baseAfterName = base
      if (nameSel.length > 0) {
        baseAfterName = base.filter((e) => nameSel.includes(e.employeeName))
      }

      // 2.3. Собираем опции для должностей (до применения собственного фильтра по должности)
      state.optionsPositionTitles = [
        ...new Set(baseAfterName.map((e) => e.positionTitle)),
      ].map((val) => ({ label: val, value: val }))

      // 2.4. Применяем фильтр по должности
      const posSel = state.filters.selectedPositionTitles
      let baseAfterPositions = baseAfterName
      if (posSel.length > 0) {
        baseAfterPositions = baseAfterName.filter((e) =>
          posSel.includes(e.positionTitle)
        )
      }

      // 2.5. Собираем опции Level1 из baseAfterPositions (до применения Level1)
      state.optionsLevel1 = [
        ...new Set(baseAfterPositions.map((e) => e.level1)),
      ].map((val) => ({ label: val, value: val }))

      // 2.6. Фильтруем по Level1
      const lvl1Sel = state.filters.selectedLevel1
      let baseAfterLevel1 = baseAfterPositions
      if (lvl1Sel.length > 0) {
        baseAfterLevel1 = baseAfterPositions.filter((e) =>
          lvl1Sel.includes(e.level1)
        )
      }

      // 2.7. Собираем опции Level2 из baseAfterLevel1 (до применения Level2)
      state.optionsLevel2 = [
        ...new Set(baseAfterLevel1.map((e) => e.level2)),
      ].map((val) => ({ label: val, value: val }))

      // 2.8. Фильтруем по Level2
      const lvl2Sel = state.filters.selectedLevel2
      let baseAfterLevel2 = baseAfterLevel1
      if (lvl2Sel.length > 0) {
        baseAfterLevel2 = baseAfterLevel1.filter((e) =>
          lvl2Sel.includes(e.level2)
        )
      }

      // 2.9. Собираем опции Level3 из baseAfterLevel2 (до применения Level3)
      state.optionsLevel3 = [
        ...new Set(baseAfterLevel2.map((e) => e.level3)),
      ].map((val) => ({ label: val, value: val }))

      // 2.10. Фильтруем по Level3
      const lvl3Sel = state.filters.selectedLevel3
      let baseAfterLevel3 = baseAfterLevel2
      if (lvl3Sel.length > 0) {
        baseAfterLevel3 = baseAfterLevel2.filter((e) =>
          lvl3Sel.includes(e.level3)
        )
      }

      // 2.11. Собираем опции Level4 из baseAfterLevel3 (до применения Level4)
      state.optionsLevel4 = [
        ...new Set(baseAfterLevel3.map((e) => e.level4)),
      ].map((val) => ({ label: val, value: val }))

      // 2.12. Фильтруем по Level4
      const lvl4Sel = state.filters.selectedLevel4
      let baseAfterLevel4 = baseAfterLevel3
      if (lvl4Sel.length > 0) {
        baseAfterLevel4 = baseAfterLevel3.filter((e) =>
          lvl4Sel.includes(e.level4)
        )
      }

      // 2.13. Собираем опции HasBonus из baseAfterLevel4 (до применения HasBonus)
      state.optionsHasBonus = [
        ...new Set(baseAfterLevel4.map((e) => e.hasBonus)),
      ].map((val) => ({ label: String(val), value: val }))

      // 2.14. Фильтруем по HasBonus
      const bonusSel = state.filters.selectedHasBonus
      let baseAfterBonus = baseAfterLevel4
      if (bonusSel.length > 0) {
        baseAfterBonus = baseAfterLevel4.filter((e) =>
          bonusSel.includes(e.hasBonus)
        )
      }

      // 2.15. Собираем опции LevelFromCeo из baseAfterBonus (до применения LevelFromCeo)
      state.optionsLevelFromCeo = [
        ...new Set(baseAfterBonus.map((e) => e.levelFromCeo)),
      ].map((val) => ({ label: val, value: val }))

      // 2.16. Фильтруем по LevelFromCeo
      const lvlCeoSel = state.filters.selectedLevelFromCeo
      let baseAfterLevelFromCeo = baseAfterBonus
      if (lvlCeoSel.length > 0) {
        baseAfterLevelFromCeo = baseAfterBonus.filter((e) =>
          lvlCeoSel.includes(e.levelFromCeo)
        )
      }

      // 2.17. Собираем опции ScoreCalibrated из baseAfterLevelFromCeo (до применения ScoreCalibrated)
      state.optionsScoreCalibrated = [
        ...new Set(baseAfterLevelFromCeo.map((e) => e.calibration)),
      ].map((val) => ({ label: String(val), value: val }))

      // 2.18. Фильтруем по ScoreCalibrated
      const scoreSel = state.filters.selectedScoreCalibrated
      let baseAfterScore = baseAfterLevelFromCeo
      if (scoreSel.length > 0) {
        baseAfterScore = baseAfterLevelFromCeo.filter((e) =>
          scoreSel.includes(e.calibration)
        )
      }

      // 3) Сохраняем отфильтрованный результат
      state.filteredEmployees = baseAfterScore
    },

    // 3) Действия установки фильтров:
    setOptionsEmployeeName(state, action) {
      state.filters.selectedEmployeeName = [...action.payload]
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsPositionTitles(state, action) {
      state.filters.selectedPositionTitles = [...action.payload]
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsLevel1(state, action) {
      state.filters.selectedLevel1 = [...action.payload]
      // сбрасываем дочерние уровни
      state.filters.selectedLevel2 = []
      state.filters.selectedLevel3 = []
      state.filters.selectedLevel4 = []
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsLevel2(state, action) {
      state.filters.selectedLevel2 = [...action.payload]
      state.filters.selectedLevel3 = []
      state.filters.selectedLevel4 = []
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsLevel3(state, action) {
      state.filters.selectedLevel3 = [...action.payload]
      state.filters.selectedLevel4 = []
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsLevel4(state, action) {
      state.filters.selectedLevel4 = [...action.payload]
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsHasBonus(state, action) {
      state.filters.selectedHasBonus = [...action.payload]
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsLevelFromCeo(state, action) {
      state.filters.selectedLevelFromCeo = [...action.payload]
      employeesSlice.caseReducers._recomputeFilters(state)
    },
    setOptionsScoreCalibrated(state, action) {
      state.filters.selectedScoreCalibrated = [...action.payload]
      employeesSlice.caseReducers._recomputeFilters(state)
    },

    // 4) Сброс всех фильтров
    resetAllFilters(state) {
      state.filters.selectedEmployeeName = []
      state.filters.selectedPositionTitles = []
      state.filters.selectedLevel1 = []
      state.filters.selectedLevel2 = []
      state.filters.selectedLevel3 = []
      state.filters.selectedLevel4 = []
      state.filters.selectedHasBonus = []
      state.filters.selectedLevelFromCeo = []
      state.filters.selectedScoreCalibrated = []
      employeesSlice.caseReducers._recomputeFilters(state)
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

export const {
  setEmployees,
  setOptionsEmployeeName,
  setOptionsPositionTitles,
  setOptionsLevel1,
  setOptionsLevel2,
  setOptionsLevel3,
  setOptionsLevel4,
  setOptionsHasBonus,
  setOptionsLevelFromCeo,
  setOptionsScoreCalibrated,
  resetAllFilters,
  editEmployee,
} = employeesSlice.actions

export default employeesSlice.reducer

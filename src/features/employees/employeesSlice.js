import { createSlice } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'

const initialState = {
  employees: [], // полный список сотрудников
  filteredEmployees: [], // итог после применения всех фильтров

  // Опции для каждого уровня
  optionsEmployeeName: [],
  optionsPositionTitles: [], // из сотрудников, отфильтрованных по Level1–Level4
  optionsLevel1: [], // из сотрудников, отфильтрованных по PositionTitle
  optionsLevel2: [], // из сотрудников, отфильтрованных по PositionTitle+Level1
  optionsLevel3: [], // из сотрудников, отфильтрованных по PositionTitle+Level1+Level2
  optionsLevel4: [], // из сотрудников, отфильтрованных по PositionTitle+Level1+Level2+Level3

  filters: {
    selectedEmployeeName: [],
    selectedPositionTitles: [], // выбранные должности
    selectedLevel1: [], // выбранные Level1
    selectedLevel2: [], // выбранные Level2
    selectedLevel3: [], // выбранные Level3
    selectedLevel4: [], // выбранные Level4
  },
}

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    // 1) Загрузка полного списка сотрудников
    setEmployees(state, action) {
      state.employees = action.payload
      state.filteredEmployees = [...action.payload]

      // При инициализации выводим все варианты:
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
    },

    // 2) Приватная функция: пересчитать filteredEmployees и ВСЕ опции
    _recomputeFilters(state) {
      // 2.1. Начинаем с полного списка
      let base = [...state.employees]

      // 2.2. Если выбраны PositionTitles, сразу отфильтруем их, иначе base остаётся весь
      const positionSelectedValue = state.filters.selectedPositionTitles
      let basePos = base
      if (positionSelectedValue.length > 0) {
        basePos = base.filter((e) =>
          positionSelectedValue.includes(e.positionTitle)
        )
      }

      // 2.2.1 Если выбраны EmployeeName, сразу отфильтруем их, иначе base остаётся весь
      const employeeNameSelectedValue = state.filters.selectedEmployeeName
      if (employeeNameSelectedValue.length > 0) {
        basePos = basePos.filter((e) =>
          employeeNameSelectedValue.includes(e.employeeName)
        )
      }

      // 2.3. На основе basePos строим optionsLevel1
      state.optionsLevel1 = [...new Set(basePos.map((e) => e.level1))].map(
        (val) => ({ label: val, value: val })
      )

      // 2.4. Фильтруем basePos по Level1
      const lvl1Sel = state.filters.selectedLevel1
      let baseLvl1 = basePos
      if (lvl1Sel.length > 0) {
        baseLvl1 = basePos.filter((e) => lvl1Sel.includes(e.level1))
      }

      // 2.5. На основе baseLvl1 строим optionsLevel2
      state.optionsLevel2 = [...new Set(baseLvl1.map((e) => e.level2))].map(
        (val) => ({ label: val, value: val })
      )

      // 2.6. Фильтруем baseLvl1 по Level2
      const lvl2Sel = state.filters.selectedLevel2
      let baseLvl2 = baseLvl1
      if (lvl2Sel.length > 0) {
        baseLvl2 = baseLvl1.filter((e) => lvl2Sel.includes(e.level2))
      }

      // 2.7. На основе baseLvl2 строим optionsLevel3
      state.optionsLevel3 = [...new Set(baseLvl2.map((e) => e.level3))].map(
        (val) => ({ label: val, value: val })
      )

      // 2.8. Фильтруем baseLvl2 по Level3
      const lvl3Sel = state.filters.selectedLevel3
      let baseLvl3 = baseLvl2
      if (lvl3Sel.length > 0) {
        baseLvl3 = baseLvl2.filter((e) => lvl3Sel.includes(e.level3))
      }

      // 2.9. На основе baseLvl3 строим optionsLevel4
      state.optionsLevel4 = [...new Set(baseLvl3.map((e) => e.level4))].map(
        (val) => ({ label: val, value: val })
      )

      // 2.10. Фильтруем baseLvl3 по Level4
      const lvl4Sel = state.filters.selectedLevel4
      let baseLvl4 = baseLvl3
      if (lvl4Sel.length > 0) {
        baseLvl4 = baseLvl3.filter((e) => lvl4Sel.includes(e.level4))
      }

      // 3) Теперь построим optionsPositionTitles на основе baseLvl4 (с учётом Level1–4)
      state.optionsPositionTitles = [
        ...new Set(baseLvl4.map((e) => e.positionTitle)),
      ].map((val) => ({ label: val, value: val }))

      // 3.1) Теперь построим optionsEmployeeName на основе baseLvl4 (с учётом Level1–4)
      state.optionsEmployeeName = [
        ...new Set(baseLvl4.map((e) => e.employeeName)),
      ].map((val) => ({ label: val, value: val }))

      //
      if (positionSelectedValue.length > 0 || employeeNameSelectedValue > 0) {
        // positionSelectedValue применили на этапе basePos → baseLvl4 уже учитывает и позиции, и уровни
        state.filteredEmployees = baseLvl4 // включая только те с выбранными должностями
      } else {
        // если позиции не выбраны, то filteredEmployees = baseLvl4 (фильтры по уровням)
        state.filteredEmployees = baseLvl4
      }
    },

    // 5) Действие: сменили выбор EmployeeName
    setOptionsEmployeeName(state, action) {
      state.filters.selectedEmployeeName = [...action.payload]
      // При смене должности мы НЕ сбрасываем выбор по уровням.
      employeesSlice.caseReducers._recomputeFilters(state)
    },

    // 5) Действие: сменили выбор PositionTitles
    setOptionsPositionTitles(state, action) {
      state.filters.selectedPositionTitles = [...action.payload]
      // При смене должности мы НЕ сбрасываем выбор по уровням.
      employeesSlice.caseReducers._recomputeFilters(state)
    },

    // 6) Действие: сменили Level1
    setOptionsLevel1(state, action) {
      state.filters.selectedLevel1 = [...action.payload]
      // Сбрасываем дочерние уровни (Level2–Level4)
      state.filters.selectedLevel2 = []
      state.filters.selectedLevel3 = []
      state.filters.selectedLevel4 = []
      employeesSlice.caseReducers._recomputeFilters(state)
    },

    // 7) Смена Level2
    setOptionsLevel2(state, action) {
      state.filters.selectedLevel2 = [...action.payload]
      // Сбрасываем дочерние уровни (Level3–Level4)
      state.filters.selectedLevel3 = []
      state.filters.selectedLevel4 = []
      employeesSlice.caseReducers._recomputeFilters(state)
    },

    // 8) Смена Level3
    setOptionsLevel3(state, action) {
      state.filters.selectedLevel3 = [...action.payload]
      // Сбрасываем дочерний уровень (Level4)
      state.filters.selectedLevel4 = []
      employeesSlice.caseReducers._recomputeFilters(state)
    },

    // 9) Смена Level4
    setOptionsLevel4(state, action) {
      state.filters.selectedLevel4 = [...action.payload]
      employeesSlice.caseReducers._recomputeFilters(state)
    },

    // 10) Сброс всех фильтров
    resetAllFilters(state) {
      state.filters.selectedPositionTitles = []
      state.filters.selectedLevel1 = []
      state.filters.selectedLevel2 = []
      state.filters.selectedLevel3 = []
      state.filters.selectedLevel4 = []
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
  resetAllFilters,
  editEmployee,
} = employeesSlice.actions

export default employeesSlice.reducer

import { useSelector, useDispatch } from 'react-redux'
import { MultiSelect } from '../components'
import {
  setOptionsLevel2,
  setOptionsLevel3,
  setOptionsLevel4,
  setOptionsPositionTitles,
  setOptionsEmployeeName,
  setOptionsHasBonus,
  setOptionsLevelFromCeo,
  setOptionsScoreCalibrated,
} from '../features/employees/employeesSlice'

const FilteringOptions = () => {
  const dispatch = useDispatch()

  // level 2
  const optionsForLevel2 = useSelector(
    (state) => state.employeesState.optionsLevel2
  )
  const selectedLevel2FromStore = useSelector(
    (state) => state.employeesState.filters.selectedLevel2
  )

  // level 3
  const optionsForLevel3 = useSelector((s) => s.employeesState.optionsLevel3)
  const selectedLevel3FromStore = useSelector(
    (s) => s.employeesState.filters.selectedLevel3
  )

  // level 4
  const optionsForLevel4 = useSelector((s) => s.employeesState.optionsLevel4)
  const selectedLevel4FromStore = useSelector(
    (s) => s.employeesState.filters.selectedLevel4
  )

  // position titles
  const optionsForPositionTitles = useSelector(
    (s) => s.employeesState.optionsPositionTitles
  )
  const selectedPositionTitlesFromStore = useSelector(
    (s) => s.employeesState.filters.selectedPositionTitles
  )

  // employee names
  const optionsForEmployeeName = useSelector(
    (s) => s.employeesState.optionsEmployeeName
  )
  const selectedEmployeeNameFromStore = useSelector(
    (s) => s.employeesState.filters.selectedEmployeeName
  )

  // has bonus
  const optionsForHasBonus = useSelector(
    (s) => s.employeesState.optionsHasBonus
  )
  const selectedHasBonusFromStore = useSelector(
    (s) => s.employeesState.filters.selectedHasBonus
  )

  // level from ceo
  const optionsForLevelFromCeo = useSelector(
    (s) => s.employeesState.optionsLevelFromCeo
  )
  const selectedLevelFromCeoFromStore = useSelector(
    (s) => s.employeesState.filters.selectedLevelFromCeo
  )

  // calibrated score
  const optionsForScoreCalibrated = useSelector(
    (s) => s.employeesState.optionsScoreCalibrated
  )
  const selectedScoreCalibratedFromStore = useSelector(
    (s) => s.employeesState.filters.selectedScoreCalibrated
  )

  return (
    <div className='grid grid-cols-3 gap-2 mb-4'>
      <MultiSelect
        options={optionsForLevel2}
        selected={selectedLevel2FromStore}
        setSelected={(optionsForLevel2) =>
          dispatch(setOptionsLevel2([...optionsForLevel2]))
        }
        label='Level 2'
      />
      <MultiSelect
        options={optionsForLevel3}
        selected={selectedLevel3FromStore}
        setSelected={(optionsForLevel3) =>
          dispatch(setOptionsLevel3([...optionsForLevel3]))
        }
        label='Level 3'
      />
      <MultiSelect
        options={optionsForLevel4}
        selected={selectedLevel4FromStore}
        setSelected={(optionsForLevel4) =>
          dispatch(setOptionsLevel4([...optionsForLevel4]))
        }
        label='Level 4'
      />
      <MultiSelect
        options={optionsForPositionTitles}
        selected={selectedPositionTitlesFromStore}
        setSelected={(optionsForPositionTitles) =>
          dispatch(setOptionsPositionTitles([...optionsForPositionTitles]))
        }
        label='Должность'
      />
      <MultiSelect
        options={optionsForEmployeeName}
        selected={selectedEmployeeNameFromStore}
        setSelected={(optionsForEmployeeName) =>
          dispatch(setOptionsEmployeeName([...optionsForEmployeeName]))
        }
        label='ФИО Сотрудника'
      />
      <MultiSelect
        options={optionsForHasBonus}
        selected={selectedHasBonusFromStore}
        setSelected={(optionsForHasBonus) =>
          dispatch(setOptionsHasBonus([...optionsForHasBonus]))
        }
        label='Has Bonus'
      />
      <MultiSelect
        options={optionsForLevelFromCeo}
        selected={selectedLevelFromCeoFromStore}
        setSelected={(optionsForLevelFromCeo) =>
          dispatch(setOptionsLevelFromCeo([...optionsForLevelFromCeo]))
        }
        label='Уровень от CEO'
      />
      <MultiSelect
        options={optionsForScoreCalibrated}
        selected={selectedScoreCalibratedFromStore}
        setSelected={(optionsForScoreCalibrated) =>
          dispatch(setOptionsScoreCalibrated([...optionsForScoreCalibrated]))
        }
        label='Оценка после калибровки'
      />

      {/* bonus - no bonus
        Сотрудник
        N-
        Oценка после калибровки */}
    </div>
  )
}

export default FilteringOptions

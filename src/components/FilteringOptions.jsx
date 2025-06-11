import { useSelector, useDispatch } from 'react-redux'
import { MultiSelect } from '../components'
import { resetFilters, setFilter } from '../features/employees/employeesSlice'

import { TbFilterX } from 'react-icons/tb'

const FilteringOptions = ({ colsNumber }) => {
  const dispatch = useDispatch()

  // level 2
  const optionsForLevel2 = useSelector(
    (state) => state.employeesState.optionsLevel2
  )
  const selectedLevel2FromStore = useSelector(
    (state) => state.employeesState.filters.selectedLevel2 || []
  )

  // level 3
  const optionsForLevel3 = useSelector((s) => s.employeesState.optionsLevel3)
  const selectedLevel3FromStore = useSelector(
    (s) => s.employeesState.filters.selectedLevel3 || []
  )

  // level 4
  const optionsForLevel4 = useSelector((s) => s.employeesState.optionsLevel4)
  const selectedLevel4FromStore = useSelector(
    (s) => s.employeesState.filters.selectedLevel4 || []
  )

  // position titles
  const optionsForPositionTitle = useSelector(
    (s) => s.employeesState.optionsPositionTitle
  )
  const selectedPositionTitleFromStore = useSelector(
    (s) => s.employeesState.filters.selectedPositionTitle || []
  )

  // employee names
  const optionsForEmployeeName = useSelector(
    (s) => s.employeesState.optionsEmployeeName
  )
  const selectedEmployeeNameFromStore = useSelector(
    (s) => s.employeesState.filters.selectedEmployeeName || []
  )

  // has bonus
  const optionsForHasBonus = useSelector(
    (s) => s.employeesState.optionsHasBonus
  )
  const selectedHasBonusFromStore = useSelector(
    (s) => s.employeesState.filters.selectedHasBonus || []
  )

  // level from ceo
  const optionsForLevelFromCeo = useSelector(
    (s) => s.employeesState.optionsLevelFromCeo
  )
  const selectedLevelFromCeoFromStore = useSelector(
    (s) => s.employeesState.filters.selectedLevelFromCeo || []
  )

  // calibrated score
  const optionsForCalibration = useSelector(
    (s) => s.employeesState.optionsCalibration
  )
  const selectedCalibrationFromStore = useSelector(
    (s) => s.employeesState.filters.selectedCalibration || []
  )

  // reset filters
  const resetFiltersHandler = () => {
    dispatch(resetFilters())
  }

  return (
    <div className={`grid ${colsNumber} gap-2 mb-4`}>
      <MultiSelect
        options={optionsForLevel2}
        selected={selectedLevel2FromStore}
        setSelected={(optionsForLevel2) =>
          dispatch(
            setFilter({
              field: 'selectedLevel2',
              values: [...optionsForLevel2],
            })
          )
        }
        label='Level 2'
      />
      <MultiSelect
        options={optionsForLevel3}
        selected={selectedLevel3FromStore}
        setSelected={(optionsForLevel3) =>
          dispatch(
            setFilter({
              field: 'selectedLevel3',
              values: [...optionsForLevel3],
            })
          )
        }
        label='Level 3'
      />
      <MultiSelect
        options={optionsForLevel4}
        selected={selectedLevel4FromStore}
        setSelected={(optionsForLevel4) =>
          dispatch(
            setFilter({
              field: 'selectedLevel4',
              values: [...optionsForLevel4],
            })
          )
        }
        label='Level 4'
      />
      <MultiSelect
        options={optionsForHasBonus}
        selected={selectedHasBonusFromStore}
        setSelected={(optionsForHasBonus) =>
          dispatch(
            setFilter({
              field: 'selectedHasBonus',
              values: [...optionsForHasBonus],
            })
          )
        }
        label='Has Bonus'
      />
      <MultiSelect
        options={optionsForPositionTitle}
        selected={selectedPositionTitleFromStore}
        setSelected={(optionsForPositionTitle) =>
          dispatch(
            setFilter({
              field: 'selectedPositionTitle',
              values: [...optionsForPositionTitle],
            })
          )
        }
        label='Должность'
      />
      <MultiSelect
        options={optionsForEmployeeName}
        selected={selectedEmployeeNameFromStore}
        setSelected={(optionsForEmployeeName) =>
          dispatch(
            setFilter({
              field: 'selectedEmployeeName',
              values: [...optionsForEmployeeName],
            })
          )
        }
        label='ФИО Сотрудника'
      />
      <MultiSelect
        options={optionsForLevelFromCeo}
        selected={selectedLevelFromCeoFromStore}
        setSelected={(optionsForLevelFromCeo) =>
          dispatch(
            setFilter({
              field: 'selectedLevelFromCeo',
              values: [...optionsForLevelFromCeo],
            })
          )
        }
        label='Уровень от CEO'
      />
      <MultiSelect
        options={optionsForCalibration}
        selected={selectedCalibrationFromStore}
        setSelected={(optionsForCalibration) =>
          dispatch(
            setFilter({
              field: 'selectedCalibration',
              values: [...optionsForCalibration],
            })
          )
        }
        label='Оценка после калибровки'
      />
      <button
        className='btn btn-outline btn-secondary mt-9 flex flex-row'
        onClick={resetFiltersHandler}
      >
        <TbFilterX className='font-bold text-lg' />
        <span>Сбросить все фильтры</span>
      </button>
    </div>
  )
}

export default FilteringOptions

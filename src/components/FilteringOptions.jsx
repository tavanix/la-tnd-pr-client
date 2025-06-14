import { useSelector, useDispatch } from 'react-redux'
import { MultiSelect } from '../components'
import { resetFilters, setFilter } from '../features/employees/employeesSlice'
import { TbFilterX } from 'react-icons/tb'

const FilteringOptions = ({ colsNumber, filterId }) => {
  const dispatch = useDispatch()

  const employees = useSelector((state) => state.employeesState.employees)
  const filters = useSelector((state) => state.employeesState.filters[filterId])

  const getFilteredEmployeesExcluding = (excludeKey) => {
    return employees.filter((employee) =>
      Object.entries(filters).every(([key, selected]) => {
        if (key === excludeKey || !selected?.length) return true
        const field =
          key
            .replace(/^selected/, '')
            .charAt(0)
            .toLowerCase() + key.replace(/^selected/, '').slice(1)
        return selected.includes(employee[field])
      })
    )
  }

  const getOptions = (fieldKey) => {
    const filtered = getFilteredEmployeesExcluding(
      `selected${capitalize(fieldKey)}`
    )
    return [...new Set(filtered.map((e) => e[fieldKey]))].map((value) => ({
      label: value,
      value,
    }))
  }

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1)

  const resetFiltersHandler = () => {
    dispatch(resetFilters({ filterId }))
  }

  const selected = (key) => filters?.[key] || []

  return (
    <div className={`grid ${colsNumber} gap-2 mb-4`}>
      <MultiSelect
        options={getOptions('level2')}
        selected={selected('selectedLevel2')}
        setSelected={(optionsForLevel2) =>
          dispatch(
            setFilter({
              filterId,
              field: 'selectedLevel2',
              values: [...optionsForLevel2],
            })
          )
        }
        label='Level 2'
      />
      <MultiSelect
        options={getOptions('level3')}
        selected={selected('selectedLevel3')}
        setSelected={(optionsForLevel3) =>
          dispatch(
            setFilter({
              filterId,
              field: 'selectedLevel3',
              values: [...optionsForLevel3],
            })
          )
        }
        label='Level 3'
      />
      <MultiSelect
        options={getOptions('level4')}
        selected={selected('selectedLevel4')}
        setSelected={(optionsForLevel4) =>
          dispatch(
            setFilter({
              filterId,
              field: 'selectedLevel4',
              values: [...optionsForLevel4],
            })
          )
        }
        label='Level 4'
      />
      <MultiSelect
        options={getOptions('hasBonus')}
        selected={selected('selectedHasBonus')}
        setSelected={(optionsForHasBonus) =>
          dispatch(
            setFilter({
              filterId,
              field: 'selectedHasBonus',
              values: [...optionsForHasBonus],
            })
          )
        }
        label='Has Bonus'
      />
      <MultiSelect
        options={getOptions('positionTitle')}
        selected={selected('selectedPositionTitle')}
        setSelected={(optionsForPositionTitle) =>
          dispatch(
            setFilter({
              filterId,
              field: 'selectedPositionTitle',
              values: [...optionsForPositionTitle],
            })
          )
        }
        label='Должность'
      />
      <MultiSelect
        options={getOptions('employeeName')}
        selected={selected('selectedEmployeeName')}
        setSelected={(optionsForEmployeeName) =>
          dispatch(
            setFilter({
              filterId,
              field: 'selectedEmployeeName',
              values: [...optionsForEmployeeName],
            })
          )
        }
        label='ФИО Сотрудника'
      />
      <MultiSelect
        options={getOptions('levelFromCeo')}
        selected={selected('selectedLevelFromCeo')}
        setSelected={(optionsForLevelFromCeo) =>
          dispatch(
            setFilter({
              filterId,
              field: 'selectedLevelFromCeo',
              values: [...optionsForLevelFromCeo],
            })
          )
        }
        label='Уровень от CEO'
      />
      <MultiSelect
        options={getOptions('calibration')}
        selected={selected('selectedCalibration')}
        setSelected={(optionsForCalibration) =>
          dispatch(
            setFilter({
              filterId,
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

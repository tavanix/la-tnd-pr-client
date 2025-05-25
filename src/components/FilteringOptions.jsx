import { useSelector, useDispatch } from 'react-redux'
import { MultiSelect } from '../components'
import { setOptionsLevel2 } from '../features/employees/employeesSlice'

const FilteringOptions = () => {
  const dispatch = useDispatch()

  // level 2
  const optionsForLevel2 = useSelector((s) => s.employeesState.optionsLevel2)
  const selectedLevel2FromStore = useSelector(
    (s) => s.employeesState.filters.selectedLevel2
  )

  return (
    <div className='grid grid-cols-4 gap-2 mb-4'>
      <MultiSelect
        options={optionsForLevel2}
        selected={selectedLevel2FromStore}
        setSelected={(optionsForLevel2) =>
          dispatch(setOptionsLevel2(optionsForLevel2))
        }
        label='Выберите Level 2'
      />
    </div>
  )
}

export default FilteringOptions

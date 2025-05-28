import { useSelector, useDispatch } from 'react-redux'
import { MultiSelect } from '../components'
import {
  setOptionsLevel2,
  setOptionsLevel3,
  setOptionsLevel4,
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

  return (
    <div className='grid grid-cols-4 gap-2 mb-4'>
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
    </div>
  )
}

export default FilteringOptions

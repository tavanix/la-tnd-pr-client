import { useSelector, useDispatch } from 'react-redux'
import { MultiSelect } from '../components'

const FilteringOptions = () => {
  const dispatch = useDispatch()

  const optionsLevel1 = useSelector(
    (state) => state.employeesState.optionsLevel1
  )

  const selectedLevel1FromStore = useSelector(
    (state) => state.employeesState.filters.selectedLevel1
  )

  const setOptionsLevel1 = (options) => {
    dispatch({
      type: 'employees/setOptionsLevel1',
      payload: options,
    })
  }

  return (
    <div className='flex flex-col gap-2 w-full mb-6'>
      <div className='grid grid-cols-4 gap-2'>
        <MultiSelect
          options={optionsLevel1}
          selected={selectedLevel1FromStore}
          setSelected={setOptionsLevel1}
          label='Выберите Level 1'
        />
      </div>
    </div>
  )
}

export default FilteringOptions

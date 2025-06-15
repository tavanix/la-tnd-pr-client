import { useSelector } from 'react-redux'
import { redirect } from 'react-router-dom'

import {
  FilteringOptions,
  SectionTitle,
  ChartBarSimple,
  ChartTableComparison,
} from '../components'

export const loader = (store, queryClient) => async (request) => {
  // ROLES CHECK
  const user = store.getState().userState.user
  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  return { user }
}

const Dashboard = () => {
  const data1 = useSelector((state) => state.employeesState.filteredEmployees1)
  const data2 = useSelector((state) => state.employeesState.filteredEmployees2)

  function compareRates(data1, data2) {
    const allRates = ['Топ', 'Отлично', 'Хорошо', 'Можешь лучше', 'Плохо']

    const countRates = (data) => {
      const counter = {}
      for (const rate of allRates) {
        counter[rate] = 0
      }
      data.forEach((item) => {
        const rate = item.calibration
        if (allRates.includes(rate)) {
          counter[rate] += 1
        }
      })
      return counter
    }

    const count1 = countRates(data1)
    const count2 = countRates(data2)

    return allRates.map((rate) => ({
      rate,
      'Фильтр 1': count1[rate],
      'Фильтр 2': count2[rate],
    }))
  }

  const data = compareRates(data1, data2)

  return (
    <div className='w-[1280px]'>
      <SectionTitle text='Дешборд' />

      <div className='grid grid-cols-[265px_1fr_265px] gap-2 h-full'>
        <div className='p-2  rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Фильтр 1</h2>
          <FilteringOptions colsNumber='grid-cols-1' filterId='filters1' />
        </div>
        <div className='p-2 bg-gray-50 rounded-[16px] flex flex-col gap-4 shadow-lg'>
          {/* table */}
          <div className='p-2 pt-6  rounded-[16px]  shadow-lg'>
            <ChartTableComparison data={data} />
          </div>
          {/* barchart */}
          <div className=''>
            <ChartBarSimple
              title=''
              data={data}
              arg1='Фильтр 1'
              arg2='Фильтр 2'
              color1='#b9b9ba'
              color2='#47b872'
            />
          </div>
        </div>
        <div className='p-2 rounded-[16px] shadow-lg'>
          <h2 className='font-bold'>Фильтр 2: для сравнения</h2>
          <FilteringOptions colsNumber='grid-cols-1' filterId='filters2' />
        </div>
        {/* buffer */}
        <div className='h-[200px] m-4'></div>
      </div>
    </div>
  )
}

export default Dashboard

import { useSelector } from 'react-redux'

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  YAxis,
} from 'recharts'

const ChartBarSimple = ({ title, data }) => {
  const employees = useSelector((state) => state.employeesState.employees)

  const translitData = data.map((item) => {
    return {
      rate: item.rate,
      до: item.beforeHc,
      после: item.afterHc,
    }
  })

  return (
    <div className='rounded-[16px] h-[300px] w-full p-2 flex flex-col items-center border shadow-lg'>
      <h1 className='font-bold text-xl mb-4'>{title}</h1>
      <ResponsiveContainer width='100%' height='85%'>
        <BarChart data={translitData}>
          <XAxis dataKey='rate' tick={{ strokeWidth: 2 }} />
          <YAxis domain={[0, employees.length + 200]} width={0} />
          <Tooltip />
          <Legend />
          <Bar dataKey='до' fill='#b9b9ba'>
            <LabelList dataKey='до' position='top' />
          </Bar>
          <Bar dataKey='после' fill='#47b872'>
            <LabelList dataKey='после' position='top' />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartBarSimple

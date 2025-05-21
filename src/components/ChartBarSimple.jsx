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
  const employeesShort = useSelector(
    (state) => state.employeesState.filteredEmployees
  )

  console.log(employees.length)

  const translitData = data.map((item) => {
    return {
      rate: item.rate,
      до: item.beforeHc,
      после: item.afterHc,
    }
  })

  return (
    <div className='rounded-[16px] h-[300px] w-full flex flex-col items-start border shadow-lg p-4 mb-4'>
      <h1 className='font-bold text-xl mb-4'>{title}</h1>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={translitData}
          margin={{
            top: 20,
          }}
        >
          <XAxis dataKey='rate' tick={{ strokeWidth: 2 }} />
          {/* <YAxis domain={[0, employees.length]} width={0} /> */}
          <YAxis width={0} />
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

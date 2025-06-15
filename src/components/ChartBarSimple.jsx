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

const ChartBarSimple = ({ title, data, arg1, arg2, color1, color2 }) => {
  return (
    <div className='rounded-[16px] h-[300px] w-full flex flex-col items-start border shadow-lg p-4 mb-4'>
      <h1 className='font-bold text-xl mb-4'>{title}</h1>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          data={data}
          margin={{
            top: 20,
          }}
        >
          <XAxis dataKey='rate' tick={{ strokeWidth: 2 }} />
          <YAxis width={0} />
          <Tooltip />
          <Legend />
          <Bar dataKey={arg1} fill={color1}>
            <LabelList dataKey={arg1} position='top' />
          </Bar>
          <Bar dataKey={arg2} fill={color2}>
            <LabelList dataKey={arg2} position='top' />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartBarSimple

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
  console.log(data)

  return (
    <div className='rounded-[7px] h-[300px] w-full p-2 flex flex-col items-center border shadow-lg'>
      <h1 className='font-bold text-xl mb-4'>{title}</h1>
      <ResponsiveContainer width='100%' height='85%'>
        <BarChart data={data}>
          <XAxis dataKey='rate' tick={{ strokeWidth: 2 }} />
          <YAxis domain={[0, 2000]} width={0} />
          <Tooltip />
          <Legend />
          <Bar dataKey='beforeHc' fill='#858586'>
            <LabelList dataKey='beforeHc' position='top' />
          </Bar>
          <Bar dataKey='afterHc' fill='#82ca9d'>
            <LabelList dataKey='afterHc' position='top' />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartBarSimple

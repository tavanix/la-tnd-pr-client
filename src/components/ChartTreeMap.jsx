import { ResponsiveContainer, Treemap, Tooltip } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className='custom-tooltip bg-white w-full h-8 p-2 flex items-center justify-center rounded-xl'>
        <p>
          {payload[0].payload.name}: {payload[0].value}
        </p>
      </div>
    )
  }

  return null
}

function ChartTreeMap({ title, data }) {
  return (
    <div className='bg-white rounded-[7px] h-[480px] w-1/2 flex flex-col items-center border rounded shadow-lg'>
      <h1 className='font-bold text-xl m-2'>{title}</h1>

      <ResponsiveContainer width='95%' height='90%'>
        <Treemap
          width={480}
          height={400}
          data={data}
          dataKey='value'
          fill={(entry) => entry.payload.color}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>{' '}
      </ResponsiveContainer>
    </div>
  )
}

export default ChartTreeMap

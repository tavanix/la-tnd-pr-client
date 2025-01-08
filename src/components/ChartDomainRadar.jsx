import React from 'react'
import {
  Radar,
  RadarChart,
  PolarGrid,
  Legend,
  PolarAngleAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const ChartDomainRadar = ({ title, planLegend, actualLegend, data }) => {
  return (
    <div className='bg-white rounded-[7px] h-[420px] w-1/2 p-2 flex flex-col items-center border rounded shadow-lg'>
      <h1 className='font-bold text-xl'>{title}</h1>
      <ResponsiveContainer width='95%' height='95%'>
        <RadarChart cx='50%' cy='50%' outerRadius='75%' data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey='rate' />
          <Radar
            name={planLegend}
            dataKey='target'
            stroke='#8884d8'
            fill='#8884d8'
            fillOpacity={0.5}
          />
          <Radar
            name={actualLegend}
            dataKey='actual'
            stroke='#82ca9d'
            fill='#82ca9d'
            fillOpacity={0.4}
          />
          <Tooltip cursor={{ stroke: 'gray', strokeWidth: 2 }} />
          <Legend />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ChartDomainRadar

import React from 'react'

const targetDistribution = {
  Топ: 1,
  Отлично: 15,
  Хорошо: 75,
  'Можешь лучше / Плохо': 9,
}

const allRates = ['Топ', 'Отлично', 'Хорошо', 'Можешь лучше / Плохо']

const ComparisonTable = ({ data }) => {
  const row = (label, getValue) => (
    <tr>
      <td className='font-semibold pr-4'>{label}</td>
      {allRates.map((rate) => (
        <td key={rate} className='text-center px-2'>
          {getValue(rate)}
        </td>
      ))}
    </tr>
  )

  const dataMap = {}
  data.forEach((entry) => {
    dataMap[entry.rate] = entry
  })

  // Объединение "Можешь лучше" + "Плохо"
  dataMap['Можешь лучше / Плохо'] = {
    rate: 'Можешь лучше / Плохо',
    'Фильтр 1':
      (dataMap['Можешь лучше']?.['Фильтр 1'] ?? 0) +
      (dataMap['Плохо']?.['Фильтр 1'] ?? 0),
    'Фильтр 2':
      (dataMap['Можешь лучше']?.['Фильтр 2'] ?? 0) +
      (dataMap['Плохо']?.['Фильтр 2'] ?? 0),
  }

  const sumValues = (key) =>
    allRates.reduce((sum, rate) => sum + (dataMap[rate]?.[key] ?? 0), 0)

  const filter1Total = sumValues('Фильтр 1')
  const filter2Total = sumValues('Фильтр 2')

  const asPercent = (value, total) =>
    total === 0 ? '0%' : `${Math.round((value / total) * 100)}%`

  return (
    <div className='overflow-x-auto'>
      <table className='table table-sm w-full border border-gray-300'>
        <thead>
          <tr>
            <th className='text-left'>Оценка</th>
            {allRates.map((rate) => (
              <th key={rate} className='text-center'>
                {rate}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {row(
            'Целевое распределение',
            (rate) => `${targetDistribution[rate]}%`
          )}
          {row('Фильтр 1', (rate) =>
            asPercent(dataMap[rate]?.['Фильтр 1'] ?? 0, filter1Total)
          )}
          {row('Фильтр 2', (rate) =>
            asPercent(dataMap[rate]?.['Фильтр 2'] ?? 0, filter2Total)
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ComparisonTable

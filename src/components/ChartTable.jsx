const ChartTable = ({ title, data }) => {
  return (
    <div className='bg-white rounded-[7px] h-[560px] w-full flex flex-col items-center border shadow-lg p-4'>
      <h1 className='font-bold text-xl mb-4'>{title}</h1>
      <table className='table table-lg w-full table-fixed'>
        <thead className='uppercase h-10 border-b-4'>
          <tr>
            <th
              rowSpan='2'
              className='text-center border'
              style={{ width: '120px' }}
            >
              Оценки
            </th>
            <th
              rowSpan='2'
              className='text-center border text-wrap p-0 border-r-2'
            >
              Целевое распределение оценок
            </th>
            <th
              colSpan='3'
              className='text-center border text-wrap border-r-2 border-b-2'
            >
              Распределение оценок и бонусного фонда до изменений оценок
            </th>
            <th colSpan='3' className='text-center border text-wrap border-b-2'>
              Распределение оценок и бонусного фонда после изменений оценок
            </th>
          </tr>
          <tr>
            <th className='text-center border text-wrap p-2 text-[12px] capitalize'>
              Численность
            </th>
            <th className='text-center border text-wrap p-2 text-[12px] capitalize'>
              %
            </th>
            <th className='text-center border text-wrap p-2 text-[12px] capitalize'>
              Бонусный фонд
            </th>
            <th className='text-center border text-wrap p-2 text-[12px] capitalize'>
              Численность
            </th>
            <th className='text-center border text-wrap p-2 text-[12px] capitalize'>
              %
            </th>
            <th className='text-center border text-wrap p-2 text-[12px] capitalize'>
              Бонусный фонд
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => {
            const changesHc = item.afterHc - item.beforeHc

            const changesPercent =
              item.afterPercent.slice(0, -1) - item.beforePercent.slice(0, -1)

            const changesFundPercent =
              item.afterFundPercent.slice(0, -1) -
              item.beforeFundPercent.slice(0, -1)

            return (
              <tr className='hover text-[14px]' key={item.rate}>
                <td className='border text-[14px]'>{item.rate}</td>
                <td className='text-center border text-[14px] border-r-2'>
                  {item.target}
                </td>
                <td className='text-center border text-[14px]'>
                  {item.beforeHc}
                </td>
                <td className='text-center border text-[14px]'>
                  {item.beforePercent}
                </td>
                <td className='text-center border text-[14px] border-r-2'>
                  {item.beforeFundPercent}
                </td>
                <td className='text-center border text-[14px]'>
                  {item.afterHc}
                  {changesHc === 0
                    ? ''
                    : changesHc > 0
                      ? ' (↑ +' + changesHc + ')'
                      : ' (↓ ' + changesHc + ')'}
                </td>
                <td className='text-center border text-[14px]'>
                  {item.afterPercent}
                  {changesPercent === 0
                    ? ''
                    : changesPercent > 0
                      ? ' (↑ +' + changesPercent.toFixed(1) + ')'
                      : ' (↓' + changesPercent.toFixed(1) + ')'}
                </td>
                <td className='text-center border text-[14px]'>
                  {item.afterFundPercent}{' '}
                  {changesFundPercent === 0
                    ? ''
                    : changesFundPercent > 0
                      ? ' (↑ +' + changesFundPercent.toFixed(1) + ')'
                      : ' (↓' + changesFundPercent.toFixed(1) + ')'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default ChartTable

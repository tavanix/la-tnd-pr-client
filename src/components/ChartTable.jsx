import React from 'react'

const ChartTable = ({ title }) => {
  return (
    <div className='bg-white rounded-[7px] h-[520px] w-full flex flex-col items-center border rounded shadow-lg p-4'>
      <h1 className='font-bold text-xl mb-4'>{title}</h1>
      <table className='table table-lg w-full table-fixed'>
        <thead className='uppercase h-10'>
          <tr>
            <th rowSpan='2' className='text-center border'>
              Оценки
            </th>
            <th rowSpan='2' className='text-center border text-wrap p-0'>
              Целевое распределение оценок
            </th>
            <th colSpan='3' className='text-center border text-wrap'>
              Распределение оценок и бонусного фонда до изменений оценок
            </th>
            <th colSpan='3' className='text-center border text-wrap'>
              Распределение оценок и бонусного фонда после изменений оценок
            </th>
          </tr>
          <tr>
            <th className='text-center border text-wrap p-2'>
              Распределение оценок НС
            </th>
            <th className='text-center border text-wrap p-2'>
              Распределение оценок %
            </th>
            <th className='text-center border text-wrap p-2'>
              Распределение бонусного фонда
            </th>
            <th className='text-center border text-wrap p-2'>
              Распределение оценок НС
            </th>
            <th className='text-center border text-wrap p-2'>
              Распределение оценок %
            </th>
            <th className='text-center border text-wrap p-2'>
              Распределение бонусного фонда
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className='hover'>
            <td className='border'>Топ</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>5</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>3</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>1%</td>
          </tr>
          <tr className='hover'>
            <td className='border'>Отлично</td>
            <td className='text-center border'>20%</td>
            <td className='text-center border'>5</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>3</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>1%</td>
          </tr>
          <tr className='hover'>
            <td className='border'>Хорошо</td>
            <td className='text-center border'>39%</td>
            <td className='text-center border'>5</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>3</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>1%</td>
          </tr>
          <tr className='hover'>
            <td className='border'>Можешь лучше</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>5</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>3</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>1%</td>
          </tr>
          <tr className='hover'>
            <td className='border'>Плохо</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>5</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>2%</td>
            <td className='text-center border'>3</td>
            <td className='text-center border'>1%</td>
            <td className='text-center border'>1%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ChartTable

import React from 'react'

const ChartBudget = ({ title }) => {
  return (
    <div className='bg-white rounded-[7px] h-[224px] w-full flex flex-col items-center border shadow-lg p-6'>
      <div className='h-screen w-full flex gap-6'>
        <div className='p-6 shadow rounded-2xl transform transition duration-500 hover:scale-105 w-1/3 flex items-center justify-center h-auto'>
          <dl className='space-y-2'>
            <dt className='text-sm font-medium text-gray-500 '>Бюджет</dt>
            <dd className='text-5xl font-light md:text-5xl '>124 000 000</dd>
            <dd className='flex items-center space-x-1 text-sm font-medium text-green-500 dark:text-green-400'>
              <span>итого</span>
            </dd>
          </dl>
        </div>
        <div className='p-6 shadow rounded-2xl transform transition duration-500 hover:scale-105 w-1/3 flex items-center justify-center'>
          <dl className='space-y-2'>
            <dt className='text-sm font-medium text-gray-500 '>
              Факт до изменения оценок
            </dt>
            <dd className='text-5xl font-light md:text-5xl '>124 000 000</dd>

            <dd className='flex items-center space-x-1 text-sm font-medium text-green-500 dark:text-green-400'>
              <span>7% экономия</span>

              <svg
                className='w-7 h-7'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeWidth='1.5'
                  d='M17.25 8.75V17.25H8.75'
                ></path>
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M17 17L6.75 6.75'
                ></path>
              </svg>
            </dd>
          </dl>
        </div>
        <div className='p-6 shadow rounded-2xl transform transition duration-500 hover:scale-105 w-1/3 flex items-center justify-center'>
          <dl className='space-y-2'>
            <dt className='text-sm font-medium text-gray-500 '>
              Факт после изменения оценок
            </dt>
            <dd className='text-5xl font-light md:text-5xl '>140 000 000</dd>
            <dd className='flex items-center space-x-1 text-sm font-medium text-red-500 dark:text-red-400'>
              <span>12% перерасход</span>
              <svg
                className='w-7 h-7'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M17.25 15.25V6.75H8.75'
                ></path>
                <path
                  stroke='currentColor'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='1.5'
                  d='M17 7L6.75 17.25'
                ></path>
              </svg>
            </dd>
          </dl>
        </div>
      </div>

      {/* transform transition duration-500 hover:scale-110 */}
    </div>
  )
}

export default ChartBudget

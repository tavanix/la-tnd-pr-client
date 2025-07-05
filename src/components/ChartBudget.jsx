import { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

const ChartBudget = ({
  budget,
  bonusBeforeCalibration,
  bonusAfterCalibration,
  // isVisible,
}) => {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className='rounded-[16px] h-[244px] w-full flex flex-col items-center mb-4'>
      <div className='h-screen w-full flex gap-6'>
        {/* Бюджет */}
        <div className='p-6 shadow-lg rounded-[16px] w-1/3 flex items-center justify-center h-auto '>
          <dl className='space-y-2'>
            <dt className='text-sm font-medium text-gray-500 '>Бюджет</dt>
            <dd
              className={
                isVisible
                  ? 'text-5xl font-light md:text-5xl'
                  : 'blur-lg  text-5xl font-light md:text-5xl'
              }
            >
              {budget.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            </dd>
            <dd className='flex items-center space-x-1 text-sm font-medium'>
              <span className={isVisible ? '' : 'blur-lg'}>итого доступно</span>
            </dd>
          </dl>
        </div>
        {/* до */}
        <div className='p-6 shadow-lg rounded-[16px] w-1/3 flex items-center justify-center'>
          <dl className='space-y-2'>
            <dt className='text-sm font-medium text-gray-500 '>
              Факт до изменения оценок
            </dt>

            {/* формат через пробелы */}
            <dd
              className={
                isVisible
                  ? 'text-5xl font-light md:text-5xl'
                  : 'blur-lg  text-5xl font-light md:text-5xl'
              }
            >
              {bonusBeforeCalibration
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            </dd>

            {/* отображение экономии или перерасхода */}
            {(bonusBeforeCalibration / budget).toFixed(4) - 1 > 0 ? (
              <dd className='flex items-center space-x-1 text-sm font-medium text-red-500 dark:text-red-400'>
                <span className={isVisible ? '' : 'blur-lg'}>
                  {((bonusBeforeCalibration / budget) * 100 - 100).toFixed(2)}%
                  перерасход к бюджету
                </span>
                <svg
                  className={isVisible ? 'w-5 h-5' : 'blur-lg w-5 h-5'}
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
            ) : (
              <dd className='flex items-center space-x-1 text-sm font-medium text-green-500 dark:text-green-400'>
                <span className={isVisible ? '' : 'blur-lg'}>
                  {((bonusBeforeCalibration / budget) * 100 - 100).toFixed(2)}%
                  экономия к бюджету
                </span>

                <svg
                  className={isVisible ? 'w-5 h-5' : 'blur-lg w-5 h-5'}
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
            )}
          </dl>
        </div>

        {/* после */}
        <div className='p-4 shadow-lg rounded-[16px] transform transition duration-500  w-1/3 flex items-center justify-center'>
          <dl className='space-y-2  mt-6'>
            <dt className='text-sm font-medium text-gray-500 '>
              Факт после изменения оценок
            </dt>

            {/* формат через пробелы */}
            <dd
              className={
                isVisible
                  ? 'text-5xl font-light md:text-5xl'
                  : 'blur-lg  text-5xl font-light md:text-5xl'
              }
            >
              {bonusAfterCalibration
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
            </dd>

            {/* отображение экономии или перерасхода */}
            {(bonusAfterCalibration / budget).toFixed(4) - 1 > 0 ? (
              <dd className='flex items-center space-x-1 text-sm font-medium text-red-500 dark:text-red-400'>
                <span className={isVisible ? '' : 'blur-lg'}>
                  {((bonusAfterCalibration / budget) * 100 - 100).toFixed(2)}%
                  перерасход к бюджету
                </span>
                <svg
                  className={isVisible ? 'w-5 h-5' : 'blur-lg w-5 h-5'}
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
            ) : (
              <dd className='flex items-center space-x-1 text-sm font-medium text-green-500 dark:text-green-400'>
                <span className={isVisible ? '' : 'blur-lg'}>
                  {((bonusAfterCalibration / budget) * 100 - 100).toFixed(2)}%
                  экономия к бюджету
                </span>

                <svg
                  className={isVisible ? 'w-5 h-5' : 'blur-lg w-5 h-5'}
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
            )}

            <dd
              className={
                isVisible
                  ? 'flex items-center space-x-1 text-sm font-medium text-gray-400'
                  : 'blur-lg flex items-center space-x-1 text-sm font-medium text-gray-400'
              }
            >
              {bonusAfterCalibration - bonusBeforeCalibration > 0 ? '+' : ''}
              {(bonusAfterCalibration - bonusBeforeCalibration)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' '}
              после калибровки
            </dd>
          </dl>

          <button
            className='absolute text-2xl top-4 right-4 text-gray-500 hover:text-red-500'
            onClick={() => setIsVisible(!isVisible)}
          >
            {isVisible ? <FaEye /> : <FaEyeSlash />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChartBudget

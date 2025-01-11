import { useRouteError, Link } from 'react-router-dom'
import img from '../assets/not-found.svg'

const Error = () => {
  const error = useRouteError()

  if (error.status === 404) {
    return (
      <main className='grid min-h-[100vh] place-items-center px-8'>
        <div className='text-center'>
          <div className=''>
            <img src={img} alt='personAndChart' />
          </div>

          <h1 className='mt-4 text-3xl font-bold tracking-tight sm:text-5xl'>
            страница не найдена
          </h1>
          <p className='mt-6 text-lg leading-7'>
            похоже, что такой страницы не существует
          </p>
          <div className='mt-10'>
            <Link to='/' className='btn btn-primary btn-outline'>
              Домой
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className='flex flex-col min-h-[100vh] place-items-center justify-center'>
      <h4 className='text-center font-bold text-4xl mb-4'>
        возникла непредвиденная ошибка...
      </h4>
      <p>пожалуйста, перезагрузите страницу</p>
    </main>
  )
}
export default Error

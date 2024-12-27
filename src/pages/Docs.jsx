import { SectionTitle } from '../components'

const Docs = () => {
  return (
    <>
      <SectionTitle text='Вспомогательные материалы' />

      <div className='mt-4 mb-4 flex flex-col hover:text-primary'>
        <a href='' target='_blank'>
          Запись встречи
        </a>
      </div>
      <div className='mt-4 mb-4 flex flex-col hover:text-primary'>
        <a href='' target='_blank'>
          Презентация
        </a>
      </div>
    </>
  )
}

export default Docs

import { Outlet, useNavigation } from 'react-router-dom'
import { Navbar, Loading } from '../components'
import { toast } from 'react-toastify'
import { redirect } from 'react-router-dom'

import { setEmployees } from '../features/employees/employeesSlice'
import { customFetch } from '../utils'
import authHeader from '../utils/authHeader'

export const loader = (store, queryClient) => async () => {
  const user = store.getState().userState.user

  if (!user) {
    toast.warn('Сперва залогиньтесь, пожалуйста!')
    return redirect('/login')
  }

  let rolesMatrix = [
    { role: 'ROLE_CIS_ALL', level1: 'Казахстан' },
    { role: 'ROLE_CIS_ALL', level1: 'Беларусь' },
    { role: 'ROLE_CIS_KZ', level1: 'Казахстан' },
    { role: 'ROLE_CIS_BY', level1: 'Беларусь' },
    {
      role: 'ROLE_AUDIT',
      level1:
        'Департамент по внутреннему контролю, аудиту и управлению рисками',
    },
    {
      role: 'ROLE_PURCHASING',
      level1: 'Дирекция закупок и ассортиментной стратегии',
    },
    { role: 'ROLE_IT', level1: 'Дирекция информационных технологий' },
    { role: 'ROLE_CORP_GOV', level1: 'Дирекция корпоративного управления' },
    { role: 'ROLE_MARKETPLACE', level1: 'Дирекция маркетплейс' },
    {
      role: 'ROLE_PRODUCT',
      level1: 'Дирекция по развитию продукта и управлению данными',
    },
    { role: 'ROLE_PRODUCT', level1: 'Дирекция развития продукта' },
    { role: 'ROLE_RETAIL', level1: 'Дирекция по розничному бизнесу' },
    {
      role: 'ROLE_STRATEGY',
      level1: 'Дирекция по стратегии и корпоративному развитию',
    },
    {
      role: 'ROLE_HR_ADMIN',
      level1:
        'Дирекция по управлению персоналом и административной деятельности',
    },
    { role: 'ROLE_FINANCE', level1: 'Дирекция финансов' },
    { role: 'ROLE_MARKETING', level1: 'Дирекция цифрового маркетинга' },
    { role: 'ROLE_LFC', level1: 'Распределительный центр' },
    {
      role: 'ROLE_LFC',
      level1:
        'Обособленное подразделение ООО "КУПИШУЗ" Распределительный центр "ЧЕХОВ"',
    },
    {
      role: 'ROLE_LFC',
      level1:
        'Обособленное подразделение ООО "КУПИШУЗ" Распределительный центр "Софьино"',
    },
    {
      role: 'ROLE_OPS_ALYPOVA',
      level1: 'Операционная дирекция',
      level2:
        'Департамент по операционной трансформации и региональной складской логистике',
    },
    {
      role: 'ROLE_OPS_ALYPOVA',
      level1: 'Операционная дирекция',
      level2: 'Департамент по планированию продаж и операций',
    },
    {
      role: 'ROLE_OPS_ALYPOVA',
      level1: 'Операционная дирекция',
      level2: 'Отдел транспортной логистики и управления автопарком',
    },
    {
      role: 'ROLE_OPS_MUSINA',
      level1: 'Операционная дирекция',
      level2: 'Департамент аналитики и планирования',
    },
    {
      role: 'ROLE_OPS_MUSINA',
      level1: 'Операционная дирекция',
      level2: 'Департамент доставки',
    },
    {
      role: 'ROLE_OPS_MUSINA',
      level1: 'Операционная дирекция',
      level2: 'Департамент региональной сети',
    },
    {
      role: 'ROLE_OPS_MUSINA',
      level1: 'Операционная дирекция',
      level2: 'Департамент управления и развития клиентской доставки',
    },
    {
      role: 'ROLE_OPS_MUSINA',
      level1: 'Операционная дирекция',
      level2: 'Отдел по операционной поддержке',
    },
    {
      role: 'ROLE_OPS_ADAMOVICH',
      level1: 'Операционная дирекция',
      level2: 'Департамент по операциям распределительных центров',
    },
    {
      role: 'ROLE_OPS_ADAMOVICH',
      level1: 'Операционная дирекция',
      level2: 'Департамент технологий и автоматизаций',
    },
  ]

  // FETCH DATA AND STORE
  try {
    const employees = await customFetch.get(`/employees`, {
      headers: authHeader(),
    })

    // user roles and access management
    let result = []
    if (user.roles.includes('ROLE_ADMIN') || user.roles.includes('ROLE_ALL')) {
      result = employees.data
    } else {
      result = rolesMatrix.reduce((acc, { role, level1, level2 }) => {
        if (user.roles.includes(role)) {
          const matched = employees.data.filter((emp) => {
            const matchLevel1 = emp.level1 === level1
            const matchLevel2 = level2 ? emp.level2 === level2 : true
            return matchLevel1 && matchLevel2
          })

          return [...acc, ...matched]
        }
        return acc
      }, [])
    }
    //

    store.dispatch(setEmployees(result))
  } catch (error) {
    const errorMesssage =
      error?.response?.data?.error?.message ||
      'Что-то пошло не так в HomeLayout...'
    toast.error(errorMesssage)
    return null
  }

  return null
}

const HomeLayout = () => {
  const navigation = useNavigation()
  const isPageLoding = navigation.state === 'loading'

  return (
    <div className='h-screen grid grid-cols-[64px_1fr] bg-[#fff]'>
      <Navbar />
      {isPageLoding ? (
        <Loading />
      ) : (
        <section className='align-element mt-7'>
          <Outlet />
        </section>
      )}
    </div>
  )
}
export default HomeLayout

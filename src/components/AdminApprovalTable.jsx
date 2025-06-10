import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customFetch } from '../utils'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'

export const AdminApprovalTable = () => {
  const queryClient = useQueryClient()

  const user = useSelector((state) => state.userState.user)

  // GET: получим список доступных Level1
  const { data: levels = [], isLoading } = useQuery(['levelsForApproval'], () =>
    customFetch.get('/levels-for-approval').then((res) => res.data)
  )

  // GET: получим список закрытых Level1
  const { data: approvedLevels = [] } = useQuery(['approvedLevels'], () =>
    customFetch.get('/approved-levels').then((res) => res.data)
  )

  // POST: согласование конкретного Level1
  const approveMutation = useMutation(
    (level1) => customFetch.post('/approve-level', { level1, user }),
    {
      onSuccess: () => {
        toast.success('Уровень закрыт к редактированию')
        // queryClient.invalidateQueries(['levelsForApproval'])
      },
      onError: (err) => {
        console.error(err)
        toast.error('Ошибка')
      },
    }
  )
  // POST: отклонени конкретного Level1
  const declineMutation = useMutation(
    (level1) => customFetch.post('/decline-level', { level1 }),
    {
      onSuccess: () => {
        toast.success('Уровень открыт для редактирования')
        // queryClient.invalidateQueries(['levelsForApproval'])
      },
      onError: (err) => {
        console.error(err)
        toast.error('Ошибка')
      },
    }
  )

  if (isLoading) return <div>Загрузка...</div>

  return (
    <>
      {levels.length > 0 && (
        <>
          <h2 className='font-bold mt-8'>
            Согласовать и закрыть на редактирование
          </h2>
          <table className='table w-full'>
            <thead>
              <tr>
                <th>Уровень 1</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {levels.map((lvl) => (
                <tr key={lvl}>
                  <td className='w-[1200px]'>{lvl}</td>
                  <td>
                    <button
                      className='btn btn-sm btn-success btn-outline'
                      onClick={() => approveMutation.mutate(lvl)}
                      disabled={approveMutation.isLoading}
                    >
                      Закрыть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {approvedLevels.length > 0 && (
        <>
          <h2 className='font-bold mt-8'>Открыть на редактирование</h2>
          <table className='table w-full'>
            <thead>
              <tr>
                <th>Уровень 1</th>
                <th>Действие</th>
              </tr>
            </thead>
            <tbody>
              {approvedLevels.map((lvl) => (
                <tr key={lvl.level1}>
                  <td className='w-[1200px]'>{lvl.level1}</td>
                  <td>
                    <button
                      className='btn btn-sm btn-error btn-outline'
                      onClick={() => declineMutation.mutate(lvl.level1)}
                    >
                      Открыть
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </>
  )
}

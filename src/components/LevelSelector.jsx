import { useState } from 'react'
import {
  useLevel1,
  useLevel2,
  useLevel3,
  useLevel4,
} from '../hooks/useLevelData.js'

const LevelSelector = ({ user }) => {
  const userRole = user.roles[0]

  const [selectedLevel1, setSelectedLevel1] = useState(null)
  const [selectedLevel2, setSelectedLevel2] = useState(null)
  const [selectedLevel3, setSelectedLevel3] = useState(null)
  const [selectedLevel4, setSelectedLevel4] = useState(null)

  const { data: level1, isLoading: loadingLevel1 } = useLevel1()
  const { data: level2, isLoading: loadingLevel2 } = useLevel2(selectedLevel1)
  const { data: level3, isLoading: loadingLevel3 } = useLevel3(selectedLevel2)
  const { data: level4, isLoading: loadingLevel4 } = useLevel4(selectedLevel3)

  const resetBelow = (level) => {
    if (level === 'level1') {
      setSelectedLevel2(null)
      setSelectedLevel3(null)
    } else if (level === 'level2') {
      setSelectedLevel3(null)
    } else if (level === 'level3') {
      setSelectedLevel4(null)
    }
  }

  return (
    <div className='grid grid-cols-4 gap-2 w-full'>
      {/* level 1 */}
      <div className='form-control'>
        <label className='label label-text capitalize text-neutral-500'>
          Level 1:
        </label>
        <select
          name='level1'
          value={selectedLevel1 || ''}
          onChange={(e) => {
            setSelectedLevel1(e.target.value)
            resetBelow('level1')
          }}
          className='select select-bordered w-full'
        >
          <option value=''>Выберите</option>
          {loadingLevel1 ? (
            <option disabled>Загрузка...</option>
          ) : userRole === 'ROLE_ADMIN' ? (
            level1?.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))
          ) : (
            level1
              ?.filter((item) => item.id === userRole)
              .map((value) => (
                <option key={value.id} value={value.id}>
                  {value.name}
                </option>
              ))
          )}
        </select>
      </div>

      {/* level 2 */}
      <div className='form-control'>
        <label className='label label-text capitalize text-neutral-500'>
          Level 2:
        </label>
        <select
          name='level2'
          value={selectedLevel2 || ''}
          onChange={(e) => {
            setSelectedLevel2(e.target.value)
            resetBelow('level2')
          }}
          className='select select-bordered w-full'
          disabled={!selectedLevel1}
        >
          <option value=''>Выберите</option>
          {loadingLevel2 ? (
            <option disabled>Загрузка...</option>
          ) : (
            level2?.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* level 3 */}
      <div className='form-control'>
        <label className='label label-text capitalize text-neutral-500'>
          Level 3:
        </label>
        <select
          name='level3'
          value={selectedLevel3 || ''}
          onChange={(e) => setSelectedLevel3(e.target.value)}
          className='select select-bordered w-full'
          disabled={!selectedLevel2}
        >
          <option value=''>Выберите</option>
          {loadingLevel3 ? (
            <option disabled>Загрузка...</option>
          ) : (
            level3?.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))
          )}
        </select>
      </div>

      {/* level 4 */}
      <div className='form-control'>
        <label className='label label-text capitalize text-neutral-500'>
          Level 4:
        </label>
        <select
          name='level4'
          value={selectedLevel4 || ''}
          onChange={(e) => setSelectedLevel4(e.target.value)}
          className='select select-bordered w-full'
          disabled={!selectedLevel3}
        >
          <option value=''>Выберите</option>
          {loadingLevel4 ? (
            <option disabled>Загрузка...</option>
          ) : (
            level4?.map((value) => (
              <option key={value.id} value={value.id}>
                {value.name}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  )
}

export default LevelSelector

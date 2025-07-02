import { useState, useRef, useEffect } from 'react'

const MultiSelect = ({ options = [], selected = [], setSelected, label }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef(null)

  const allValues = options?.map((opt) => opt.value)
  const isAllSelected = selected.length === allValues.length

  const toggleOption = (value) => {
    if (value === '__all__') {
      setSelected(isAllSelected ? [] : allValues)
    } else {
      setSelected(
        selected.includes(value)
          ? selected.filter((v) => v !== value)
          : [...selected, value]
      )
    }
  }

  const resetFilter = () => {
    setSelected([])
    setSearchTerm('')
    setIsOpen(false)
  }

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options?.filter((opt) =>
    (opt.label ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className='form-control w-full relative' ref={dropdownRef}>
      <label className='label justify-between'>
        <span className='label-text text-sm'>{label}</span>
        {selected.length > 0 && (
          <button
            className='text-xs text-primary hover:underline'
            onClick={resetFilter}
            type='button'
          >
            Сбросить
          </button>
        )}
      </label>

      <div className='relative'>
        <div
          className='input input-bordered w-full cursor-pointer flex flex-wrap gap-1 min-h-[2.5rem] items-center pl-4'
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 ? (
            <span className='text-gray-400'>Выберите...</span>
          ) : selected.length === 1 ? (
            <span className='p-4 badge badge-sm bg-gray-100 text-gray-800 h-8 overflow-hidden text-nowrap'>
              {selected}
            </span>
          ) : (
            <span className='p-4 badge badge-sm bg-gray-100 text-gray-800 h-8'>
              {selected.length} выбрано
            </span>
          )}
        </div>

        {isOpen && (
          <div className='absolute mt-1 z-[9999] bg-white border rounded-md shadow-md w-full max-h-72 overflow-auto'>
            {/* Поиск */}
            <div className='px-4 py-2 sticky top-0 bg-white border-b'>
              <input
                type='text'
                placeholder='Поиск...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='input input-sm input-bordered w-full'
              />
            </div>

            {/* Выбрать всё */}
            <li
              className={`cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center font-semibold ${
                isAllSelected ? 'bg-gray-100' : ''
              }`}
              onClick={() => toggleOption('__all__')}
            >
              <div className='flex items-center gap-2'>
                <input
                  type='checkbox'
                  checked={isAllSelected}
                  readOnly
                  className='checkbox checkbox-sm checkbox-neutral'
                />
                Выбрать все
              </div>
              <span className='text-xs text-gray-500'>{options.length}</span>
            </li>

            {/* Разделитель */}
            <li className='divider my-0' />

            {/* Фильтрованные элементы */}
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => (
                <li
                  key={opt.value}
                  className={`cursor-pointer px-4 py-2 hover:bg-gray-100 flex justify-between items-center ${
                    selected.includes(opt.value)
                      ? 'bg-gray-100 font-medium'
                      : ''
                  }`}
                  onClick={() => toggleOption(opt.value)}
                >
                  <div className='flex items-center gap-2'>
                    <input
                      type='checkbox'
                      checked={selected.includes(opt.value)}
                      readOnly
                      className='checkbox checkbox-sm checkbox-neutral'
                    />
                    {opt.label}
                  </div>
                  <span className='text-xs text-gray-500'>{opt.count}</span>
                </li>
              ))
            ) : (
              <li className='px-4 py-2 text-gray-400 list-none'>
                Ничего не найдено
              </li>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MultiSelect

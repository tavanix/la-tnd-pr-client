import { useState, useRef, useEffect } from 'react'

const MultiSelect = ({ options, selected, setSelected, label }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const toggleOption = (value) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
    } else {
      setSelected([...selected, value])
    }
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

  return (
    <div className='form-control w-full' ref={dropdownRef}>
      <label className='label'>
        <span className='label-text'>{label}</span>
      </label>

      <div className='relative'>
        <div
          className='input input-bordered overflow-hidden cursor-pointer flex flex-wrap gap-1 min-h-[2.5rem] items-center'
          onClick={() => setIsOpen(!isOpen)}
        >
          {selected.length === 0 ? (
            <span className='text-gray-400'>Выберите...</span>
          ) : (
            selected.map((val) => (
              <span
                key={val}
                className='p-2 badge badge-outline badge-sm bg-gray-100 text-gray-800 h-8'
              >
                {options.find((o) => o.value === val)?.label}
              </span>
            ))
          )}
        </div>

        {isOpen && (
          // absolute
          <ul className='mt-1 bg-white border rounded-md shadow-md w-full max-h-200 overflow-auto'>
            {options.map((opt) => (
              <li
                key={opt.value}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-center gap-2 ${
                  selected.includes(opt.value) ? 'bg-gray-100 font-medium' : ''
                }`}
                onClick={() => toggleOption(opt.value)}
              >
                <input
                  type='checkbox'
                  checked={selected.includes(opt.value)}
                  readOnly
                  className='checkbox checkbox-sm checkbox-primary'
                />
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default MultiSelect

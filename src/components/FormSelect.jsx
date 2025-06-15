const FormSelect = ({
  label,
  name,
  list,
  defaultValue,
  size,
  required,
  span,
  value,
  handleChange,
}) => {
  let listToRender = [...new Set(list)]

  return (
    <div className={`form-control ${span} `}>
      <label htmlFor={name} className='label'>
        <span className='label-text capitalize text-neutral-500'>{label}</span>
      </label>
      <select
        required={required}
        name={name}
        id={name}
        value={value}
        onChange={handleChange}
        className={`select select-bordered ${size}`}
      >
        {listToRender.map((item) => {
          return (
            <option key={item} value={item}>
              {item}
            </option>
          )
        })}
      </select>
    </div>
  )
}

export default FormSelect

const FormTextarea = ({
  label,
  name,
  defaultValue,
  maxLength,
  required,
  readonly,
  disabled,
  placeholder,
  rows,
  cols,
}) => {
  return (
    <label className='form-control'>
      <div className='label'>
        <span className='label-text capitalize text-neutral-500'>{label}</span>
      </div>
      <textarea
        name={name}
        className='textarea textarea-bordered h-24'
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
        cols={cols}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        readOnly={readonly}
      ></textarea>
    </label>
  )
}

export default FormTextarea

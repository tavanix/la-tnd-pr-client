const FormInput = ({
  label,
  name,
  type,
  defaultValue,
  size,
  required,
  minLength,
  maxLength,
  min,
  max,
  span,
  hidden,
  readonly,
  disabled,
  placeholder,
  step,
  value,
  handleChange,
}) => {
  return (
    <div className={`form-control ${span} ${hidden} `}>
      <label className={`label`}>
        <span className={`label-text capitalize text-neutral-500`}>
          {label}
        </span>
      </label>
      <input
        min={min}
        max={max}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        name={name}
        type={type}
        defaultValue={defaultValue}
        className={`input input-bordered ${size} `}
        readOnly={readonly}
        disabled={disabled}
        placeholder={placeholder}
        step={step}
        value={value}
        onChange={handleChange}
      />
    </div>
  )
}
export default FormInput

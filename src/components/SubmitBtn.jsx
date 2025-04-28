import { useNavigation } from 'react-router-dom'

const SubmitBtn = ({
  text,
  block,
  btnType,
  btnOutline,
  textColor,
  onClick,
  otherParams,
}) => {
  const navigation = useNavigation()
  const isSubmitting = navigation.state === 'submitting...'

  const btnTypes = [
    'btn-primary',
    'btn-secondary',
    'btn-warning',
    'btn-neutral',
    'btn-info',
  ]

  return (
    <button
      type='submit'
      className={
        (btnOutline ? 'btn-outline ' : '') +
        `btn text-${textColor} btn-` +
        (btnType ? btnType : `primary`) +
        ` ` +
        (block === 'true' ? 'btn-block' : 'w-36') +
        otherParams
      }
      disabled={isSubmitting}
      onClick={onClick}
    >
      {isSubmitting ? (
        <>
          <span className='loading loading-spinner'></span>
          sending...
        </>
      ) : (
        text || 'submit'
      )}
    </button>
  )
}
export default SubmitBtn

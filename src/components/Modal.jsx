import React from 'react'

const Modal = (
  modalId,
  modalName,
  modalOpenBtnStyle,
  modalOpenBtnText,
  modalTitle,
  modalContent,
  modalPositiveActionBtnText
) => {
  return (
    <div className=''>
      <span
        className={`btn btn-sm btn-ghost btn-outline btn-${modalOpenBtnStyle}`}
        onClick={() => {
          document.getElementById(`${modalName}-${modalId}`).showModal()
        }}
      >
        {modalOpenBtnText}
      </span>

      <dialog id={`${modalName}-${modalId}`} className='modal'>
        <div className='modal-box'>
          <h3 className={`font-bold text-lg text-${modalOpenBtnStyle}`}>
            {modalTitle}
          </h3>
          <p className='pt-4 pb-2'>{modalContent}</p>

          <div className='modal-action'>
            <form method='dialog'>
              <button
                className={`btn btn-${modalOpenBtnStyle} uppercase mr-2`}
                onClick={() => handleDeleteClick(modalId)}
              >
                {modalPositiveActionBtnText}
              </button>

              <button className='btn uppercase'>отмена</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  )
}

export default Modal

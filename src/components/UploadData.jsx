import * as XLSX from 'xlsx'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { customFetch } from '../utils'

const UploadData = () => {
  const [file, setFile] = useState(null)

  const uploadMutation = useMutation({
    mutationFn: async (employees) => {
      const token = localStorage.getItem('token')
      const res = await customFetch.post('/employees/bulk', employees, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return res.data
    },
    onSuccess: () => {
      toast.success('Сотрудники успешно загружены!')
    },
    onError: () => {
      toast.error('Ошибка при загрузке сотрудников')
    },
  })

  const handleFile = (e) => {
    const selectedFile = e.target.files[0]
    const reader = new FileReader()
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result)
      const workbook = XLSX.read(data, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const json = XLSX.utils.sheet_to_json(worksheet)
      uploadMutation.mutate(json)
    }

    reader.readAsArrayBuffer(selectedFile)
    setFile(selectedFile)
  }

  return (
    <div className='flex items-center gap-4'>
      <input
        type='file'
        accept='.xlsx, .xls'
        onChange={handleFile}
        className='file-input file-input-bordered'
      />
      {uploadMutation.isLoading && <span>Загрузка...</span>}
    </div>
  )
}

export default UploadData

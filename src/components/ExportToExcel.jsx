import * as XLSX from 'xlsx/xlsx.mjs'
import { RiFileExcel2Fill } from 'react-icons/ri'

const ExportToExcel = ({ data, bookTitle }) => {
  const exportToWb = () => {
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data))
    XLSX.writeFileXLSX(wb, `${bookTitle}.xlsx`)
  }

  return (
    <button onClick={exportToWb} className='btn btn-outline btn-success'>
      <RiFileExcel2Fill className='text-xl' />
      <span className='text-md'>Export</span>
    </button>
  )
}

export default ExportToExcel

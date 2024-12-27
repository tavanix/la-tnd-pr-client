import * as XLSX from 'xlsx/xlsx.mjs'
import { BsFiletypeCsv } from 'react-icons/bs'

const ExportToCsv = ({ data, bookTitle }) => {
  const exportToWb = () => {
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data))
    XLSX.writeFile(wb, `${bookTitle}.csv`, { bookType: 'csv', FS: ',' })
  }

  return (
    <button onClick={exportToWb} className='btn btn-outline btn-success'>
      <BsFiletypeCsv className='text-xl' />
      <span className='text-md'>Export</span>
    </button>
  )
}

export default ExportToCsv

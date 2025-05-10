const CollapseWithArrow = ({ title, content }) => {
  return (
    <div className='collapse mb-4 static shadow-md p-1'>
      <input type='checkbox' className='peer static' />
      <div className='collapse-title static w-full font-bold'>{title}</div>
      <div className='collapse-content'>{content}</div>
      {/* <div className='pl-4 pr-4 pb-4'>{content}</div> */}
    </div>
  )
}

export default CollapseWithArrow

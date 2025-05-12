const CollapseWithArrow = ({ title, content }) => {
  return (
    // <div className='collapse mb-4 static shadow-md p-1'>
    //   <input type='checkbox' className='peer static' />
    //   <div className='collapse-title static w-full font-bold'>{title}</div>
    //   <div className='collapse-content'>{content}</div>
    //   {/* <div className='pl-4 pr-4 pb-4'>{content}</div> */}
    // </div>
    <div className='mb-6 '>
      <div className='text-lg font-bold mb-2'>{title}</div>
      <div className=''>{content}</div>
    </div>
  )
}

export default CollapseWithArrow

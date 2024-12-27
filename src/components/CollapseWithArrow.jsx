const CollapseWithArrow = ({ title, content }) => {
  return (
    <div className='collapse mb-4 static shadow-md p-2'>
      <input type='checkbox' className='peer static' />
      <div className='collapse-title static w-full font-bold italic'>
        {title}
      </div>
      <div className='collapse-content'>{content}</div>
    </div>
  )
}

export default CollapseWithArrow

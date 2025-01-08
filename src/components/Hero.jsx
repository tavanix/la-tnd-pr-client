const Hero = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 items-center mt-8'>
      <div>
        <h3 className='max-w-2xl text-5xl font-bold tracking-tight sm:text-5xl'>
          We change the way people work
        </h3>
      </div>

      <div className='h-[24rem] flex justify-center m-auto lg:carousel carousel-center p-4 space-x-4 bg-neutral rounded-box'>
        <div className='flex flex-wrap flex-col gap-2 w-96 sm:gap-x-6 items-center justify-center'>
          <div className='stats shadow flex flex-col'>
            <div className='stat'>
              <div className='text-2xl font-bold tracking-widest'>
                HR PMO & Analytics
              </div>
            </div>
          </div>

          <div className='mt-16'>
            <span>developed by Maksim Aysin</span>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Hero

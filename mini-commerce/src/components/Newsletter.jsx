import React from 'react'

const Newsletter = () => {
  return (
    <div className='w-full px-[7%] flex flex-col gap-4 justify-center items-center '>
        <div className='w-full bg-black text-white rounded-[20px] py-[36px] px-[20px] md:px-[64px] translate-y-[70px] flex flex-col md:flex-row justify-center items-center gap-4 md:gap-15'>
            <h1 className='text-[32px] md:text-[40px] font-bold w-full text-center md:text-left'>STAY UPTO DATE ABOUT OUR LATEST OFFERS</h1>
            <div className='w-full flex flex-col gap-4'>
                <input type="text" placeholder='Enter your email address' className='px-[16px] py-[12px] bg-white rounded-[62px] outline-none text-black w-full' />
                <button className='bg-white text-black font-medium text-[16px] py-[12px] px-[16px] w-full rounded-[62px] cursor-pointer hover:bg-gray-200 transition'>Subscribe to Newsletter</button>
            </div>
        </div>
    </div>
  )
}

export default Newsletter
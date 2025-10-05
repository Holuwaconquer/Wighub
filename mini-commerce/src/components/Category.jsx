import React from 'react'

const Category = () => {
  return (
    <div className='w-full  py-[3%] px-[7%] flex flex-col gap-4 justify-center items-center '>
        <div className='w-full bg-[#F0F0F0] rounded-[40px] px-[5%] py-[30px] flex flex-col gap-4 justify-center items-center'>
            <h1 className='text-[48px] font-bold'>BROWSE BY DRESS STYLE</h1>
            <div className='w-full grid md:grid-cols-[40%_60%] gap-5'>
                <div className='w-full bg-white h-[289px] text-[36px] font-bold flex flex-col rounded-[20px] p-[20px]'>
                    <h2>Casual</h2>
                </div>
                <div className='w-full bg-white h-[289px] text-[36px] font-bold flex flex-col rounded-[20px] p-[20px]'>
                    <h2>Formal</h2>
                </div>
            </div>
            <div className='w-full grid md:grid-cols-[60%_40%] gap-5'>
                <div className='w-full bg-white h-[289px] text-[36px] font-bold flex flex-col rounded-[20px] p-[20px]'>
                    <h2>Casual</h2>
                </div>
                <div className='w-full bg-white h-[289px] text-[36px] font-bold flex flex-col rounded-[20px] p-[20px]'>
                    <h2>Formal</h2>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Category
import React from 'react'
import ProductCard from './ProductCard'

const NewArrival = () => {
  return (
    <div className='w-full  py-[3%] px-[7%] flex flex-col gap-4 justify-center items-center border-b border-[#0000001A]'>
        <h1 className='text-[48px] font-extrabold'>NEW ARRIVALS</h1>
        <div className='w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar- scroll-smooth md:grid md:grid-cols-3 lg:grid-cols-4'>
            <div className="min-w-4/6 snap-center">
                <ProductCard />
            </div>
            <div className="min-w-4/6 snap-center">
                <ProductCard />
            </div>
            <div className="min-w-4/6 snap-center">
                <ProductCard />
            </div>
            <div className="min-w-4/6 snap-center">
                <ProductCard />
            </div>
        </div>
        <div className='w-full flex justify-center'>
        <button className='border border-[#0000001A] text-black font-medium text-[16px] py-[16px] px-[54px] cursor-pointer hover:border-[#00000070] hover:scale-[1.05] transition-transform rounded-[62px]'>View All</button>
        </div>
    </div>
  )
}

export default NewArrival
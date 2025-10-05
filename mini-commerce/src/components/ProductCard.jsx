import React from 'react'
import Product1 from '../../public/product1.png'
import Star from '../../public/star.png'

const ProductCard = () => {
  return (
    <div className='w-full flex flex-col gap-4'>
        <div className='w-full h-[200px] md:h-[298px] rounded-[20px] bg-[#F0EEED] '>
            <img src={Product1} className='w-full h-full object-contain' alt="" />
        </div>
        <div className='w-full flex flex-col gap-2'>
            <h2 className='font-bold text-[20px]'>T-SHIRT WITH TAPE DETAILS</h2>
            <img src={Star} className='w-2/4' alt="" />
            <p className='font-bold text-[24px]'>$120</p>
        </div>
    </div>
  )
}

export default ProductCard
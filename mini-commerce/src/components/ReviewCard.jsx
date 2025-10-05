import React from 'react'
import Star from '../../public/star.png'

const ReviewCard = () => {
  return (
    <div className='border border-[#0000001A] py-[28px] px-[32px] rounded-[20px] flex flex-col gap-4'>
        <img src={Star} alt="Star" className='w-2/4'/>
      <h2 className='text-[24px] font-bold'>Sarah M. ✅</h2>
      <p className='text-[16px]'>"I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.”</p>
    </div>
  )
}

export default ReviewCard
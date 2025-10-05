import React from 'react'
import ReviewCard from './ReviewCard'

const CustomerReview = () => {
  return (
    <div className="w-full py-[3%] px-[7%] flex flex-col gap-4 ">
      <h1 className="text-[48px] font-extrabold">OUR HAPPY CUSTOMERS</h1>

      {/* Scrolling wrapper */}
      <div className="relative w-full overflow-x-hidden">
        <div className="flex flex-nowrap shrink-0 gap-4 w-[200%] scroll-animate">
          <ReviewCard className="w-[400px] flex-1" />
          <ReviewCard className="w-[400px] flex-1" />
          <ReviewCard className="w-[400px] flex-1" />
          <ReviewCard className="w-[400px] flex-1" />
          <ReviewCard className="w-[400px] flex-1" />
          <ReviewCard className="w-[400px] flex-1" />
        </div>
      </div>
    </div>
  )
}

export default CustomerReview

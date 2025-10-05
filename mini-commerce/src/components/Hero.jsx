import React from 'react'
import Couples from '../../public/couples.jpg'
import Vector1 from '../../public/Vector1.png'
import Vector2 from '../../public/Vector2.png'

const Hero = () => {
  return (
    <div className='w-full bg-[#F2F0F1] flex flex-col'>
        <div className='w-full pt-[20px] px-[20px] md:px-[7%] grid md:grid-cols-2 gap-4 items-center'>
            {/* for right side */}
            <div className='w-full md:w-auto flex flex-col  gap-4'>
                <h1 className='text-[36px] md:text-[74px] font-bold md:leading-18'>FIND CLOTHES THAT MATCHES YOUR STYLE</h1>
                <p className='text-[16px] text-[#00000099]'>Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.</p>
                <div>
                    <button className="flex overflow-hidden items-center font-medium focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 w-full md:w-auto cursor-pointer px-[54px] py-[16px] rounded-[62px] whitespace-pre md:flex group relative justify-center gap-2 transition-all duration-300 ease-out hover:ring-2 hover:ring-black hover:ring-offset-2" >
                        <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                        <div className="flex items-center">
                            <span className="ml-1 text-white">Shop Now</span>
                        </div>
                    </button>
                </div>
                {/* for numbers section */}
                <div className='flex flex-wrap gap-4 items-center mt-4 justify-center md:justify-start'>
                    {/* for international brands */}
                    <div className='flex flex-col leading-8 pr-10 border-r border-[#0000001A]'>
                        <h2 className='text-[40px] text-black font-semibold'>200+</h2>
                        <p>International Brands</p>
                    </div>
                    {/* for high quality products */}
                    <div className='flex flex-col leading-8 pr-10 border-0 md:border-r md:border-[#0000001A]'>
                        <h2 className='text-[40px] text-black font-semibold'>2000+</h2>
                        <p>High Quality Products</p>
                    </div>
                    {/* for happy customers */}
                    <div className='flex flex-col leading-8'>
                        <h2 className='text-[40px] text-black font-semibold'>300+</h2>
                        <p>Happy Customers</p>
                    </div>
                </div>
            </div>
            {/* for second side */}
            <div className='w-full object-fit-cover relative'>
                <img src={Couples} className='w-full object-fit-contain' alt="" />
                {/* for vectors */}
                <img src={Vector1} className='absolute left-0 top-90' alt="" />
                <img src={Vector2} className='absolute top-30 right-0' alt="" />
            </div>
        </div>
        
    </div>
  )
}

export default Hero
import React from 'react'
import Versace from '../../public/versace.png'
import Zara from '../../public/zara.png'
import Gucci from '../../public/gucci.png'
import Prada from '../../public/prada.png'
import Calvin from '../../public/calvin.png'

const Brand = () => {
  return (
    <div className='w-full py-[15px] px-[20px] md:px-[7%] bg-black flex items-center flex-wrap gap-4 justify-center md:justify-between'>
        {/* for brand logos */}
        <img src={Versace} alt="Brand 1" className='w-1/4 md:w-auto ' />
        <img src={Zara} alt="Brand 2" className='w-1/4 md:w-auto' />
        <img src={Gucci} alt="Brand 3" className='w-1/4 md:w-auto' />
        <img src={Prada} alt="Brand 4" className='w-1/4 md:w-auto' />
        <img src={Calvin} alt="Brand 5" className='w-1/4 md:w-auto' />
    </div>
  )
}

export default Brand
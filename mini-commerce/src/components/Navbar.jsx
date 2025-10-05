import React from 'react'
import { BsXLg } from 'react-icons/bs'
import { HiOutlineMenu } from "react-icons/hi";
import { Link } from 'react-router-dom';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BsCart2 } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className="w-full py-[15px] px-[20px] md:px-[7%] flex flex-col">
        <div className='w-full flex items-center justify-between gap-4'>
            {/* for logo */}
            <div className='flex items-center gap-4 w-auto text-black'>
                <HiOutlineMenu className='text-[24px] cursor-pointer md:hidden' />
                <h1 className='text-[32px] leading-0 font-bold'>SHOP.CO</h1>
            </div>
            {/* for navbar */}
            <div className='hidden flex-col h-screen md:h-auto text-white md:text-black top-0 left-0 bg-gray-950 md:bg-transparent w-2/4 md:w-auto md:relative md:flex md:flex-row  items-center gap-4'>
                <Link to='/shop' className='text-[16px]'>Shop</Link>
                <Link to='/shop' className='text-[16px]'>On Sale</Link>
                <Link to='/shop' className='text-[16px]'>New Arrival</Link>
                <Link to='/shop' className='text-[16px]'>Brands</Link>
            </div>
            {/* for search bar */}
            <div className='rounded-[62px] w-2/4 hidden md:flex py-[12px] px-[16px] bg-[#F0F0F0]  items-center gap-4'>
                <HiMiniMagnifyingGlass className='text-[30px] text-[#00000066]'/>
                <input type="text" className='w-full border-none outline-none bg-transparent' placeholder='Search...' />
            </div>
            {/* for cart and profile icons */}
            <div className='w-auto flex items-center gap-4'>
                <BsCart2 className='text-[24px] cursor-pointer' />
                <FaRegUserCircle  className='text-[24px] cursor-pointer' />
            </div>
        </div>
        
    </div>
  )
}

export default Navbar
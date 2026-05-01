import React, { useState, useEffect } from 'react'
import { BsXLg } from 'react-icons/bs'
import { HiOutlineMenu } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { BsCart2 } from "react-icons/bs";
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const navigate = useNavigate()

  // Handle scroll effect with smooth transition
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchInput.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchInput)}`)
      setIsSearchOpen(false)
      setSearchInput('')
    }
  }

  const navLinks = [
    { name: 'Shop', path: '/shop' },
    { name: 'On Sale', path: '/shop?category=sale' },
    { name: 'New Arrival', path: '/shop?category=new' },
    { name: 'Wigs', path: '/shop?category=wigs' },
    { name: 'Extensions', path: '/shop?category=extensions' }
  ]

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg py-2' 
            : 'bg-gradient-to-br from-purple-100 to-pink-100 py-3 md:py-4'
        }`}
      >
        <div className="w-full px-4 sm:px-6 md:px-[7%]">
          <div className='flex items-center justify-between gap-2 sm:gap-4'>
            {/* Left section - Menu button and Logo */}
            <div className='flex items-center gap-2'>
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setIsMenuOpen(true)}
                className='md:hidden p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95'
                aria-label="Open menu"
              >
                <HiOutlineMenu className='text-2xl sm:text-[24px] transition-transform duration-300' />
              </button>

              {/* Logo */}
              <div className='flex-shrink-0'>
                <h1 
                  onClick={() => navigate('/')} 
                  className='text-[18px] sm:text-2xl md:text-3xl lg:text-[32px] font-bold cursor-pointer transition-all duration-300 hover:opacity-80 hover:scale-105 active:scale-95 leading-tight'
                  style={{ color: '#9b83a3' }}
                >
                  MINKA LUXURY
                  <span style={{ color: '#9b83a3' }} className='block sm:hidden text-[14px] text-gray-600'>HAIR</span>
                  <span className='hidden sm:inline'> HAIR</span>
                </h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-4 lg:gap-6 xl:gap-8'>
              {navLinks.map((link, index) => (
                <Link 
                  key={index}
                  to={link.path} 
                  className='text-sm lg:text-base font-medium transition-all duration-300 hover:text-[#8c6020] hover:scale-105 relative group'
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#8c6020] transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ))}
            </div>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className='hidden md:flex flex-1 max-w-md mx-4 transition-all duration-300'>
              <div className='relative w-full'>
                <HiMiniMagnifyingGlass className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl transition-all duration-300' />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder='Search for hair products...' 
                  className='w-full pl-11 pr-4 py-2.5 rounded-full bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b83a3] focus:border-transparent transition-all duration-300 focus:scale-105'
                />
              </div>
            </form>

            {/* Icons */}
            <div className='flex items-center gap-2 sm:gap-3 md:gap-4'>
              {/* Mobile Search Icon */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className='md:hidden p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95'
                aria-label="Search"
              >
                <HiMiniMagnifyingGlass className='text-xl sm:text-2xl transition-transform duration-300' />
              </button>

              <button className='relative p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 group'>
                <BsCart2 className='text-xl sm:text-2xl transition-transform duration-300' />
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-red-600'>
                  0
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/login')}
                className='p-2 hover:bg-white/20 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95'
              >
                <FaRegUserCircle className='text-xl sm:text-2xl transition-transform duration-300' />
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className={`md:hidden transition-all duration-300 ease-in-out transform ${
            isSearchOpen ? 'opacity-100 translate-y-0 mt-3' : 'opacity-0 -translate-y-4 h-0 overflow-hidden'
          }`}>
            <form onSubmit={handleSearch} className='relative'>
              <HiMiniMagnifyingGlass className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl' />
              <input 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder='Search for hair products...' 
                className='w-full pl-11 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#9b83a3] focus:border-transparent transition-all duration-300'
                autoFocus={isSearchOpen}
              />
              {isSearchOpen && (
                <button 
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300 hover:scale-110'
                >
                  <BsXLg className='text-sm' />
                </button>
              )}
            </form>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-50 transition-all duration-500 ease-in-out md:hidden ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        {/* Mobile Menu Panel */}
        <div 
          className={`mobile-menu fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl transition-all duration-500 ease-out transform ${
            isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Menu Header */}
          <div className='flex justify-between items-center p-5 border-b border-gray-100'>
            <h2 className='text-xl font-bold transition-all duration-300 hover:scale-105' style={{ color: '#9b83a3' }}>Menu</h2>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className='p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:rotate-90 hover:scale-110'
              aria-label="Close menu"
            >
              <BsXLg className='text-xl text-gray-600' />
            </button>
          </div>

          {/* Menu Links */}
          <div className='flex flex-col p-4 gap-2'>
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className='px-4 py-3 text-gray-700 font-medium rounded-xl transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:text-[#8c6020] hover:translate-x-2'
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Menu Footer */}
          <div className='absolute bottom-0 left-0 right-0 p-5 border-t border-gray-100 bg-white'>
            <div className='flex justify-around'>
              <button 
                onClick={() => {
                  navigate('/login')
                  setIsMenuOpen(false)
                }}
                className='flex flex-col items-center gap-1 text-gray-600 transition-all duration-300 hover:text-[#9b83a3] hover:scale-110'
              >
                <FaRegUserCircle className='text-2xl' />
                <span className='text-xs'>Account</span>
              </button>
              <button 
                onClick={() => {
                  navigate('/cart')
                  setIsMenuOpen(false)
                }}
                className='flex flex-col items-center gap-1 text-gray-600 transition-all duration-300 hover:text-[#9b83a3] hover:scale-110'
              >
                <BsCart2 className='text-2xl' />
                <span className='text-xs'>Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className={`transition-all duration-500 ${
        scrolled ? 'h-[60px] sm:h-[64px] md:h-[72px]' : 'h-[68px] sm:h-[72px] md:h-[80px]'
      }`}></div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(-10px);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  )
}

export default Navbar
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [imageStyle, setImageStyle] = useState('diagonal')
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Carousel images array
  const carouselImages = [
    {
      id: 1,
      url: '/image1.jpg',
      alt: 'Luxury Brazilian Hair Wig',
      title: 'Brazilian Hair',
      description: 'Soft, shiny, and tangle-free'
    },
    {
      id: 2,
      url: '/image2.jpg',
      alt: 'Peruvian Straight Wig',
      title: 'Peruvian Hair',
      description: 'Natural bounce and volume'
    },
    {
      id: 3,
      url: '/image3.jpg',
      alt: 'Deep Wave Bundles',
      title: 'Deep Wave',
      description: 'Defined curls that last'
    },
    {
      id: 4,
      url: '/image4.jpg',
      alt: 'Lace Front Wig',
      title: 'Lace Front',
      description: 'Invisible hairline'
    },
    {
      id: 5,
      url: '/image3.jpg',
      alt: 'Kinky Curly Bundles',
      title: 'Kinky Curly',
      description: 'Natural texture blend'
    }
  ]

  const getClipPath = () => {
    switch(imageStyle) {
      case 'diagonal':
        return 'polygon(0% 0%, 100% 0%, 95% 100%, 0% 100%)'
      case 'slant':
        return 'polygon(20% 0%, 100% 0%, 90% 100%, 0% 100%)'
      case 'parallelogram':
        return 'polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%)'
      default:
        return 'polygon(0% 0%, 100% 0%, 85% 100%, 0% 100%)'
    }
  }

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleImageChange((currentImageIndex + 1) % carouselImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [currentImageIndex])

  const handleImageChange = (index) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentImageIndex(index)
      setIsTransitioning(false)
    }, 300)
  }

  const handleDotClick = (index) => {
    handleImageChange(index)
  }

  const handleShapeClick = (shape, index) => {
    setImageStyle(shape)
    // Also change image when clicking shape
    if (index !== undefined) {
      handleImageChange(index)
    }
  }
  const navigate = useNavigate();

  return (
    <div className='w-full bg-gradient-to-br from-[#F9F5F7] via-[#F2F0F1] to-[#F0E6F0] flex flex-col overflow-hidden relative'>
        {/* Background decorative elements */}
        <div className='absolute top-20 left-10 w-72 h-72 bg-[#9b83a3]/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-20 right-10 w-96 h-96 bg-[#8c6020]/5 rounded-full blur-3xl'></div>
        
        <div className='w-full pt-[60px] pb-[60px] px-[20px] md:px-[7%] relative z-10'>
            <div className='grid md:grid-cols-2 gap-12 items-center'>
                
                {/* Left Side - Text Content */}
                <div className='w-full space-y-8 animate-slideInLeft'>
                    <div className='space-y-4'>
                        <h1 className='text-[40px] md:text-[64px] font-bold leading-[1.1]'>
                            <span className='block'>Elevate Your</span>
                            <span className='text-[#9b83a3]'>Crown With</span>
                            <span className='text-[#8c6020]'> Minka Luxury HAIR</span>
                        </h1>
                    </div>
                    
                    <p className='text-[16px] md:text-[18px] text-gray-600 leading-relaxed max-w-lg'>
                        Discover our exquisite collection of 100% human hair wigs, extensions, and closures. 
                        Each strand is carefully selected to ensure the highest quality, giving you the 
                        confidence to slay every day.
                    </p>
                    
                    <div className='flex flex-wrap gap-4'>
                        <button onClick={() => navigate('/shop')} className="group relative px-8 py-4 bg-black text-white rounded-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
                            <span className="absolute inset-0 bg-gradient-to-r from-[#9b83a3] to-[#8c6020] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            <span className="relative z-10 font-medium">Shop Collection →</span>
                        </button>
                    </div>
                    
                    {/* Stats */}
                    <div className='flex flex-wrap gap-8 pt-4'>
                        <div className='text-center md:text-left'>
                            <h2 className='text-[24px] md:text-3xl font-bold' style={{ color: '#9b83a3' }}>500+</h2>
                            <p className='text-sm text-gray-500'>Hair Styles</p>
                        </div>
                        <div className='text-center md:text-left'>
                            <h2 className='text-[24px] md:text-3xl font-bold' style={{ color: '#9b83a3' }}>10K+</h2>
                            <p className='text-sm text-gray-500'>Happy Customers</p>
                        </div>
                        <div className='text-center md:text-left'>
                            <h2 className='text-[24px] md:text-3xl font-bold' style={{ color: '#9b83a3' }}>100%</h2>
                            <p className='text-sm text-gray-500'>Virgin Human Hair</p>
                        </div>
                    </div>
                </div>
                
                {/* Right Side - Carousel with Diagonal Shape */}
                <div className='w-full relative'>
                    {/* Carousel Controls - Top Right */}
                    <div className='absolute -top-12 right-0 flex gap-3 z-20'>
                        {carouselImages.map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => handleDotClick(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    currentImageIndex === index 
                                        ? 'w-8 bg-[#9b83a3]' 
                                        : 'bg-gray-300 hover:bg-gray-400'
                                }`}
                            />
                        ))}
                    </div>
                    
                    {/* Shape Selector - Bottom Right */}
                    <div className='absolute -bottom-12 right-0 flex gap-2 z-20'>
                        <button 
                            onClick={() => handleShapeClick('diagonal', 0)}
                            className={`w-8 h-8 rounded-full transition-all duration-300 ${
                                imageStyle === 'diagonal' 
                                    ? 'bg-[#9b83a3] scale-110' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            title="Diagonal Shape"
                        />
                        <button 
                            onClick={() => handleShapeClick('slant', 1)}
                            className={`w-8 h-8 rounded-full transition-all duration-300 ${
                                imageStyle === 'slant' 
                                    ? 'bg-[#9b83a3] scale-110' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            title="Slant Shape"
                        />
                        <button 
                            onClick={() => handleShapeClick('parallelogram', 2)}
                            className={`w-8 h-8 rounded-full transition-all duration-300 ${
                                imageStyle === 'parallelogram' 
                                    ? 'bg-[#9b83a3] scale-110' 
                                    : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                            title="Parallelogram Shape"
                        />
                    </div>
                    
                    <div className='relative w-full max-w-[550px] mx-auto'>
                        {/* Animated background shapes */}
                        <div className='absolute -top-8 -left-8 w-32 h-32 bg-[#9b83a3]/20 rounded-full animate-pulse'></div>
                        <div className='absolute -bottom-8 -right-8 w-40 h-40 bg-[#8c6020]/20 rounded-full animate-pulse delay-1000'></div>
                        
                        {/* Main diagonal image container */}
                        <div className='relative group'>
                            {/* Shadow layers */}
                            <div 
                                className='absolute inset-0 bg-gradient-to-br from-[#9b83a3] to-[#8c6020] rounded-3xl transition-all duration-500'
                                style={{ transform: 'rotate(3deg) translate(10px, 10px)' }}
                            ></div>
                            
                            {/* Image container with clip-path */}
                            <div 
                                className={`relative overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 group-hover:shadow-3xl ${
                                    isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
                                }`}
                                style={{ clipPath: getClipPath() }}
                            >
                                <img 
                                    src={carouselImages[currentImageIndex].url} 
                                    className='w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110' 
                                    alt={carouselImages[currentImageIndex].alt}
                                />
                                
                                {/* Image Info Overlay */}
                                <div className='absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500'>
                                    <p className='text-white font-bold text-lg'>
                                        {carouselImages[currentImageIndex].title}
                                    </p>
                                    <p className='text-white/80 text-sm'>
                                        {carouselImages[currentImageIndex].description}
                                    </p>
                                </div>
                                
                                {/* Gradient overlay on hover */}
                                <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500'></div>
                            </div>
                            
                            {/* Decorative badge */}
                            <div className='absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg transform transition-transform group-hover:scale-110'>
                                <div className='w-12 h-12 bg-gradient-to-br from-[#9b83a3] to-[#8c6020] rounded-full flex items-center justify-center'>
                                    <span className='text-white text-xs font-bold text-center leading-tight'>
                                        {currentImageIndex + 1}/{carouselImages.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Navigation Arrows */}
                    <button 
                        onClick={() => handleImageChange((currentImageIndex - 1 + carouselImages.length) % carouselImages.length)}
                        className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-[#9b83a3] hover:text-white transition-all duration-300 z-20'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button 
                        onClick={() => handleImageChange((currentImageIndex + 1) % carouselImages.length)}
                        className='absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 bg-white rounded-full p-2 shadow-lg hover:bg-[#9b83a3] hover:text-white transition-all duration-300 z-20'
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        
        <style jsx>{`
            @keyframes slideInLeft {
                from {
                    opacity: 0;
                    transform: translateX(-50px);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }
            
            .animate-slideInLeft {
                animation: slideInLeft 0.8s ease-out;
            }
        `}</style>
    </div>
  )
}

export default Hero
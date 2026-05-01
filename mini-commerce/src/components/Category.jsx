import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos'  // Changed from 'Aos' to 'AOS'
import 'aos/dist/aos.css'

const Category = () => {

    useEffect(() => {
    AOS.init({
      duration: 1000,      
      easing: 'ease-in-out', 
      once: true,          
      mirror: false,       
      offset: 120,         
    });
  }, []);

  const categories = [
    {
      name: 'WIGS',
      slug: 'wigs',
      description: 'Lace front, full lace, 360 lace',
      image: '/image1.jpg',
      color: '#9b83a3'
    },
    {
      name: 'EXTENSIONS',
      slug: 'extensions',
      description: 'Bundles, weft, tape-in',
      image: '/image2.jpg',
      color: '#8c6020'
    },
    {
      name: 'CLOSURES',
      slug: 'closures',
      description: 'Lace closure, silk base',
      image: '/image3.jpg',
      color: '#9b83a3'
    },
    {
      name: 'FRONTALS',
      slug: 'frontals',
      description: 'HD lace, transparent lace',
      image: '/image4.jpg',
      color: '#8c6020'
    }
  ]

  const hairTypes = [
    { name: 'Straight Hair', slug: 'straight', image: '/image1.jpg' },
    { name: 'Curly Hair', slug: 'curly', image: '/image2.jpg' },
    { name: 'Wavy Hair', slug: 'wavy', image: '/image3.jpg' },
    { name: 'Kinky Hair', slug: 'kinky', image: '/image4.jpg' }
  ]

  return (
    <div data-aos="zoom-in" className='w-full py-[50px] px-[20px] md:px-[7%] bg-gradient-to-br from-gray-50 to-purple-50'>
      {/* Header Section */}
      <div className='text-center mb-12'>
        <h1 className='text-3xl md:text-[48px] font-bold mb-4' style={{ color: '#9b83a3' }}>
          BROWSE BY HAIR STYLE
        </h1>
        <p className='text-gray-600 text-lg max-w-2xl mx-auto'>
          Find the perfect hair solution for your style and needs
        </p>
      </div>

      {/* Main Categories Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-12'>
        {categories.map((category, index) => (
          <Link 
            to={`/shop?category=${category.slug}`} 
            key={index}
            className='block group'
          >
            <div className='relative overflow-hidden rounded-2xl h-[320px] md:h-[380px] shadow-xl'>
              {/* Background Image */}
              <div 
                className='absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-110'
                style={{ backgroundImage: `url(${category.image})` }}
              />
              
              {/* Gradient Overlay */}
              <div 
                className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30 transition-opacity duration-300 group-hover:bg-black/60'
              />
              
              {/* Content Overlay */}
              <div className='relative h-full flex flex-col justify-end p-8 text-white'>
                <div className='transform transition-all duration-300 group-hover:translate-y-[-10px]'>
                  <div className='text-5xl mb-3 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12 inline-block'>
                    {category.icon}
                  </div>
                  <h2 className='text-3xl md:text-4xl font-bold mb-2'>
                    {category.name}
                  </h2>
                  <p className='text-white/90 text-base md:text-lg mb-4 max-w-md'>
                    {category.description}
                  </p>
                  <div className='flex items-center gap-2 text-white/80 font-medium group-hover:text-white transition-colors duration-300'>
                    <span>Shop Collection</span>
                    <svg className="w-5 h-5 transform transition-transform duration-300 group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Hair Type Categories */}
      <div className='mt-16'>
        <div className='text-center mb-8'>
          <h2 className='text-2xl md:text-3xl font-bold mb-2' style={{ color: '#8c6020' }}>
            Shop by Texture
          </h2>
          <p className='text-gray-500'>Find your perfect hair texture</p>
        </div>
        
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {hairTypes.map((type, idx) => (
            <Link 
              key={idx} 
              to={`/shop?type=${type.slug}`}
              className='group'
            >
              <div className='relative overflow-hidden rounded-xl h-40 shadow-md'>
                {/* Background Image */}
                <div 
                  className='absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110'
                  style={{ backgroundImage: `url(${type.image})` }}
                />
                
                {/* Gradient Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent' />
                
                {/* Text Overlay */}
                <div className='relative h-full flex items-end justify-center p-4'>
                  <p className='text-white font-bold text-lg text-center group-hover:scale-105 transition-transform duration-300'>
                    {type.name}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Banner */}
      <div className='mt-16 bg-gradient-to-r from-[#9b83a3] to-[#8c6020] rounded-2xl p-8 text-center'>
        <h3 className='text-2xl md:text-3xl font-bold text-white mb-3'>
          Can't find what you're looking for?
        </h3>
        <p className='text-white/90 mb-4'>
          Contact our hair experts for personalized recommendations
        </p>
        <button onClick={() => window.location.href='https://wa.me/message/DSAULOSKOI4XG1'} className='bg-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg' style={{ color: '#8c6020' }}>
          Chat with Expert →
        </button>
      </div>
    </div>
  )
}

export default Category
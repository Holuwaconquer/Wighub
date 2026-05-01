import React, { useRef } from 'react'
import ProductCard from './ProductCard'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const FeaturedListings = () => {
  const navigate = useNavigate()
  const scrollContainerRef = useRef(null)

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  const featuredProducts = [
    {
      id: 1,
      name: '5by5 Closure Wig',
      price: 888000,
      originalPrice: 890000,
      rating: 4.8,
      reviews: 124,
      image: 'https://instagram.fiba2-1.fna.fbcdn.net/v/t51.82787-15/574494061_17892689889358662_5560864904633900232_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=103&ig_cache_key=Mzc1NzY2MDQ1MjU3MDcyMjEzOQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjEyNDJ4MTY1Ni5zZHIuQzMifQ%3D%3D&_nc_ohc=t6saoWVnxFIQ7kNvwF5titl&_nc_oc=AdowvAfJCSnj97J8YOOYSxTj2ZkxL2Cpk0ntvkO02ED0Xvd33kRD48q5Cu1t19yT_4k&_nc_ad=z-m&_nc_cid=1080&_nc_zt=23&_nc_ht=instagram.fiba2-1.fna&_nc_gid=UVseGh5R7NsyPn9fg7l4zg&_nc_ss=7a22e&oh=00_Af4hSmzzzUX9PXdF0qHgFZJE4OZ-bUrJwL42F4Ew_IrZZA&oe=69FA666F',
      isBestSeller: true
    },
    {
      id: 2,
      name: '28 inches Bone Straight 300grams 5by5 closure',
      price: 850000,
      originalPrice: 950000,
      rating: 4.7,
      reviews: 89,
      image: 'https://instagram.fiba2-2.fna.fbcdn.net/v/t51.75761-15/475463361_17858014128358662_5976854688437826984_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=104&ig_cache_key=MzU1NjEyOTkyNTE0NjgwOTAzNw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0MTd4MTc3MS5oZHIuQzMifQ%3D%3D&_nc_ohc=AWfJIFAmgdcQ7kNvwF9lnHI&_nc_oc=Adpm4O7x97HpTXzpI5wYq6aAq0ipZnmm7xuEORRCePGwP9mSzAVvymKlMA8JGSRhlC8&_nc_ad=z-m&_nc_cid=1080&_nc_zt=23&se=-1&_nc_ht=instagram.fiba2-2.fna&_nc_gid=O6f2MJwv8nJdtAhUoeN_jw&_nc_ss=7a22e&oh=00_Af6AVIBJObK9BUe1hoRJ1A7zNK3b5P46BZJkX09GgSbC0w&oe=69FA8D0B',
      isNew: true
    },
    {
      id: 3,
      name: '\n"22"\n \n"20"\n \n"18"\n inches 300grams 5by5 closure',
      price: 519000,
      originalPrice: 600000,
      rating: 4.9,
      reviews: 203,
      image: 'https://instagram.fiba2-1.fna.fbcdn.net/v/t51.82787-15/656269336_18089689387923229_6604080724429758439_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=103&ig_cache_key=MzUxNjM1Mzk5ODAxOTk0MjM2NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=U6PNqoYWZG0Q7kNvwHcH8cj&_nc_oc=Adr7KLsDX6pTEqwvVh4D4mjJnBXrkMyXSJP4t5ZF0WC0SEGwy_vFhG-gJzl7tjYoZhE&_nc_ad=z-m&_nc_cid=1080&_nc_zt=23&se=-1&_nc_ht=instagram.fiba2-1.fna&_nc_gid=PmWPJnLPHeTz8u3ywS79Sg&_nc_ss=7a22e&oh=00_Af4iLtmluhyG5zWDvfVP_PcORhBYwpmOtjJ8OkDd5MxVOw&oe=69FA5CC7',
      isLimited: true
    },
    {
      id: 4,
      name: 'Donor 100% virgin hair extensions Dark brown bone straight 16 inches 300gram',
      price: 920000,
      originalPrice: 1100000,
      rating: 4.9,
      reviews: 312,
      image: 'https://instagram.fiba2-1.fna.fbcdn.net/v/t51.82787-15/656275730_18062806754418706_5131514181882511479_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzUwMzE4NDEwMTQyMTI1OTE4Mg%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTc5OS5zZHIuQzMifQ%3D%3D&_nc_ohc=sPGGjTA1GUoQ7kNvwEDkdQx&_nc_oc=AdpOUhTXVxz90ar21WJrXWqm2-TG0G8IB2udSjuvWXrYgi4SA904qwCqPJUqDd6oKnY&_nc_ad=z-m&_nc_cid=1080&_nc_zt=23&_nc_ht=instagram.fiba2-1.fna&_nc_gid=M3jXS1JPHyum8IWwtV4CIw&_nc_ss=7a22e&oh=00_Af7aZf03uSV0aYwjl0DutqhxHfbLDemy42r2sZiqCb2XwA&oe=69FA8582',
      isBestSeller: true
    },
    {
      id: 5,
      name: 'Donor 100% virgin hair extensions Light brown bone straight 14 inches 200gram Closure 5x5',
      price:  315000,
      originalPrice: 375000,
      rating: 4.6,
      reviews: 67,
      image: 'https://instagram.fiba2-3.fna.fbcdn.net/v/t51.82787-15/662354199_18070525769299612_6878234054656361237_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=108&ig_cache_key=MzUwMTIwMTIyMzcyODYxMjk0OQ%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=xvTipfPiLR4Q7kNvwHM3At1&_nc_oc=AdruMGV-N5GGt1nq7UUH_tL_GTAyA0xHxKJTAIgwUOI_jcCAIycjHbGA8YdYyGZ6ds0&_nc_ad=z-m&_nc_cid=1080&_nc_zt=23&se=-1&_nc_ht=instagram.fiba2-3.fna&_nc_gid=M3jXS1JPHyum8IWwtV4CIw&_nc_ss=7a22e&oh=00_Af47mZSxtVYmtbahPe5_W3WwmxNi37m6vi2kpgCkJXcuEw&oe=69FA8791'
    },
    {
      id: 6,
      name: 'Burn orange 🍊 luxury hair 14 inches 229ram Closure 5x5',
      price: 380000,
      rating: 4.8,
      reviews: 156,
      image: 'https://instagram.fiba2-3.fna.fbcdn.net/v/t51.82787-15/658901663_18118461871564553_5213625660316798360_n.jpg?stp=dst-jpegr_e35_tt6&_nc_cat=102&ig_cache_key=MzUyNjM2MTkwNTgyMjMzNzM0OA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6InhwaWRzLjE0NDB4MTgwMC5oZHIuQzMifQ%3D%3D&_nc_ohc=TJOsL3BL5M8Q7kNvwEhxMyj&_nc_oc=AdqH8jX4Sxg7IxrkK-5NRCZtqEQmSh_iercRUMvYPmSmmem_AboAO6yXICZjlDcLP_k&_nc_ad=z-m&_nc_cid=1080&_nc_zt=23&se=-1&_nc_ht=instagram.fiba2-3.fna&_nc_gid=PmWPJnLPHeTz8u3ywS79Sg&_nc_ss=7a22e&oh=00_Af45xKoEgj6xB83LT3TN7gkHzb8Mt4winFVfJxutGxVVCg&oe=69FA84CD',
      isNew: true
    }
  ]

  return (
    <div className='w-full py-[50px] px-[20px] md:px-[7%] bg-white'>
      {/* Header Section */}
      <div className='flex flex-col md:flex-row justify-between items-center mb-8 gap-4'>
        <div>
          <h1 className='text-3xl md:text-[48px] font-extrabold' style={{ color: '#9b83a3' }}>
            FEATURED LISTINGS
          </h1>
          <p className='text-gray-500 mt-2'>Discover our most popular hair collections</p>
        </div>
        
        {/* Desktop Navigation Arrows */}
        <div className='hidden md:flex gap-3'>
          <button 
            onClick={() => scroll('left')}
            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b83a3] hover:text-white hover:border-[#9b83a3] transition-all duration-300'
          >
            <FaArrowLeft />
          </button>
          <button 
            onClick={() => scroll('right')}
            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-[#9b83a3] hover:text-white hover:border-[#9b83a3] transition-all duration-300'
          >
            <FaArrowRight />
          </button>
        </div>
      </div>

      {/* Products Container - No visible scrollbar */}
      <div 
        ref={scrollContainerRef}
        className='w-full flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {featuredProducts.map((product) => (
          <div key={product.id} className="min-w-[280px] md:min-w-0 snap-center">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Mobile Navigation Dots */}
      <div className='flex md:hidden justify-center gap-2 mt-6'>
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            className='w-2 h-2 rounded-full bg-gray-300 hover:bg-[#9b83a3] transition-colors'
            onClick={() => {
              if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTo({
                  left: index * 300,
                  behavior: 'smooth'
                })
              }
            }}
          />
        ))}
      </div>

      {/* View All Button */}
      <div className='w-full flex justify-center mt-8'>
        <button onClick={() => navigate('/shop')} className='group relative px-8 py-3 border-2 rounded-full overflow-hidden transition-all duration-300 hover:text-white! hover:scale-105'
          style={{ borderColor: '#9b83a3', color: '#9b83a3' }}>
          <span className="relative z-10 font-medium">View All Products</span>
          <span className="absolute inset-0 bg-gradient-to-r from-[#9b83a3] to-[#8c6020] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
        </button>
      </div>

      {/* Add custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default FeaturedListings
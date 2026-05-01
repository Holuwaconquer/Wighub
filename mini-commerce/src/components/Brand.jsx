import React, { useEffect } from 'react'
import { TbTruckDelivery } from 'react-icons/tb'
import { RiCustomerService2Fill } from 'react-icons/ri'
import { MdVerified } from 'react-icons/md'
import { FaShieldAlt, FaStar } from 'react-icons/fa'
import { GiReturnArrow } from 'react-icons/gi'
import AOS from 'aos' 
import 'aos/dist/aos.css'


const WhyChooseUs = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,      
      easing: 'ease-in-out',      
      mirror: false,       
      offset: 120,         
    });
  }, []);

  const benefits = [
    {
      icon: <TbTruckDelivery className="text-2xl" />,
      title: "100% Human Hair",
      description: "Premium virgin quality"
    },
    {
      icon: <TbTruckDelivery className="text-2xl" />,
      title: "Free Shipping",
      description: "Fast worldwide delivery"
    },
    {
      icon: <RiCustomerService2Fill className="text-2xl" />,
      title: "24/7 Support",
      description: "Hair experts available"
    },
    {
      icon: <GiReturnArrow className="text-2xl" />,
      title: "Easy Returns",
      description: "30-day guarantee"
    },
    {
      icon: <MdVerified className="text-2xl" />,
      title: "Quality Checked",
      description: "Hand-inspected bundles"
    },
    {
      icon: <FaShieldAlt className="text-2xl" />,
      title: "Secure Payment",
      description: "100% safe checkout"
    },
    {
      icon: <FaStar className="text-2xl" />,
      title: "4.9 Rating",
      description: "From 10K+ customers"
    }
  ]

  // Double the array for continuous scroll
  const scrollingBenefits = [...benefits, ...benefits]

  return (
    <div data-aos="fade-up" className='w-full bg-gradient-to-r from-[#9b83a3] to-[#8c6020] overflow-hidden'>
      {/* Mobile Horizontal Scrolling Ticker */}
      <div className='md:hidden relative'>
        <div className='flex overflow-hidden py-4'>
          <div className='flex animate-scroll-ticker'>
            {scrollingBenefits.map((benefit, index) => (
              <div 
                key={index}
                className='flex items-center gap-3 mx-2 px-5 py-2.5 bg-white/15 rounded-full'
              >
                <span className='text-white text-xl'>{benefit.icon}</span>
                <span className='text-white font-semibold text-sm whitespace-nowrap'>
                  {benefit.title}
                </span>
                <span className='text-white/70 text-xs whitespace-nowrap'>
                  {benefit.description}
                </span>
                <span className='text-white/30 mx-1'>✦</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Grid */}
      <div className='hidden md:block py-[50px] px-[7%]'>
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 max-w-7xl mx-auto'>
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className='flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all duration-300'
            >
              <div className='text-white bg-white/20 p-2 rounded-lg'>
                {benefit.icon}
              </div>
              <div>
                <p className='font-semibold text-white text-sm'>{benefit.title}</p>
                <p className='text-white/70 text-xs'>{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-ticker {
          animation: ticker 20s linear infinite;
          width: max-content;
        }
        
        .animate-scroll-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}

export default WhyChooseUs
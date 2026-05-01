import React from 'react'
import { Link } from 'react-router-dom'
import visa from '/visa.png'
import mastercard from '/mastercard.png'
import paypal from '/paypal.png'
import applepay from '/applepay.png'
import googlepay from '/googlepay.png'

const Footer = () => {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <div className='w-full pt-[5%]  flex flex-col gap-4 justify-center items-center bg-gradient-to-br from-purple-100 to-pink-100'>

      <div className='w-full py-[3%] px-[7%] flex flex-col md:flex-row items-start justify-between border-b-2 border-[#0000001A]'>
        {/* for footer logo */}
        <div className='w-full flex flex-col gap-4 mb-4'>
          <h1 onClick={() => window.location.href = '/'} 
              className='text-2xl md:text-3xl lg:text-[32px] font-bold cursor-pointer hover:opacity-80 transition-opacity '
              style={{ color: '#9b83a3' }}>MINKA LUXURY HAIR
          </h1>
          <p className='text-[14px] w-full md:w-3/4 text-[#00000099]'>Premium, Donor 100% Virgin Hair Extensions Luxury bundles, wigs & custom units DM for inquiries, worldwide shipping.</p>

          <svg width="0" height="0" style={{ position: "absolute" }}>
            <defs>
              <clipPath id="squircleClip" clipPathUnits="objectBoundingBox">
                <path d="M 0,0.5 C 0,0 0,0 0.5,0 S 1,0 1,0.5 1,1 0.5,1 0,1 0,0.5"></path>
              </clipPath>
            </defs>
          </svg>

          <div className="relative">
            <div
              className="absolute"
            ></div>

            <div className="relative flex items-end gap-x-3">
              {/* Facebook */}
              <div className="relative">
                <a
                  href="https://facebook.com/minkaluxuryhair"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ clipPath: "url(#squircleClip)" }}
                  className="w-10 h-10 bg-gradient-to-br from-[#1877f2] to-[#0c63d4] rounded-xl flex items-center justify-center shadow-lg border border-[#1877f2]/50 cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
                </a>
              </div>

              {/* Instagram */}
              <div className="relative">
                <a
                  href="https://www.instagram.com/minkaluxuryhair"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ clipPath: "url(#squircleClip)" }}
                  className="w-10 h-10 bg-gradient-to-br from-[#f09433] via-[#d62976] to-[#962fbf] rounded-xl flex items-center justify-center shadow-lg border border-[#d62976]/50 cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM12 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>

              {/* WhatsApp */}
              <div className="relative">
                <a
                  href="https://wa.me/message/DSAULOSKOI4XG1" // Replace with your WhatsApp number
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ clipPath: "url(#squircleClip)" }}
                  className="w-10 h-10 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-xl flex items-center justify-center shadow-lg border border-[#25D366]/50 cursor-pointer transform transition-all duration-300 ease-out hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-8 w-8 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M20.52 3.48A11.93 11.93 0 0 0 12.04 0C5.66 0 .31 5.34.31 11.72c0 2.06.54 4.08 1.56 5.86L0 24l6.61-1.74c1.72.94 3.67 1.43 5.66 1.43 6.38 0 11.73-5.34 11.73-11.72 0-3.12-1.22-6.06-3.48-8.32zM12.04 21.4c-1.77 0-3.51-.48-5.02-1.38l-.36-.21-3.92 1.03 1.05-3.82-.23-.38c-1.02-1.61-1.56-3.46-1.56-5.36 0-5.48 4.46-9.94 9.94-9.94 2.65 0 5.14 1.03 7.01 2.91 1.88 1.88 2.91 4.36 2.91 7.01a9.94 9.94 0 0 1-9.94 9.94z"/>
                    <path d="M16.98 13.68c-.27-.13-1.62-.8-1.87-.89-.25-.09-.43-.13-.61.13-.18.26-.71.89-.87 1.07-.16.18-.32.2-.59.07-.27-.13-1.14-.42-2.16-1.33-.8-.72-1.33-1.58-1.48-1.86-.16-.28-.02-.42.12-.56.12-.12.27-.32.41-.48.14-.16.18-.28.27-.46.09-.18.05-.34-.03-.47-.09-.14-.61-1.47-.84-2.01-.22-.53-.44-.46-.61-.47-.18 0-.38-.01-.58-.01-.2 0-.52.08-.8.39-.28.31-1.07 1.05-1.07 2.55 0 1.5 1.09 2.95 1.24 3.16.16.21 2.14 3.36 5.24 4.57 3.1 1.21 3.1.81 3.66.76.56-.05 1.8-.74 2.05-1.45.25-.71.25-1.32.18-1.45-.07-.13-.27-.2-.54-.33z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>  
        </div>

        {/* for help links */}
        <div className='w-full flex flex-col gap-1 mb-4'>
          <h2 className='text-[16px] font-medium'>HELP</h2>
          <div className='flex flex-col gap-2 text-[#00000099]'>
            <Link to='/about' className='text-[16px] font-medium'>Customer Support</Link>
            <Link to='/feature' className='text-[16px] font-medium'>Delivery Details</Link>
            <Link to='/privacy' className='text-[16px] font-medium'>Terms & Conditions</Link>
            <Link to='/privacy' className='text-[16px] font-medium'>Privacy Policy</Link>
          </div>
        </div>
        {/* for FAQ */}
        <div className='w-full flex flex-col gap-1 mb-4'>
          <h2 className='text-[16px] font-medium'>FAQ</h2>
          <div className='flex flex-col gap-2 text-[#00000099]'>
            <Link to='/about' className='text-[16px] font-medium'>Account</Link>
            <Link to='/feature' className='text-[16px] font-medium'>Managing Deliveries</Link>
            <Link to='/privacy' className='text-[16px] font-medium'>Orders</Link>
            <Link to='/privacy' className='text-[16px] font-medium'>Payments</Link>
          </div>
        </div>

      </div>
      {/* for all rights reserved */}
      <div className='w-full pb-[15px] px-[7%] flex flex-col md:flex-row justify-center md:justify-between items-center'>
        <p className='w-full'>MINKA LUXURY HAIR © {year}, All Rights Reserved</p>
        <div className="w-full flex gap-4 justify-center md:justify-end items-center">
          <img src={visa} alt="Visa" className="h-8 w-auto" />
          <img src={mastercard} alt="Mastercard" className="h-8 w-auto" />
          <img src={paypal} alt="PayPal" className="h-8 w-auto" />
          <img src={applepay} alt="Apple Pay" className="h-8 w-auto" />
          <img src={googlepay} alt="Google Pay" className="h-8 w-auto" />
        </div>
      </div>
    </div>
  )
}

export default Footer
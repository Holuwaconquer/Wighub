import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'
import SEO from '../components/SEO'

const HomePage = () => {
  return (
    <div>
        <SEO
          title={`Minka Luxury Hair | Premium Wigs & Extensions`}
          description={`Shop premium wigs, closures, frontals and extensions at Minka Luxury Hair. Luxury quality, fast shipping.`}
          url={`https://minkaluxury.com/`}
        />
        <Navbar />

        <Outlet />
        <Newsletter />
        <Footer />
    </div>
  )
}

export default HomePage
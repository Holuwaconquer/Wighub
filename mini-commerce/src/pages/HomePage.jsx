import React from 'react'
import Navbar from '../components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer'
import Newsletter from '../components/Newsletter'

const HomePage = () => {
  return (
    <div>
        <Navbar />

        <Outlet />
        <Newsletter />
        <Footer />
    </div>
  )
}

export default HomePage
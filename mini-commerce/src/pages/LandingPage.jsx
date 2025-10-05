import React from 'react'
import Hero from '../components/Hero'
import Brand from '../components/Brand'
import NewArrival from '../components/NewArrival'
import TopSelling from '../components/TopSelling'
import Category from '../components/Category'
import Newsletter from '../components/Newsletter'
import CustomerReview from '../components/CustomerReview'

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <Brand />
      <NewArrival />
      <TopSelling />
      <Category />
      <CustomerReview />
      <Newsletter />
    </div>
  )
}

export default LandingPage
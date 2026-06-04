import React from 'react'
import Hero from '../components/Hero'
import Brand from '../components/Brand'
import Category from '../components/Category'
import CustomerReview from '../components/CustomerReview'
import FeaturedListings from '../components/FeaturedListings'
import BestDeal from '../components/BestDeal'

const LandingPage = () => {
  return (
    <div>
      <Hero />
      <FeaturedListings />
      <Brand />
      <BestDeal />
      <Category />
      <CustomerReview />
      
    </div>
  )
}

export default LandingPage
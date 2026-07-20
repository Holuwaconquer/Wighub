import React, { useEffect, useState } from "react";
import Hero from "../components/Hero";
import Brand from "../components/Brand";
import Category from "../components/Category";
import CustomerReview from "../components/CustomerReview";
import FeaturedListings from "../components/FeaturedListings";
import BestDeal from "../components/BestDeal";
import Loader from "../components/Loader";

const LandingPage = () => {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowLoader(false), 2200);
    return () => clearTimeout(t);
  }, []);

  if (showLoader) return <Loader subtitle="Minka Luxury Hair" />;

  return (
    <div>
      <Hero />
      <FeaturedListings />
      <Brand />
      <BestDeal />
      <Category />
      <CustomerReview />
    </div>
  );
};

export default LandingPage;

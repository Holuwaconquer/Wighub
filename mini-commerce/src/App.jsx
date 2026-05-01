import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ShopPage from './pages/ShopPage'
import ScrollToTop from './ScrollToTop'
import AOS from 'aos' 
import 'aos/dist/aos.css'

const App = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,      
      easing: 'ease-in-out', 
      once: true,          
      mirror: false,       
      offset: 120,         
    });
  }, []);

  return (
    <>
    <ScrollToTop />
      <Routes>
        {/* routes for landing page */}
        <Route path='/' element={<HomePage />}>
          <Route index element={<LandingPage />} />
          <Route path='/shop' element={<ShopPage />} />
        </Route>
        {/* other routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>

      <a
        href='https://wa.me/message/DSAULOSKOI4XG1'
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-4 left-7 z-100 bg-[#25D366] hover:bg-[#1ebe5d] mr-2 text-white p-4 rounded-full shadow-lg transition-colors"
        title="Contact us on WhatsApp"
      >
        <span className="sr-only">WhatsApp</span>
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.1-.472-.149-.672.15-.199.297-.768.967-.94 1.165-.173.199-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.133-.132.297-.347.446-.52.149-.173.198-.298.298-.497.1-.199.05-.373-.025-.522-.075-.148-.672-1.612-.921-2.209-.242-.579-.487-.5-.672-.51l-.573-.01c-.199 0-.522.074-.795.373s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.414.248-.694.248-1.289.173-1.414-.074-.124-.273-.198-.57-.347z" />
          <path d="M12.001 2.003c-5.523 0-10 4.477-10 10 0 1.767.462 3.498 1.337 5.02l-1.38 5.032 5.16-1.356c1.4.764 2.985 1.171 4.882 1.171 5.523 0 10-4.477 10-10s-4.477-10-10-10zm0 18.17c-1.53 0-2.992-.406-4.224-1.16l-.302-.18-3.062.805.817-2.986-.196-.307c-.863-1.345-1.318-2.886-1.318-4.372 0-4.524 3.677-8.2 8.2-8.2 4.523 0 8.2 3.676 8.2 8.2 0 4.523-3.677 8.2-8.2 8.2z" />
        </svg>
      </a>
    </>
  )
}

export default App
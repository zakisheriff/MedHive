import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/global.css';

// Components
import Navbar from './components/Navbar/Navbar';
import MobileMenu from './components/MobileMenu/MobileMenu';
import Footer from './components/Footer/Footer';
import SplashScreen from './components/SplashScreen/SplashScreen';


// Pages
import LandingPage from './pages/LandingPage';
import PrivacyPolicy from './pages/Legal/PrivacyPolicy';
import TermsOfService from './pages/Legal/TermsOfService';
import AboutUs from './pages/AboutUs/AboutUs';

const MOBILE_BREAKPOINT = 900;

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppContent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();


  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setMobileMenuOpen(false);
  };

  // Logo click handler
  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      window.location.href = '/';
      return;
    }

    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      scrollToTop();
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Resize effect
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Splash screen timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => {
        setLoading(false);
      }, 800); // Match CSS transition duration
    }, 1500); // Simple 1.5s delay
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen isExiting={isExiting} />;
  }


  return (
    <div className="app page-fade-in">
      <ScrollToTop />
      {/* <Navbar scrolled={scrolled} onLogoClick={handleLogoClick} /> */}

      {/* 
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onScrollToTop={scrollToTop}
      /> 
      */}

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/about-us" element={<AboutUs />} />
      </Routes>

      {/* <Footer onScrollToTop={scrollToTop} /> */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
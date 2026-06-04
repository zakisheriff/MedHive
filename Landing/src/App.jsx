import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ReactLenis, useLenis } from 'lenis/react';
import 'lenis/dist/lenis.css';
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
import Blog from './pages/Blog/Blog';
import Blog2 from './pages/Blog/Blog2';
import Blog3 from './pages/Blog/Blog3';
import BlogList from './pages/Blog/BlogList';

const MOBILE_BREAKPOINT = 900;

function ScrollToTop() {
  const { pathname } = useLocation();
  const lenis = useLenis();

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, lenis]);

  return null;
}

function AppContent() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);
  const [loading, setLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const location = useLocation();


  const lenis = useLenis();

  // Scroll to top function
  const scrollToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
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

  // Scroll effect using Lenis
  useLenis((lenisInstance) => {
    const isScrolled = lenisInstance.scroll > 50;
    setScrolled(prev => prev !== isScrolled ? isScrolled : prev);
  });

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
      <Navbar scrolled={scrolled} onLogoClick={handleLogoClick} />

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onScrollToTop={scrollToTop}
      />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/digital-prescriptions-sri-lanka" element={<Blog />} />
        <Route path="/blog/private-clinics-digital-records-2026" element={<Blog2 />} />
        <Route path="/blog/medication-errors-digital-prevention" element={<Blog3 />} />
      </Routes>

      <Footer onScrollToTop={scrollToTop} />
    </div>
  );
}

function App() {
  return (
    <ReactLenis root>
      <Router>
        <AppContent />
      </Router>
    </ReactLenis>
  );
}

export default App;
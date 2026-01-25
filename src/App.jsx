import React, { useEffect, useState } from 'react';
import './styles/global.css';

// Components
import Navbar from './components/Navbar/Navbar';
import MobileMenu from './components/MobileMenu/MobileMenu';
import Hero from './components/Hero/Hero';
import ProblemSection from './components/ProblemSection/ProblemSection';
import SolutionSection from './components/SolutionSection/SolutionSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import HowItWorks from './components/HowItWorks/HowItWorks';
import TeamSection from './components/TeamSection/TeamSection';
import CTASection from './components/CTASection/CTASection';
import Footer from './components/Footer/Footer';

const MOBILE_BREAKPOINT = 900;

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= MOBILE_BREAKPOINT);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
    setMobileMenuOpen(false);
  };

  // Logo click handler - toggle menu on mobile, scroll to top on desktop
  const handleLogoClick = () => {
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

  // Resize effect for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app">
      <Navbar scrolled={scrolled} onLogoClick={handleLogoClick} />

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={closeMobileMenu}
        onScrollToTop={scrollToTop}
      />

      <Hero />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <HowItWorks />
      <TeamSection />
      <CTASection />
      <Footer onScrollToTop={scrollToTop} />
    </div>
  );
}

export default App;
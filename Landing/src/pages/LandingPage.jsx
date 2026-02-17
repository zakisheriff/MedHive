import React, { useState, Suspense, lazy } from 'react';
// import CountdownClock from '../components/CountdownClock/CountdownClock';
import Hero from '../components/Hero/Hero';

// Lazy load components below the fold
const ProblemSection = lazy(() => import('../components/ProblemSection/ProblemSection'));
const SolutionSection = lazy(() => import('../components/SolutionSection/SolutionSection'));
const FeaturesSection = lazy(() => import('../components/FeaturesSection/FeaturesSection'));
const TeamSection = lazy(() => import('../components/TeamSection/TeamSection'));
const CTASection = lazy(() => import('../components/CTASection/CTASection'));

const LandingPage = () => {
    const [mockupFocusTrigger, setMockupFocusTrigger] = useState(0);

    const handleCTAClick = () => {
        if (window.innerWidth <= 900) {
            // Scroll to Hero mockup target on mobile
            const element = document.getElementById('hero-mockup-target');
            if (element) {
                const yOffset = -180;
                const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        } else {
            // Scroll to top on desktop
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Trigger focus effect in Hero component
        setMockupFocusTrigger(prev => prev + 1);
    };

    return (
        <main>
            {/* <CountdownClock targetDate="2026-02-08T18:00:00" /> */}
            <Hero focusTrigger={mockupFocusTrigger} />
            <Suspense fallback={<div style={{ height: '50vh' }}></div>}>
                <ProblemSection />
                <SolutionSection />
                <FeaturesSection />
                <TeamSection />
                <CTASection onCTAClick={handleCTAClick} />
            </Suspense>
        </main >
    );
};

export default LandingPage;

import React, { useState } from 'react';
import CountdownClock from '../components/CountdownClock/CountdownClock';
// import Hero from '../components/Hero/Hero';
// import ProblemSection from '../components/ProblemSection/ProblemSection';
// import SolutionSection from '../components/SolutionSection/SolutionSection';
// import FeaturesSection from '../components/FeaturesSection/FeaturesSection';
// import TeamSection from '../components/TeamSection/TeamSection';
// import CTASection from '../components/CTASection/CTASection';

const LandingPage = () => {
    /*
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
    */

    return (
        <main>
            <CountdownClock targetDate="2026-02-08T18:00:00" />
            {/*
            <Hero focusTrigger={mockupFocusTrigger} />
            <ProblemSection />
            <SolutionSection />
            <FeaturesSection />
            <TeamSection />
            <CTASection onCTAClick={handleCTAClick} />
            */}
        </main >
    );
};

export default LandingPage;

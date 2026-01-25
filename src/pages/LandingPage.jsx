import React from 'react';
import Hero from '../components/Hero/Hero';
import ProblemSection from '../components/ProblemSection/ProblemSection';
import SolutionSection from '../components/SolutionSection/SolutionSection';
import FeaturesSection from '../components/FeaturesSection/FeaturesSection';
import HowItWorks from '../components/HowItWorks/HowItWorks';
import TeamSection from '../components/TeamSection/TeamSection';
import CTASection from '../components/CTASection/CTASection';

const LandingPage = () => {
    return (
        <main>
            <Hero />
            <ProblemSection />
            <SolutionSection />
            <FeaturesSection />
            <HowItWorks />
            <TeamSection />
            <CTASection />
        </main>
    );
};

export default LandingPage;

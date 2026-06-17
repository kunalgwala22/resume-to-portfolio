import React from 'react';
import AuroraBackground from '../components/landing/AuroraBackground';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import TemplatesShowcase from '../components/landing/TemplatesShowcase';
import HowItWorks from '../components/landing/HowItWorks';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import FAQ from '../components/landing/FAQ';
import Footer from '../components/layout/Footer';

export const Landing: React.FC = () => {
  return (
    <AuroraBackground>
      <Navbar />
      <div className="flex-grow flex flex-col">
        <Hero />
        <Features />
        <TemplatesShowcase />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
      </div>
      <Footer />
    </AuroraBackground>
  );
};

export default Landing;

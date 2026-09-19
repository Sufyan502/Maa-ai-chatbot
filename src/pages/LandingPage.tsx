import React from 'react';
import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { About } from '../components/landing/About';
import { Services } from '../components/landing/Services';
import { HowItWorks } from '../components/landing/HowItWorks';
import { AICapabilities } from '../components/landing/AICapabilities';
import { CTASection } from '../components/landing/CTASection';
import { Footer } from '../components/landing/Footer';
import { Floating3DAvatar } from '../components/landing/Floating3DAvatar';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenChatWithQuery: (query: string) => void;
  onOpenContactModal: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenSupportDesk?: () => void;
  onNavigate?: (route: any, payload?: string) => void;
  onOpenAuth?: () => void;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenChatWithQuery,
  onOpenContactModal,
  onOpenKnowledgeBase,
  onOpenSupportDesk,
  onNavigate,
  onOpenAuth,
  user,
  onLogout
}) => {
  const handleLearnMore = () => {
    const el = document.getElementById('about');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white flex flex-col selection:bg-[#2563EB]/30 selection:text-white">
      
      {/* Sticky Navbar */}
      <Navbar
        onGetStarted={onGetStarted}
        onOpenContactModal={onOpenContactModal}
        onOpenKnowledgeBase={onOpenKnowledgeBase}
        onOpenSupportDesk={onOpenSupportDesk}
        onNavigate={onNavigate}
        onOpenAuth={onOpenAuth}
        user={user}
        onLogout={onLogout}
      />

      {/* Main Landing Page Sections */}
      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onGetStarted={onGetStarted}
          onLearnMore={handleLearnMore}
        />

        {/* 2. About Section */}
        <About
          onOpenChat={onGetStarted}
        />

        {/* 3. Services Section */}
        <Services
          onOpenChatWithQuery={onOpenChatWithQuery}
        />

        {/* 4. How It Works Section */}
        <HowItWorks
          onOpenChat={onGetStarted}
        />

        {/* 5. AI Capabilities Section */}
        <AICapabilities
          onOpenChatWithQuery={onOpenChatWithQuery}
        />

        {/* 6. CTA Section */}
        <CTASection
          onOpenChat={onGetStarted}
        />
      </main>

      {/* 7. Footer */}
      <Footer
        onOpenChat={onGetStarted}
        onOpenContactModal={onOpenContactModal}
        onOpenKnowledgeBase={onOpenKnowledgeBase}
        onOpenSupportDesk={onOpenSupportDesk}
      />

      {/* 8. Fixed 3D Bot Avatar in the Most Right Corner */}
      <Floating3DAvatar onOpenChat={onGetStarted} />

    </div>
  );
};

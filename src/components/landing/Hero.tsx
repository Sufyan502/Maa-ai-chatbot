import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronDown, Sparkles, Bot, User, ShieldCheck, Zap, MessageSquare } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
  onLearnMore: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onGetStarted, onLearnMore }) => {
  const [activeStep, setActiveStep] = useState(2);

  // Subtle interactive cycling to make the preview feel alive
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev >= 3 ? 1 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      
      {/* Background Soft Glows (Subtle, non-flashy) */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#2563EB]/15 via-[#7C3AED]/12 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-40 left-10 w-[300px] h-[300px] bg-[#2563EB]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-60 right-10 w-[320px] h-[320px] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Small Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111722] border border-[#1D2533] text-xs font-semibold text-[#8994A7] shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="text-white font-medium">✦ AI Powered Platform</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
              A clearer way to <br />
              <span className="gradient-text">navigate MaaProject</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-[#8994A7] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Ask natural questions, discover verified MaaProject information, and get guided to the right service or support path — all from one intelligent assistant.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onGetStarted}
                id="hero-get-started-btn"
                className="w-full sm:w-auto gradient-btn px-8 py-4 rounded-xl text-base font-semibold text-white flex items-center justify-center gap-3 shadow-xl shadow-blue-600/30 border border-blue-400/30 cursor-pointer group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onLearnMore}
                className="w-full sm:w-auto px-6 py-4 rounded-xl text-sm font-semibold text-[#8994A7] hover:text-white bg-[#111722] hover:bg-[#151D2C] border border-[#1D2533] hover:border-[#293548] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Learn More</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Key Trust Highlights */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#1D2533]/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-xl font-bold text-white">24/7</div>
                <div className="text-xs text-[#8994A7] mt-0.5">AI access</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Verified</div>
                <div className="text-xs text-[#8994A7] mt-0.5">Knowledge-first</div>
              </div>
              <div>
                <div className="text-xl font-bold text-white">Smart</div>
                <div className="text-xs text-[#8994A7] mt-0.5">Guided answers</div>
              </div>
            </div>

          </div>

          {/* Right Hero Visual: Sophisticated AI Preview Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div
              onClick={onGetStarted}
              className="w-full max-w-md bg-[#101722] rounded-3xl border border-[#1D2533] shadow-2xl shadow-black/80 p-5 relative overflow-hidden transition-all duration-300 hover:border-[#293548] cursor-pointer group"
              title="Click to launch interactive AI conversation"
            >
              
              {/* Subtle Card Glow Effect */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#2563EB]/20 to-[#7C3AED]/20 rounded-full blur-2xl pointer-events-none" />

              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1D2533]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-white">Maa AI Chat</h2>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
                      <span className="text-[11px] text-[#8994A7] font-medium">Online</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-semibold px-2.5 py-1 rounded-md bg-[#2563EB]/10 text-[#60A5FA] border border-[#2563EB]/20">
                  Preview
                </span>
              </div>

              {/* Preview Messages Stream */}
              <div className="py-4 space-y-3.5 text-xs">
                
                {/* AI Message 1 */}
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-md bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-[#60A5FA] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-[#111722] border border-[#1D2533] text-white p-3 rounded-2xl rounded-tl-xs leading-relaxed max-w-[85%] shadow-sm">
                    Hello! 👋 How can I help you today?
                  </div>
                </div>

                {/* User Message */}
                <div className="flex gap-2.5 items-start flex-row-reverse">
                  <div className="w-6 h-6 rounded-md bg-[#7C3AED]/30 border border-[#7C3AED]/40 flex items-center justify-center text-white shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white p-3 rounded-2xl rounded-tr-xs leading-relaxed max-w-[85%] shadow-md">
                    Tell me about MaaProject.
                  </div>
                </div>

                {/* AI Message 2 */}
                <div className="flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-md bg-[#2563EB]/20 border border-[#2563EB]/30 flex items-center justify-center text-[#60A5FA] shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="bg-[#111722] border border-[#1D2533] text-[#FFFFFF] p-3 rounded-2xl rounded-tl-xs leading-relaxed max-w-[88%] shadow-sm">
                    I can help you find information, understand services, navigate the platform, and get support.
                  </div>
                </div>

                {/* Subtle Typing / Action indicator */}
                <div className="flex items-center gap-2 pt-1 text-[11px] text-[#8994A7] px-1">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-bounce [animation-delay:0.4s]" />
                  </div>
                  <span>Maa AI is ready to answer your questions</span>
                </div>

              </div>

              {/* Preview Footer Callout */}
              <div className="pt-3 border-t border-[#1D2533] flex items-center justify-between text-xs">
                <span className="text-[#8994A7] text-[11px]">Click preview to start conversation</span>
                <span className="text-[#60A5FA] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Launch Chat <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

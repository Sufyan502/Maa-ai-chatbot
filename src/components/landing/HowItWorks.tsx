import React from 'react';
import { MessageSquare, Cpu, CheckCircle, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onOpenChat: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenChat }) => {
  const steps = [
    {
      step: '01',
      title: 'Ask',
      description: 'Ask Maa AI Chat a question naturally.',
      detail: 'Type or voice-input your question regarding maternal care, welfare grants, nutrition kits, doctor appointments, or support.',
      icon: <MessageSquare className="w-5 h-5 text-[#60A5FA]" />,
      badgeBg: 'bg-[#2563EB]/15 text-[#60A5FA] border-[#2563EB]/30'
    },
    {
      step: '02',
      title: 'Understand',
      description: 'The AI analyzes your question and retrieves relevant available information.',
      detail: 'Our retrieval-augmented generation engine searches verified MaaProject documentation to assemble strict, factual context.',
      icon: <Cpu className="w-5 h-5 text-[#A78BFA]" />,
      badgeBg: 'bg-[#7C3AED]/15 text-[#A78BFA] border-[#7C3AED]/30'
    },
    {
      step: '03',
      title: 'Assist',
      description: 'Receive an answer, guidance, navigation help, or support information.',
      detail: 'Get a clean, structured reply with verified sources, direct portal navigation buttons, or immediate support escalation.',
      icon: <CheckCircle className="w-5 h-5 text-[#22C55E]" />,
      badgeBg: 'bg-[#22C55E]/15 text-[#22C55E] border-[#22C55E]/30'
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-[#0D131E] border-y border-[#1D2533] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-[#60A5FA]">
            THREE SIMPLE STEPS
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How <span className="gradient-text">Maa AI Chat</span> Works
          </h2>
          <p className="text-base text-[#8994A7]">
            From inquiry to clear resolution in seconds with grounded intelligence.
          </p>
        </div>

        {/* 3 Steps Grid with Connected Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111722] rounded-3xl border border-[#1D2533] p-8 flex flex-col justify-between relative transition-all duration-300 hover:border-[#293548] hover:shadow-2xl hover:shadow-black/60 group"
            >
              <div>
                {/* Step Header with Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-[#1D2533] group-hover:text-[#293548] transition-colors font-mono">
                    {item.step}
                  </span>
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.badgeBg}`}>
                    {item.icon}
                  </div>
                </div>

                {/* Step Title & Main Description */}
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#60A5FA] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm font-medium text-white/90 mb-3 leading-snug">
                  {item.description}
                </p>
                <p className="text-xs text-[#8994A7] leading-relaxed">
                  {item.detail}
                </p>
              </div>

              {/* Progress Indicator Dots */}
              <div className="pt-6 mt-6 border-t border-[#1D2533] flex items-center justify-between text-xs text-[#8994A7]">
                <span>Step {item.step} of 03</span>
                <span className="w-2 h-2 rounded-full bg-[#2563EB]/40 group-hover:bg-[#2563EB] transition-colors" />
              </div>

            </div>
          ))}

        </div>

        {/* Bottom Callout */}
        <div className="mt-12 text-center">
          <button
            onClick={onOpenChat}
            className="gradient-btn px-7 py-3.5 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2.5 shadow-lg shadow-blue-600/25 border border-blue-400/30 cursor-pointer"
          >
            <span>Experience Maa AI Chat Now</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

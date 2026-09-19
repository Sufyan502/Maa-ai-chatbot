import React from 'react';
import { Sparkles, Layers, Zap, LifeBuoy, ArrowRight } from 'lucide-react';

interface ServicesProps {
  onOpenChatWithQuery: (query: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onOpenChatWithQuery }) => {
  const serviceCards = [
    {
      title: 'AI Assistant',
      description: 'Ask questions and receive intelligent responses based on available MaaProject information.',
      icon: <Sparkles className="w-5 h-5" />,
      accentColor: 'from-[#2563EB]/20 to-[#2563EB]/5',
      borderColor: 'group-hover:border-[#2563EB]',
      iconBg: 'bg-[#2563EB]/15 text-[#60A5FA] border-[#2563EB]/30',
      sampleQuery: 'What is MaaProject and how does it help mothers?'
    },
    {
      title: 'Information & Services',
      description: 'Find information and understand MaaProject services.',
      icon: <Layers className="w-5 h-5" />,
      accentColor: 'from-[#7C3AED]/20 to-[#7C3AED]/5',
      borderColor: 'group-hover:border-[#7C3AED]',
      iconBg: 'bg-[#7C3AED]/15 text-[#A78BFA] border-[#7C3AED]/30',
      sampleQuery: 'What services are available on MaaProject?'
    },
    {
      title: 'Smart Guidance',
      description: 'Get guidance and navigation assistance when you don\'t know where to go next.',
      icon: <Zap className="w-5 h-5" />,
      accentColor: 'from-[#60A5FA]/20 to-[#60A5FA]/5',
      borderColor: 'group-hover:border-[#60A5FA]',
      iconBg: 'bg-[#60A5FA]/15 text-[#93C5FD] border-[#60A5FA]/30',
      sampleQuery: 'How do I apply for the maternal welfare scheme?'
    },
    {
      title: 'Support',
      description: 'Get help, report problems, and find appropriate support information.',
      icon: <LifeBuoy className="w-5 h-5" />,
      accentColor: 'from-[#22C55E]/20 to-[#22C55E]/5',
      borderColor: 'group-hover:border-[#22C55E]',
      iconBg: 'bg-[#22C55E]/15 text-[#86EFAC] border-[#22C55E]/30',
      sampleQuery: 'I need to report a problem with my application'
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#080C14] relative overflow-hidden">
      
      {/* Background Accent Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#2563EB]/5 blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-[#60A5FA]">
            WHAT MAA AI CAN DO
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Intelligent assistance <span className="gradient-text">when you need it</span>
          </h2>
          <p className="text-base text-[#8994A7]">
            Designed to answer queries accurately, navigate resources effortlessly, and deliver rapid guidance.
          </p>
        </div>

        {/* 4 Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((card, idx) => (
            <div
              key={idx}
              onClick={() => onOpenChatWithQuery(card.sampleQuery)}
              className={`bg-[#111722] rounded-2xl border border-[#1D2533] p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 cursor-pointer group ${card.borderColor}`}
            >
              <div>
                <div className={`w-11 h-11 rounded-xl border flex items-center justify-center mb-5 transition-transform group-hover:scale-105 ${card.iconBg}`}>
                  {card.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#60A5FA] transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-[#8994A7] leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1D2533] flex items-center justify-between text-xs text-[#8994A7] group-hover:text-white transition-colors">
                <span className="font-medium">Try this query</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#60A5FA]" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

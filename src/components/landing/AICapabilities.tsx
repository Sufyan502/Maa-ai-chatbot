import React from 'react';
import {
  HelpCircle,
  Info,
  Layers,
  Compass,
  Navigation,
  Search,
  MessageCircle,
  PhoneCall,
  AlertTriangle,
  LifeBuoy,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AICapabilitiesProps {
  onOpenChatWithQuery: (query: string) => void;
}

export const AICapabilities: React.FC<AICapabilitiesProps> = ({ onOpenChatWithQuery }) => {
  const capabilities = [
    {
      name: 'Frequently asked questions',
      icon: <HelpCircle className="w-4 h-4 text-[#60A5FA]" />,
      query: 'Is MaaProject free to use for mothers and families?'
    },
    {
      name: 'Project information',
      icon: <Info className="w-4 h-4 text-[#A78BFA]" />,
      query: 'What is the mission and vision of MaaProject?'
    },
    {
      name: 'Service information',
      icon: <Layers className="w-4 h-4 text-[#60A5FA]" />,
      query: 'What maternal healthcare services does MaaProject offer?'
    },
    {
      name: 'User guidance',
      icon: <Compass className="w-4 h-4 text-[#22C55E]" />,
      query: 'How do I apply for the ₹6,000 Janani Nutrition Grant?'
    },
    {
      name: 'Navigation assistance',
      icon: <Navigation className="w-4 h-4 text-[#60A5FA]" />,
      query: 'Where can I find the nearest Community Care Center?'
    },
    {
      name: 'Search assistance',
      icon: <Search className="w-4 h-4 text-[#A78BFA]" />,
      query: 'Search for high-risk pregnancy screening guidelines'
    },
    {
      name: 'General inquiries',
      icon: <MessageCircle className="w-4 h-4 text-[#60A5FA]" />,
      query: 'What documents are required for welfare verification?'
    },
    {
      name: 'Contact information',
      icon: <PhoneCall className="w-4 h-4 text-[#22C55E]" />,
      query: 'What is the 24/7 National Toll-Free helpline number?'
    },
    {
      name: 'Problem reporting',
      icon: <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />,
      query: 'My welfare installment has been delayed for 2 weeks'
    },
    {
      name: 'Support requests',
      icon: <LifeBuoy className="w-4 h-4 text-[#22C55E]" />,
      query: 'How can I submit a support ticket to human assistance?'
    }
  ];

  return (
    <section id="capabilities" className="py-24 bg-[#080C14] relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
          <div className="text-xs font-bold uppercase tracking-widest text-[#60A5FA]">
            COMPREHENSIVE COVERAGE
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            One assistant. <span className="gradient-text">Multiple ways to help.</span>
          </h2>
          <p className="text-base text-[#8994A7]">
            Trained on verified maternal healthcare, social welfare, community nutrition, and support data.
          </p>
        </div>

        {/* Feature Panel */}
        <div className="bg-[#111722] rounded-3xl border border-[#1D2533] p-8 sm:p-12 shadow-2xl relative">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {capabilities.map((cap, idx) => (
              <div
                key={idx}
                onClick={() => onOpenChatWithQuery(cap.query)}
                className="bg-[#080C14] rounded-2xl border border-[#1D2533] p-4 flex items-center justify-between transition-all duration-200 hover:border-[#293548] hover:bg-[#0D131E] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#111722] border border-[#1D2533] flex items-center justify-center shrink-0 group-hover:border-[#293548] transition-colors">
                    {cap.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white group-hover:text-[#60A5FA] transition-colors">
                      {cap.name}
                    </h3>
                    <p className="text-xs text-[#8994A7] line-clamp-1">
                      "{cap.query}"
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-[#8994A7] group-hover:text-white group-hover:translate-x-1 transition-all shrink-0 ml-2" />
              </div>
            ))}
          </div>

          {/* Panel Footer Callout */}
          <div className="mt-8 pt-8 border-t border-[#1D2533] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8994A7]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#60A5FA]" />
              <span>All responses are grounded strictly in approved MaaProject documentation.</span>
            </div>
            <button
              onClick={() => onOpenChatWithQuery('What is MaaProject?')}
              className="text-[#60A5FA] hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              Ask any question <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};

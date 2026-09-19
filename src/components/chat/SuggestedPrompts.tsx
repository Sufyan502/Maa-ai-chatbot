import React from 'react';
import { Sparkles, Layers, Search, LifeBuoy, ArrowRight, ShieldCheck } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (promptText: string) => void;
}

export const SuggestedPrompts: React.FC<SuggestedPromptsProps> = ({ onSelectPrompt }) => {
  const prompts = [
    {
      title: 'What is MaaProject?',
      subtitle: 'Learn about the mission, pillars, and maternal care welfare initiatives.',
      icon: <Sparkles className="w-5 h-5 text-[#60A5FA]" />,
      iconBg: 'bg-[#2563EB]/15 border-[#2563EB]/30',
      query: 'What is MaaProject and what does it do?'
    },
    {
      title: 'What services are available?',
      subtitle: 'Explore doctor tele-consultations, Poshan food kits, and welfare grants.',
      icon: <Layers className="w-5 h-5 text-[#A78BFA]" />,
      iconBg: 'bg-[#7C3AED]/15 border-[#7C3AED]/30',
      query: 'What services are available on MaaProject?'
    },
    {
      title: 'Help me find information',
      subtitle: 'Find eligibility rules, documents required, and application guides.',
      icon: <Search className="w-5 h-5 text-[#93C5FD]" />,
      iconBg: 'bg-[#60A5FA]/15 border-[#60A5FA]/30',
      query: 'Help me find information on how to apply for the Janani Nutrition Grant'
    },
    {
      title: 'I need support',
      subtitle: 'Report a problem, resolve payment delays, or reach verified helplines.',
      icon: <LifeBuoy className="w-5 h-5 text-[#86EFAC]" />,
      iconBg: 'bg-[#22C55E]/15 border-[#22C55E]/30',
      query: 'I need support reporting an issue or contacting official care helpline'
    }
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12 text-center flex flex-col items-center justify-center my-auto">
      
      {/* Large AI Icon */}
      <div className="relative mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white text-3xl font-bold shadow-2xl shadow-blue-500/30 border border-blue-400/40">
          ✦
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#22C55E] border-2 border-[#080C14] flex items-center justify-center text-[10px] text-black font-bold">
          ✓
        </div>
      </div>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
        How can I help you today?
      </h2>

      {/* Description */}
      <p className="text-xs sm:text-sm text-[#8994A7] max-w-lg mb-8 leading-relaxed">
        Ask me about MaaProject, available information, services, navigation, support, or other questions related to the platform.
      </p>

      {/* 4 Suggested Prompt Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
        {prompts.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelectPrompt(item.query)}
            className="p-4 rounded-2xl bg-[#111722] hover:bg-[#151D2C] border border-[#1D2533] hover:border-[#293548] transition-all flex items-start gap-3.5 text-left group cursor-pointer hover:shadow-lg hover:shadow-black/40"
          >
            <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${item.iconBg}`}>
              {item.icon}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-bold text-white group-hover:text-[#60A5FA] transition-colors truncate">
                {item.title}
              </h3>
              <p className="text-[11px] text-[#8994A7] line-clamp-2 mt-0.5 leading-snug">
                {item.subtitle}
              </p>
            </div>

            <ArrowRight className="w-3.5 h-3.5 text-[#687386] group-hover:text-white group-hover:translate-x-0.5 transition-transform shrink-0 mt-1" />
          </button>
        ))}
      </div>

      {/* Grounding guarantee badge */}
      <div className="mt-8 flex items-center gap-2 text-[11px] text-[#687386]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
        <span>Grounded in verified MaaProject public records and official guidelines.</span>
      </div>

    </div>
  );
};

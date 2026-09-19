import React from 'react';
import { Database, Search, Bot, LifeBuoy, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface AboutProps {
  onOpenChat: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenChat }) => {
  return (
    <section id="about" className="py-24 bg-[#0D131E] border-y border-[#1D2533] relative overflow-hidden">
      
      {/* Soft Ambient Radial Accents */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#2563EB]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Text & Content */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Section Label */}
            <div className="text-xs font-bold uppercase tracking-widest text-[#60A5FA]">
              ABOUT MAA PROJECT
            </div>

            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Built around <br />
              <span className="gradient-text">intelligent assistance</span>
            </h2>

            {/* Description */}
            <p className="text-base text-[#8994A7] leading-relaxed">
              MaaProject combines a modern web experience with an AI assistant designed to help users access information, understand services, find relevant information, and receive assistance with common queries.
            </p>

            {/* Core Capability Checklist */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#2563EB]/20 border border-[#2563EB]/40 flex items-center justify-center text-[#60A5FA] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Grounded Knowledge Retrieval</h4>
                  <p className="text-xs text-[#8994A7] mt-0.5">
                    Accurate answers synthesized from indexed documentation and official resources.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#7C3AED]/20 border border-[#7C3AED]/40 flex items-center justify-center text-[#A78BFA] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Contextual Navigation Guidance</h4>
                  <p className="text-xs text-[#8994A7] mt-0.5">
                    Smart recommendations and direct routing to portals, application guides, and services.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-[#22C55E]/20 border border-[#22C55E]/40 flex items-center justify-center text-[#22C55E] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Integrated Problem & Support Reporting</h4>
                  <p className="text-xs text-[#8994A7] mt-0.5">
                    Structured ticket creation and escalation pathways for rapid resolution.
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Trigger CTA */}
            <div className="pt-4">
              <button
                onClick={onOpenChat}
                className="gradient-btn px-6 py-3 rounded-xl text-sm font-semibold text-white inline-flex items-center gap-2 shadow-lg shadow-blue-600/20 border border-blue-400/25 cursor-pointer"
              >
                <span>Ask Maa AI a Question</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Column: Visual Knowledge System Card */}
          <div className="lg:col-span-6">
            <div className="bg-[#111722] rounded-3xl border border-[#1D2533] p-6 sm:p-8 shadow-2xl relative">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-6 border-b border-[#1D2533]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white shadow-md">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Maa AI Architecture</h3>
                    <p className="text-xs text-[#8994A7]">Verified Knowledge & Reasoning Engine</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-[#22C55E] bg-[#22C55E]/10 px-3 py-1 rounded-full border border-[#22C55E]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Active
                </span>
              </div>

              {/* Connected Visual Nodes System */}
              <div className="grid grid-cols-2 gap-4 py-6">
                
                {/* Node 1: Knowledge */}
                <div className="bg-[#080C14] rounded-2xl border border-[#1D2533] p-4 transition-all hover:border-[#2563EB]/50 group">
                  <div className="w-9 h-9 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#60A5FA] mb-3 group-hover:scale-110 transition-transform">
                    <Database className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Knowledge</h4>
                  <p className="text-xs text-[#8994A7] mt-1 leading-normal">
                    Verified repository of project documents & policies.
                  </p>
                </div>

                {/* Node 2: Search & Retrieval */}
                <div className="bg-[#080C14] rounded-2xl border border-[#1D2533] p-4 transition-all hover:border-[#7C3AED]/50 group">
                  <div className="w-9 h-9 rounded-xl bg-[#7C3AED]/15 border border-[#7C3AED]/30 flex items-center justify-center text-[#A78BFA] mb-3 group-hover:scale-110 transition-transform">
                    <Search className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Search</h4>
                  <p className="text-xs text-[#8994A7] mt-1 leading-normal">
                    Real-time semantic retrieval & keyword indexing.
                  </p>
                </div>

                {/* Node 3: AI Engine */}
                <div className="bg-[#080C14] rounded-2xl border border-[#1D2533] p-4 transition-all hover:border-[#60A5FA]/50 group">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform shadow-md">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">AI Engine</h4>
                  <p className="text-xs text-[#8994A7] mt-1 leading-normal">
                    Grounded generative AI with strict factual bounds.
                  </p>
                </div>

                {/* Node 4: Support & Escalation */}
                <div className="bg-[#080C14] rounded-2xl border border-[#1D2533] p-4 transition-all hover:border-[#22C55E]/50 group">
                  <div className="w-9 h-9 rounded-xl bg-[#22C55E]/15 border border-[#22C55E]/30 flex items-center justify-center text-[#22C55E] mb-3 group-hover:scale-110 transition-transform">
                    <LifeBuoy className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Support</h4>
                  <p className="text-xs text-[#8994A7] mt-1 leading-normal">
                    Ticket creation, status tracking & human escalation.
                  </p>
                </div>

              </div>

              {/* System Footer Note */}
              <div className="pt-4 border-t border-[#1D2533] flex items-center justify-between text-xs text-[#8994A7]">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#60A5FA]" />
                  Zero Hallucination Grounding
                </span>
                <span>Response latency ~420ms</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

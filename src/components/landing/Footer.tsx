import React from 'react';
import { Phone, Mail, ShieldCheck, Heart } from 'lucide-react';

interface FooterProps {
  onOpenChat: () => void;
  onOpenContactModal?: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenSupportDesk?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenChat,
  onOpenContactModal,
  onOpenKnowledgeBase,
  onOpenSupportDesk
}) => {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-[#080C14] border-t border-[#1D2533] text-sm text-[#8994A7] py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#1D2533]">
          
          {/* Left Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-md text-white font-extrabold text-lg">
                M
              </div>
              <div>
                <span className="font-bold text-base text-white tracking-tight">MaaProject</span>
                <p className="text-xs text-[#8994A7]">Smart AI Solutions</p>
              </div>
            </div>

            <p className="text-xs text-[#8994A7] leading-relaxed max-w-sm">
              Integrated maternal health guidance, social welfare allowances, Poshan community nutrition, and 24/7 verified AI assistance.
            </p>

            <div className="flex flex-wrap gap-4 pt-1 text-xs">
              <span className="inline-flex items-center gap-1.5 text-white">
                <Phone className="w-3.5 h-3.5 text-[#22C55E]" />
                1800-11-6222 (Toll-Free)
              </span>
              <span className="inline-flex items-center gap-1.5 text-white">
                <Mail className="w-3.5 h-3.5 text-[#60A5FA]" />
                support@maaproject.org
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  About MaaProject
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('services')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  What Maa AI Can Do
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  How It Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('capabilities')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  AI Capabilities
                </button>
              </li>
            </ul>
          </div>

          {/* Services & Support */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Interactive Portals</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenChat}
                  className="text-[#60A5FA] hover:text-white transition-colors font-medium cursor-pointer flex items-center gap-1"
                >
                  ✦ Launch Maa AI Chat Interface
                </button>
              </li>
              {onOpenKnowledgeBase && (
                <li>
                  <button
                    onClick={onOpenKnowledgeBase}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Verified Knowledge Base Directory
                  </button>
                </li>
              )}
              {onOpenSupportDesk && (
                <li>
                  <button
                    onClick={onOpenSupportDesk}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Support Desk & Ticket Tracking
                  </button>
                </li>
              )}
              {onOpenContactModal && (
                <li>
                  <button
                    onClick={onOpenContactModal}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Official Contacts & Care Centers
                  </button>
                </li>
              )}
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#687386]">
          <div>
            © 2026 MaaProject. All rights reserved.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#22C55E]" />
              Official Public Initiative
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              Dedicated to Mother & Child Health
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};

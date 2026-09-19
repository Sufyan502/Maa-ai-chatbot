import React, { useState, useEffect } from 'react';
import { Sparkles, Menu, X, ArrowRight, BookOpen, LifeBuoy, FileCode2 } from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';
import { UserRound } from 'lucide-react';

interface NavbarProps {
  onGetStarted: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenSupportDesk?: () => void;
  onOpenContactModal?: () => void;
  onNavigate?: (route: any, payload?: string) => void;
  onOpenAuth?: () => void;
  user?: { name: string; email: string } | null;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onGetStarted,
  onOpenKnowledgeBase,
  onOpenSupportDesk,
  onOpenContactModal,
  onNavigate,
  onOpenAuth,
  user,
  onLogout
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#060913]/78 backdrop-blur-2xl border-b border-white/[0.07] shadow-xl shadow-black/30 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Tagline */}
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30 group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-white text-xl tracking-tight">M</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  MaaProject
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  v2.5
                </span>
              </div>
              <p className="text-xs text-[#8994A7] font-medium leading-none mt-0.5">
                Smart AI Solutions
              </p>
            </div>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-sm text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('about')}
              className="text-sm text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection('services')}
              className="text-sm text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection('capabilities')}
              className="text-sm text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            {onOpenContactModal && (
              <button
                onClick={onOpenContactModal}
                className="text-sm text-[#8994A7] hover:text-white transition-colors cursor-pointer"
              >
                Contact
              </button>
            )}
          </nav>

          {/* Right Action: Notifications & Get Started Button */}
          <div className="hidden sm:flex items-center gap-3">
            <NotificationBell onNavigate={onNavigate} />
            {user ? (
              <button onClick={onLogout} title={`Sign out ${user.name}`} className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-[#AAB4C5] hover:text-white flex items-center gap-2">
                <UserRound className="w-4 h-4" /> <span className="max-w-[100px] truncate">{user.name}</span>
              </button>
            ) : onOpenAuth ? (
              <button onClick={onOpenAuth} className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-[#AAB4C5] hover:text-white">Sign In</button>
            ) : null}

            <button
              onClick={onGetStarted}
              id="nav-get-started-btn"
              className="gradient-btn px-5 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center gap-2 shadow-lg shadow-blue-600/25 border border-blue-400/30 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <NotificationBell onNavigate={onNavigate} />
            {user ? (
              <button onClick={onLogout} title={`Sign out ${user.name}`} className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-[#AAB4C5] hover:text-white flex items-center gap-2">
                <UserRound className="w-4 h-4" /> <span className="max-w-[100px] truncate">{user.name}</span>
              </button>
            ) : onOpenAuth ? (
              <button onClick={onOpenAuth} className="px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-[#AAB4C5] hover:text-white">Sign In</button>
            ) : null}

            <button
              onClick={onGetStarted}
              className="gradient-btn px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white flex items-center gap-1.5"
            >
              <span>Chat AI</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-[#111722] border border-[#1D2533] text-[#8994A7] hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#080C14]/95 border-b border-[#1D2533] backdrop-blur-2xl px-4 pt-3 pb-6 mt-2 space-y-3">
          <button
            onClick={() => scrollToSection('hero')}
            className="block w-full text-left py-2 text-sm text-[#8994A7] hover:text-white"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left py-2 text-sm text-[#8994A7] hover:text-white"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection('services')}
            className="block w-full text-left py-2 text-sm text-[#8994A7] hover:text-white"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection('how-it-works')}
            className="block w-full text-left py-2 text-sm text-[#8994A7] hover:text-white"
          >
            How It Works
          </button>
          <button
            onClick={() => scrollToSection('capabilities')}
            className="block w-full text-left py-2 text-sm text-[#8994A7] hover:text-white"
          >
            Capabilities
          </button>
          {onOpenAuth && !user && (
            <button onClick={() => { setMobileMenuOpen(false); onOpenAuth(); }} className="block w-full text-left py-2 text-sm text-blue-400 hover:text-white">Sign In / Create Account</button>
          )}
          {user && onLogout && (
            <button onClick={() => { setMobileMenuOpen(false); onLogout(); }} className="block w-full text-left py-2 text-sm text-red-300 hover:text-white">Sign Out</button>
          )}
          {onOpenContactModal && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenContactModal();
              }}
              className="block w-full text-left py-2 text-sm text-[#8994A7] hover:text-white"
            >
              Contact Directory
            </button>
          )}
          <div className="pt-2 border-t border-[#1D2533]">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onGetStarted();
              }}
              className="w-full gradient-btn py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Launch Maa AI Chat</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

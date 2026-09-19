import React from 'react';
import { 
  MessageSquare, 
  Database, 
  LifeBuoy, 
  FlaskConical, 
  BookOpen, 
  PhoneCall, 
  ShieldCheck, 
  Sparkles,
  AlertTriangle
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'chat' | 'knowledge' | 'tickets' | 'tests' | 'docs';
  setActiveTab: (tab: 'chat' | 'knowledge' | 'tickets' | 'tests' | 'docs') => void;
  onOpenContact: () => void;
  onOpenReport: () => void;
  openTicketsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenContact,
  onOpenReport,
  openTicketsCount
}) => {
  return (
    <header id="main-navbar" className="sticky top-0 z-40 w-full bg-slate-950/40 backdrop-blur-xl border-b border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('chat')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 ring-1 ring-white/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-lg tracking-tight">Maa AI Chat</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
                  Track 3: MaaProject
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Intelligent Knowledge-Grounded Platform Assistant</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-white/[0.05] p-1 rounded-xl border border-white/10 backdrop-blur-md">
            <button
              id="nav-tab-chat"
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI Chatbot</span>
            </button>

            <button
              id="nav-tab-knowledge"
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'knowledge'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Knowledge Base (RAG)</span>
            </button>

            <button
              id="nav-tab-tickets"
              onClick={() => setActiveTab('tickets')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer relative ${
                activeTab === 'tickets'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <LifeBuoy className="w-3.5 h-3.5 text-cyan-400" />
              <span>Support Desk</span>
              {openTicketsCount > 0 && (
                <span className="w-4 h-4 bg-amber-500 text-white rounded-full text-[10px] flex items-center justify-center font-bold shadow-xs">
                  {openTicketsCount}
                </span>
              )}
            </button>

            <button
              id="nav-tab-tests"
              onClick={() => setActiveTab('tests')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'tests'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 text-purple-400" />
              <span>Test Suite (30 TCs)</span>
            </button>

            <button
              id="nav-tab-docs"
              onClick={() => setActiveTab('docs')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                activeTab === 'docs'
                  ? 'bg-white/15 text-white shadow-xs border border-white/20 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-pink-400" />
              <span>Documentation</span>
            </button>
          </nav>

          {/* Quick Actions & Emergency Hotline */}
          <div className="flex items-center gap-2">
            <button
              id="btn-quick-contact"
              onClick={onOpenContact}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10 backdrop-blur-md cursor-pointer"
              title="Official Verified Contact Info"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">1800-11-6222</span>
            </button>

            <button
              id="btn-report-problem-nav"
              onClick={onOpenReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 active:scale-98 rounded-xl shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition-all cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Report Issue</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-white/10 text-xs bg-slate-950/60 backdrop-blur-md">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${activeTab === 'chat' ? 'text-emerald-400 font-semibold bg-white/10' : 'text-slate-400'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('knowledge')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${activeTab === 'knowledge' ? 'text-indigo-400 font-semibold bg-white/10' : 'text-slate-400'}`}
          >
            <Database className="w-4 h-4" />
            <span>Knowledge</span>
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${activeTab === 'tickets' ? 'text-cyan-400 font-semibold bg-white/10' : 'text-slate-400'}`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Support</span>
          </button>
          <button
            onClick={() => setActiveTab('tests')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${activeTab === 'tests' ? 'text-purple-400 font-semibold bg-white/10' : 'text-slate-400'}`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>Tests</span>
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-colors ${activeTab === 'docs' ? 'text-pink-400 font-semibold bg-white/10' : 'text-slate-400'}`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Docs</span>
          </button>
        </div>

      </div>
    </header>
  );
};

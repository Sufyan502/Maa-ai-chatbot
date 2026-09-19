import React from 'react';
import {
  Bot,
  Plus,
  Trash2,
  Home,
  Menu,
  Volume2,
  VolumeX,
  Sparkles,
  BookOpen,
  LifeBuoy,
  History,
  Clock
} from 'lucide-react';
import { NotificationBell } from '../notifications/NotificationBell';

interface ChatHeaderProps {
  onNewChat: () => void;
  onClearConversation: () => void;
  onBackToHome: () => void;
  onToggleSidebarMobile: () => void;
  onToggleHistoryRight?: () => void;
  isAudioEnabled?: boolean;
  onToggleAudio?: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenSupportDesk?: () => void;
  onNavigate?: (route: any, payload?: string) => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onNewChat,
  onClearConversation,
  onBackToHome,
  onToggleSidebarMobile,
  onToggleHistoryRight,
  isAudioEnabled,
  onToggleAudio,
  onOpenKnowledgeBase,
  onOpenSupportDesk,
  onNavigate
}) => {
  return (
    <header className="h-16 bg-[#101722] border-b border-[#1D2533] px-3 sm:px-6 flex items-center justify-between shrink-0 select-none z-20">
      
      {/* Left: Brand / Title / Status */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        
        {/* Top-Left Three-Line Menu Button for Mobile & Small screens */}
        <button
          onClick={onToggleSidebarMobile}
          id="mobile-sidebar-menu-btn"
          className="md:hidden p-2 sm:p-2.5 rounded-xl bg-[#111722] hover:bg-[#161F2E] active:bg-[#1A2536] border border-[#2563EB]/40 hover:border-cyan-400 text-cyan-400 hover:text-white shrink-0 cursor-pointer shadow-md shadow-blue-950/40 transition-all flex items-center justify-center"
          aria-label="Open Recent Conversations and New Chat Menu"
          title="Recent Conversations & Menu"
        >
          <Menu className="w-5 h-5 text-cyan-400 stroke-[2.5]" />
        </button>

        {/* AI Icon */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0">
          <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        {/* Title and Subtitle */}
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <h1 className="text-xs sm:text-sm font-bold text-white tracking-tight truncate">
              Maa AI Chat
            </h1>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[#22C55E]/10 border border-[#22C55E]/20 text-[9px] sm:text-[10px] font-semibold text-[#22C55E] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
              <span>Online</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8994A7] font-normal leading-none mt-0.5 hidden md:block">
            Intelligent Public Welfare Assistant
          </p>
        </div>

      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        
        {/* Chat History Panel Toggle Button (Right Side Panel) */}
        {onToggleHistoryRight && (
          <button
            onClick={onToggleHistoryRight}
            id="chat-history-right-btn"
            className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#111722] hover:bg-[#161F2E] border border-[#1D2533] hover:border-cyan-500/30 text-slate-300 hover:text-cyan-300 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            title="Open Chat History (Right Panel)"
          >
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline text-xs font-semibold">History</span>
          </button>
        )}

        {/* Notification Bell Center */}
        <NotificationBell onNavigate={onNavigate} />

        {/* Audio Toggle if supported */}
        {onToggleAudio && (
          <button
            onClick={onToggleAudio}
            className={`p-2 rounded-xl border text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              isAudioEnabled
                ? 'bg-[#2563EB]/15 border-[#2563EB]/40 text-[#60A5FA]'
                : 'bg-[#111722] border-[#1D2533] text-[#8994A7] hover:text-white'
            }`}
            title={isAudioEnabled ? 'Voice Responses Enabled' : 'Voice Responses Muted'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        )}

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#111722] hover:bg-[#151D2C] border border-[#1D2533] hover:border-[#293548] text-xs font-semibold text-white transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#60A5FA]" />
          <span className="hidden lg:inline">New Chat</span>
        </button>

        {/* Clear Conversation */}
        <button
          onClick={onClearConversation}
          className="p-2 sm:px-2.5 sm:py-1.5 rounded-xl bg-[#111722] hover:bg-rose-500/10 border border-[#1D2533] hover:border-rose-500/30 text-xs font-semibold text-[#8994A7] hover:text-rose-400 transition-all flex items-center gap-1.5 cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden xl:inline">Clear</span>
        </button>

        {/* Back to Home CTA */}
        <button
          onClick={onBackToHome}
          className="gradient-btn px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex items-center gap-1.5 shadow-md border border-blue-400/30 cursor-pointer"
          title="Return to Landing Page"
        >
          <Home className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Home</span>
        </button>

      </div>

    </header>
  );
};



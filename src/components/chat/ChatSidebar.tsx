import React, { useState } from 'react';
import {
  Plus,
  MessageSquare,
  Trash2,
  Home,
  Settings,
  User,
  ShieldCheck,
  LifeBuoy,
  ChevronRight,
  Sparkles,
  ExternalLink,
  BookOpen,
  X
} from 'lucide-react';

export interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messageCount: number;
}

interface ChatSidebarProps {
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
  onBackToHome: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenSupportDesk?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onBackToHome,
  onOpenKnowledgeBase,
  onOpenSupportDesk,
  isOpenMobile,
  onCloseMobile
}) => {
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      <aside
        className={`w-72 sm:w-80 bg-[#0D131E] border-r border-[#1D2533] flex flex-col justify-between shrink-0 h-full select-none transition-all duration-300 ${
          isOpenMobile
            ? 'fixed inset-y-0 left-0 shadow-2xl flex z-50 animate-in slide-in-from-left duration-200'
            : 'hidden md:flex z-30'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-[#1D2533]">
          
          <div className="flex items-center justify-between mb-4">
            <div
              onClick={onBackToHome}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="Return to Landing Page"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-105 transition-transform">
                M
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">
                  MaaProject
                </h1>
                <p className="text-[11px] text-[#8994A7] font-medium leading-none mt-0.5">
                  Maa AI Chat
                </p>
              </div>
            </div>

            {isOpenMobile && onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg bg-[#111722] text-[#8994A7] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewChat();
              if (onCloseMobile) onCloseMobile();
            }}
            id="sidebar-new-chat-btn"
            className="w-full gradient-btn py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 border border-blue-400/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Sessions / Conversation History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#687386] flex items-center justify-between">
            <span>Recent Conversations</span>
            <span className="text-[10px] font-normal text-[#8994A7]">{sessions.length}</span>
          </div>

          {sessions.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#8994A7] space-y-1">
              <p>No recent conversations</p>
              <p className="text-[11px] text-[#687386]">Start by asking a question</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`group relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#111722] text-white border border-[#293548] font-medium shadow-sm'
                      : 'text-[#8994A7] hover:bg-[#111722]/60 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#60A5FA]' : 'text-[#687386] group-hover:text-[#8994A7]'
                      }`}
                    />
                    <span className="truncate max-w-[160px] text-left">
                      {session.title || 'New Conversation'}
                    </span>
                  </div>

                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => onDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:text-rose-400 transition-opacity rounded"
                      title="Delete chat session"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Bottom User Profile & Navigation */}
        <div className="p-3 border-t border-[#1D2533] space-y-1 bg-[#080C14]/50">
          
          {/* Back to Home Button */}
          <button
            onClick={onBackToHome}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#8994A7] hover:text-white hover:bg-[#111722] transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <Home className="w-3.5 h-3.5 text-[#60A5FA]" />
              <span>Back to Landing Page</span>
            </div>
            <ChevronRight className="w-3 h-3 text-[#687386]" />
          </button>

          {/* Quick Knowledge Link */}
          {onOpenKnowledgeBase && (
            <button
              onClick={onOpenKnowledgeBase}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-[#8994A7] hover:text-white hover:bg-[#111722] transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>Knowledge Directory</span>
              </div>
              <ChevronRight className="w-3 h-3 text-[#687386]" />
            </button>
          )}

          {/* User Profile Card (Prepared for auth) */}
          <div className="pt-2 border-t border-[#1D2533] flex items-center justify-between px-2 py-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#111722] border border-[#1D2533] flex items-center justify-center text-[#60A5FA]">
                <User className="w-3.5 h-3.5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white flex items-center gap-1">
                  Public Guest
                </div>
                <div className="text-[10px] text-[#22C55E] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Active Session
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(!showSettingsModal)}
              className="p-1.5 text-[#8994A7] hover:text-white rounded-lg hover:bg-[#111722] transition-colors"
              title="Assistant Settings"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </aside>

      {/* Settings Modal (Lightweight) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#111722] rounded-2xl border border-[#1D2533] max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1D2533]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#60A5FA]" />
                AI Assistant Settings
              </h3>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="text-[#8994A7] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#8994A7]">
              <div>
                <span className="font-semibold text-white">Active Model:</span>
                <p className="mt-0.5 text-white/80">Gemini 3.7 Flash with Knowledge RAG Grounding</p>
              </div>

              <div>
                <span className="font-semibold text-white">Hallucination Guard:</span>
                <p className="mt-0.5 text-emerald-400">Strictly Enforced (Zero Unsupported Claims)</p>
              </div>

              <div>
                <span className="font-semibold text-white">Emergency Dispatch:</span>
                <p className="mt-0.5 text-white/80">1800-11-MAA-CARE (24/7 Enabled)</p>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full gradient-btn py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
};

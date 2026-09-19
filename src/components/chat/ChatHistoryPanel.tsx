import React from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  X,
  Clock,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ChatSession } from './ChatSidebar';

interface ChatHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
  activeSessionId: string;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string, e: React.MouseEvent) => void;
}

export const ChatHistoryPanel: React.FC<ChatHistoryPanelProps> = ({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Dark overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Right-side sliding panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 md:w-96 max-w-full bg-[#0D131E] border-l border-[#1D2533] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="p-4 border-b border-[#1D2533] flex items-center justify-between bg-[#101722]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">Chat History</h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {sessions.length} saved {sessions.length === 1 ? 'conversation' : 'conversations'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#161F2E] hover:bg-[#1E293B] text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close History"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action: New Chat Button */}
        <div className="p-3 border-b border-[#1D2533] bg-[#0A0F18]">
          <button
            onClick={() => {
              onNewChat();
              onClose();
            }}
            className="w-full gradient-btn py-2.5 px-4 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 border border-blue-400/25 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start New Conversation</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y-0">
          {sessions.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-slate-300">No chat history yet</p>
              <p className="text-[11px] text-slate-500 mt-1">Start chatting with Maa AI</p>
            </div>
          ) : (
            sessions.map((session) => {
              const isActive = session.id === activeSessionId;
              const dateStr = new Date(session.timestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={session.id}
                  onClick={() => {
                    onSelectSession(session.id);
                    onClose();
                  }}
                  className={`group relative flex items-center justify-between p-3 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#151E2E] text-white border border-cyan-500/40 shadow-sm'
                      : 'text-slate-300 hover:bg-[#131B28] hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 pr-2">
                    <MessageSquare
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate text-xs leading-snug">
                        {session.title || 'Conversation'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{dateStr}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {sessions.length > 1 && (
                      <button
                        onClick={(e) => onDeleteSession(session.id, e)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                        title="Delete conversation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Footer */}
        <div className="p-3 border-t border-[#1D2533] bg-[#0A0F18] flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1 text-[10px] text-cyan-400">
            <Sparkles className="w-3 h-3" />
            <span>Maa AI Smart Memory</span>
          </span>
          <button
            onClick={onClose}
            className="text-[11px] font-semibold text-slate-300 hover:text-white px-2 py-1 rounded bg-[#161F2E] border border-white/10"
          >
            Close
          </button>
        </div>

      </div>
    </>
  );
};

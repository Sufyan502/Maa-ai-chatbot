import React, { useState, useEffect } from 'react';
import { ChatSidebar, ChatSession } from '../components/chat/ChatSidebar';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatHistoryPanel } from '../components/chat/ChatHistoryPanel';
import { SuggestedPrompts } from '../components/chat/SuggestedPrompts';
import { ChatMessages } from '../components/chat/ChatMessages';
import { ChatInput } from '../components/chat/ChatInput';
import { ChatMessage } from '../types';
import { useNotifications } from '../context/NotificationContext';

interface ChatPageProps {
  onBackToHome: () => void;
  initialQuery?: string;
  onOpenReportWithContext: (contextStr: string) => void;
  onOpenContactModal: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenSupportDesk?: () => void;
  onNavigate?: (route: any, payload?: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({
  onBackToHome,
  initialQuery,
  onOpenReportWithContext,
  onOpenContactModal,
  onOpenKnowledgeBase,
  onOpenSupportDesk,
  onNavigate
}) => {
  const { addNotification } = useNotifications();
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('maa_chat_sessions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      {
        id: 'session-main',
        title: 'New Conversation',
        timestamp: Date.now(),
        messageCount: 0
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>('session-main');
  const [conversationsMap, setConversationsMap] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('maa_chat_messages_map');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      'session-main': []
    };
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [isHistoryRightOpen, setIsHistoryRightOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('maa_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('maa_chat_messages_map', JSON.stringify(conversationsMap));
  }, [conversationsMap]);

  // If initialQuery is passed when entering chat, trigger it automatically
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      handleSendMessage(initialQuery.trim());
    }
  }, []);

  const currentMessages = conversationsMap[activeSessionId] || [];

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setError(null);
    const userMessageId = `usr-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    // Update active conversation with user message
    const updatedMessages = [...currentMessages, userMsg];
    setConversationsMap((prev) => ({
      ...prev,
      [activeSessionId]: updatedMessages
    }));

    // Update session title if first message
    if (currentMessages.length === 0) {
      const summaryTitle = text.slice(0, 26) + (text.length > 26 ? '...' : '');
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, title: summaryTitle, messageCount: s.messageCount + 1 }
            : s
        )
      );
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messageCount: s.messageCount + 1 } : s
        )
      );
    }

    setIsLoading(true);

    try {
      // Build previous message history
      const historyPayload = currentMessages.map((m) => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(localStorage.getItem('maa_auth_token') ? { Authorization: `Bearer ${localStorage.getItem('maa_auth_token')}` } : {})
        },
        body: JSON.stringify({
          conversation_id: activeSessionId,
          message: text,
          history: historyPayload
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || data.message || 'I processed your query.',
        timestamp: Date.now(),
        sources: data.sources || [],
        navigationActions: data.navigationActions || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
        isProblemReportPrompt: data.isProblemReportPrompt || false,
        isEscalated: data.isEscalated || false,
        groundedScore: data.groundedScore || 100
      };

      setConversationsMap((prev) => ({
        ...prev,
        [activeSessionId]: [...(prev[activeSessionId] || []), aiMsg]
      }));

      // Trigger visual/auditory notification for incoming AI message
      addNotification({
        type: 'message',
        title: 'Maa AI Response',
        message:
          aiMsg.content.length > 90 ? aiMsg.content.slice(0, 90) + '...' : aiMsg.content,
        severity: aiMsg.isEscalated ? 'warning' : 'info',
        actionRoute: 'chat',
        playSound: true,
        showToast: true
      });

      // Speak if enabled
      if (isAudioEnabled && window.speechSynthesis) {
        speakText(aiMsg.content);
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setError('Something went wrong while generating the response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetryLastMessage = () => {
    if (currentMessages.length === 0) return;
    const lastUserMsg = [...currentMessages].reverse().find((m) => m.role === 'user');
    if (lastUserMsg) {
      handleSendMessage(lastUserMsg.content);
    }
  };

  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Conversation',
      timestamp: Date.now(),
      messageCount: 0
    };
    setSessions((prev) => [newSession, ...prev]);
    setConversationsMap((prev) => ({
      ...prev,
      [newId]: []
    }));
    setActiveSessionId(newId);
    setError(null);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const remaining = sessions.filter((s) => s.id !== id);
    if (remaining.length === 0) {
      handleNewChat();
      return;
    }
    setSessions(remaining);
    setConversationsMap((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    if (activeSessionId === id) {
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleClearConversation = () => {
    if (window.confirm('Clear messages in this conversation?')) {
      setConversationsMap((prev) => ({
        ...prev,
        [activeSessionId]: []
      }));
      setSessions((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messageCount: 0 } : s))
      );
      setError(null);
    }
  };

  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    // Clean markdown before speaking
    const cleanText = text.replace(/[*#_`\[\]()]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex h-[100dvh] h-screen w-full bg-[#080C14] text-white overflow-hidden selection:bg-[#2563EB]/30">
      
      {/* 1. Left Sidebar */}
      <ChatSidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setError(null);
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
        onBackToHome={onBackToHome}
        onOpenKnowledgeBase={onOpenKnowledgeBase}
        onOpenSupportDesk={onOpenSupportDesk}
        isOpenMobile={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
      />

      {/* 2. Main Chat Area */}
      <div className="flex-1 flex flex-col h-full bg-[#080C14] relative overflow-hidden">
        
        {/* Ambient Back Glows */}
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#2563EB]/8 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] bg-[#7C3AED]/8 rounded-full blur-[140px] pointer-events-none" />

        {/* Chat Header */}
        <ChatHeader
          onNewChat={handleNewChat}
          onClearConversation={handleClearConversation}
          onBackToHome={onBackToHome}
          onToggleSidebarMobile={() => setIsSidebarMobileOpen(true)}
          onToggleHistoryRight={() => setIsHistoryRightOpen(!isHistoryRightOpen)}
          isAudioEnabled={isAudioEnabled}
          onToggleAudio={() => setIsAudioEnabled(!isAudioEnabled)}
          onOpenKnowledgeBase={onOpenKnowledgeBase}
          onOpenSupportDesk={onOpenSupportDesk}
          onNavigate={onNavigate}
        />

        {/* Dynamic Center: Suggested Prompts OR Message Flow */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-between relative z-10">
          {currentMessages.length === 0 ? (
            <SuggestedPrompts onSelectPrompt={handleSendMessage} />
          ) : (
            <ChatMessages
              messages={currentMessages}
              isLoading={isLoading}
              error={error}
              onRetryLastMessage={handleRetryLastMessage}
              onOpenReportWithContext={onOpenReportWithContext}
              onOpenContactModal={onOpenContactModal}
              onSelectPrompt={handleSendMessage}
              onSpeakText={speakText}
            />
          )}
        </div>

        {/* Bottom Input Area */}
        <ChatInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />

      </div>

      {/* 3. Right-Side Chat History Slide-Over Panel */}
      <ChatHistoryPanel
        isOpen={isHistoryRightOpen}
        onClose={() => setIsHistoryRightOpen(false)}
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => {
          setActiveSessionId(id);
          setError(null);
        }}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteSession}
      />

    </div>
  );
};

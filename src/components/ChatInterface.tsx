import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Send, 
  Sparkles, 
  User, 
  Bot, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  ExternalLink, 
  AlertCircle, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  HeartPulse, 
  FileText, 
  PhoneCall, 
  CornerDownRight,
  LifeBuoy,
  Mic,
  MicOff
} from 'lucide-react';
import { ChatMessage, NavigationAction, SourceCitation } from '../types';

interface ChatInterfaceProps {
  onOpenReportWithContext?: (initialQuery: string) => void;
  onNavigateToTab?: (tab: 'knowledge' | 'tickets' | 'tests' | 'docs') => void;
  onOpenContactModal?: () => void;
}

const INITIAL_SUGGESTIONS = [
  { label: 'What is MaaProject?', query: 'What is MaaProject and what are its core objectives?' },
  { label: 'What services are available?', query: 'What services does MaaProject provide?' },
  { label: 'Are services free?', query: 'Are MaaProject services and doctor consultations free of cost?' },
  { label: 'How to apply for welfare grant?', query: 'How do I apply for the Maa Welfare Scheme grants step by step?' },
  { label: 'Book doctor tele-consultation', query: 'How do I book a free maternal tele-consultation with a doctor?' },
  { label: '24/7 Emergency Helpline', query: 'What is the 24/7 Emergency Care helpline number and when should I call?' },
  { label: 'Report payment delay', query: 'I am having a problem with my Janani Nutrition Grant payment delay.' },
  { label: 'Official contact details', query: 'What are the verified official contact details for MaaProject?' }
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  onOpenReportWithContext,
  onNavigateToTab,
  onOpenContactModal
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      role: 'assistant',
      content: `### Welcome to **Maa AI Chat** 👋

I am your official, knowledge-grounded assistant for the **MaaProject** platform. I can help you:

* 🩺 **Explore Healthcare Services**: Maternal tele-triage, ANC milestones, and pregnancy screening.
* 💰 **Access Welfare Grants**: Step-by-step guidance for the Janani Nutrition Grant and girl child scholarships.
* 🥦 **Nutrition Kits**: Find distribution centers for fortified foods and IFA supplements.
* 📍 **Platform Navigation**: Direct links to portals, appointment bookings, and verified documents.
* 🚨 **24/7 Emergency Support**: Immediate toll-free access to **1800-11-MAA-CARE (1800-11-6222)**.
* 🎫 **Problem Reporting**: Report application delays or technical errors and generate tracked support tickets.

*All answers are strictly verified against the approved MaaProject Knowledge Base.* How may I assist you today?`,
      timestamp: Date.now(),
      sources: [
        {
          docId: 'maa-about-01',
          title: 'About MaaProject — Mission, Vision & Core Objectives',
          category: 'about',
          snippet: 'Integrated public welfare initiative providing maternal healthcare, community welfare, and digital empowerment.'
        }
      ],
      suggestedFollowUps: [
        'What services are available?',
        'How do I apply for the welfare grant?',
        'What is the 24/7 emergency helpline?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || isLoading) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: Date.now()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(localStorage.getItem('maa_auth_token') ? { Authorization: `Bearer ${localStorage.getItem('maa_auth_token')}` } : {}) },
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content
          }))
        })
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        timestamp: Date.now(),
        sources: data.sources || [],
        navigationActions: data.navigationActions || [],
        suggestedFollowUps: data.suggestedFollowUps || [],
        isProblemReportPrompt: data.isProblemReportPrompt,
        isEscalated: data.isEscalated,
        groundedScore: data.groundedScore
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `I apologize, but I encountered a temporary connection issue. Please check your internet connection or try again.\n\nFor immediate assistance, please call the official MaaProject National Helpline at **1800-11-6222** or email **support@maaproject.org**.`,
        timestamp: Date.now(),
        sources: [
          {
            docId: 'maa-contact-01',
            title: 'Verified Official Contact Details',
            category: 'contact',
            snippet: 'National Helpline: 1800-11-MAA-CARE (1800-11-6222)'
          }
        ]
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSpeakMessage = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingMsgId === id) {
        window.speechSynthesis.cancel();
        setSpeakingMsgId(null);
        return;
      }
      window.speechSynthesis.cancel();
      // Clean markdown tags for clear speech
      const cleaned = text.replace(/[#*`_\[\]()]/g, ' ');
      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.rate = 1.0;
      utterance.onend = () => setSpeakingMsgId(null);
      utterance.onerror = () => setSpeakingMsgId(null);
      setSpeakingMsgId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        setIsListening(false);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);

      recognition.start();
    } catch (e) {
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    if (confirm('Are you sure you want to reset this conversation session?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          content: `Session restarted. How can I help you with **MaaProject** today?`,
          timestamp: Date.now(),
          suggestedFollowUps: [
            'What services are available?',
            'How do I apply for the welfare grant?',
            'What is the 24/7 emergency helpline?'
          ]
        }
      ]);
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  };

  const handleNavigationClick = (route: string) => {
    if (route.includes('report') || route.includes('ticket')) {
      if (onOpenReportWithContext) {
        onOpenReportWithContext('General Support Query');
      } else if (onNavigateToTab) {
        onNavigateToTab('tickets');
      }
    } else if (route.includes('contact')) {
      if (onOpenContactModal) {
        onOpenContactModal();
      }
    } else if (route.includes('maternal') || route.includes('welfare') || route.includes('service')) {
      if (onNavigateToTab) {
        onNavigateToTab('knowledge');
      }
    }
  };

  return (
    <div id="chat-interface-root" className="flex flex-col h-[calc(100vh-4.5rem)] max-w-5xl mx-auto px-2 sm:px-4 py-3">
      
      {/* Top Context & Status Banner */}
      <div className="flex items-center justify-between px-4 py-2 mb-2 bg-white/[0.04] border border-white/10 rounded-2xl text-xs text-slate-300 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <span className="font-semibold text-slate-200">MaaProject Grounded RAG Engine</span>
          <span className="text-emerald-400 font-mono hidden sm:inline">• Gemini 3.7 Flash Active</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors font-medium cursor-pointer"
            title="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Session</span>
          </button>
        </div>
      </div>

      {/* Scrollable Conversation Container */}
      <div id="chat-messages-container" className="flex-1 overflow-y-auto space-y-4 px-3 sm:px-4 py-4 rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl">
        {messages.map((msg) => (
          <div
            key={msg.id}
            id={`message-bubble-${msg.id}`}
            className={`flex gap-3 sm:gap-4 max-w-4xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                msg.role === 'user'
                  ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border border-indigo-400/30'
                  : msg.isEscalated
                  ? 'bg-red-600 text-white animate-pulse shadow-red-500/40'
                  : 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white border border-emerald-400/30 shadow-emerald-950/40'
              }`}
            >
              {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
            </div>

            {/* Message Body */}
            <div className="flex flex-col gap-2 max-w-[88%] sm:max-w-[80%]">
              
              {/* Emergency Banner if Escalated */}
              {msg.isEscalated && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-semibold backdrop-blur-md">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>EMERGENCY ESCALATION: 24/7 Line 1800-11-6222 is active.</span>
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-tr from-indigo-600/90 to-purple-600/90 text-white rounded-tr-xs border border-indigo-400/30 shadow-lg shadow-indigo-950/40 backdrop-blur-md'
                    : 'bg-white/[0.05] text-slate-100 border border-white/10 rounded-tl-xs backdrop-blur-xl shadow-md'
                }`}
              >
                <div className="markdown-body prose prose-invert prose-sm max-w-none text-slate-200 prose-p:my-1 prose-headings:font-bold prose-headings:text-slate-100 prose-headings:my-2 prose-ul:my-1 prose-li:my-0.5 prose-strong:text-white">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              </div>

              {/* Navigation Action Buttons if provided */}
              {msg.navigationActions && msg.navigationActions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.navigationActions.map((action, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleNavigationClick(action.route)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-emerald-300 border border-white/15 text-xs font-semibold transition-all shadow-xs backdrop-blur-md cursor-pointer active:scale-98"
                    >
                      <CornerDownRight className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{action.label}</span>
                      <ExternalLink className="w-3 h-3 text-emerald-400 opacity-70" />
                    </button>
                  ))}
                </div>
              )}

              {/* Problem Reporting / Support Ticket Banner if Prompted */}
              {msg.isProblemReportPrompt && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs text-amber-200 backdrop-blur-md">
                  <div className="flex items-center gap-2">
                    <LifeBuoy className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Experiencing a service delay or technical error?</span>
                  </div>
                  <button
                    onClick={() => onOpenReportWithContext && onOpenReportWithContext(msg.content)}
                    className="px-3 py-1 bg-amber-500/80 hover:bg-amber-500 text-slate-950 font-bold rounded-lg shrink-0 shadow-xs transition-colors cursor-pointer"
                  >
                    Open Support Ticket
                  </button>
                </div>
              )}

              {/* Source Citations */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Grounded in:
                  </span>
                  {msg.sources.map((src, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/10 text-indigo-200 border border-white/10 font-medium backdrop-blur-xs"
                      title={src.snippet}
                    >
                      {src.title}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions: Copy, Text-to-Speech */}
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 pt-0.5 text-slate-400">
                  <button
                    onClick={() => handleCopyMessage(msg.id, msg.content)}
                    className="p-1 hover:text-slate-200 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Copy response"
                  >
                    {copiedMsgId === msg.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px]">{copiedMsgId === msg.id ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={() => handleSpeakMessage(msg.id, msg.content)}
                    className="p-1 hover:text-slate-200 rounded transition-colors text-xs flex items-center gap-1 cursor-pointer"
                    title="Listen to response"
                  >
                    {speakingMsgId === msg.id ? (
                      <VolumeX className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                    ) : (
                      <Volume2 className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px]">{speakingMsgId === msg.id ? 'Stop' : 'Listen'}</span>
                  </button>
                </div>
              )}

              {/* Suggested Follow-ups */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && msg.id === messages[messages.length - 1]?.id && (
                <div className="pt-2 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(chip)}
                      className="px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-colors font-medium cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              )}

            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex gap-3 max-w-2xl mr-auto items-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 flex items-center justify-center text-white shrink-0 shadow-md border border-emerald-400/30">
              <Bot className="w-5 h-5" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-slate-300 text-xs flex items-center gap-2">
              <div className="flex gap-1 items-center">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
              </div>
              <span>Searching verified MaaProject knowledge base...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Starter Chips (Shown when messages <= 2) */}
      {messages.length <= 2 && (
        <div className="py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Popular:
          </span>
          {INITIAL_SUGGESTIONS.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.query)}
              className="shrink-0 px-3 py-1.5 rounded-xl text-xs bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 backdrop-blur-md transition-all font-medium shadow-xs cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <div className="mt-2 bg-white/[0.05] p-2 rounded-2xl border border-white/15 backdrop-blur-xl shadow-xl focus-within:ring-2 focus-within:ring-emerald-500/40 focus-within:border-emerald-400 transition-all">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            id="chat-input-field"
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask about MaaProject services, welfare schemes, doctor appointments, or report an issue..."
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
            disabled={isLoading}
          />

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={handleVoiceInput}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isListening
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : 'text-slate-400 hover:text-white hover:bg-white/10 border-white/10'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Send Button */}
          <button
            id="chat-send-btn"
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className={`p-2.5 rounded-xl font-semibold transition-all flex items-center justify-center ${
              inputQuery.trim() && !isLoading
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25 cursor-pointer active:scale-95'
                : 'bg-white/5 text-slate-600 cursor-not-allowed border border-white/5'
            }`}
            title="Send Message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

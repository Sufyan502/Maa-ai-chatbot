import React, { useRef, useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Bot,
  User,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Volume2,
  ChevronRight,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  Type,
  Sparkles
} from 'lucide-react';
import { ChatMessage, SourceCitation } from '../../types';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  onRetryLastMessage?: () => void;
  onOpenReportWithContext?: (contextStr: string) => void;
  onOpenContactModal?: () => void;
  onSelectPrompt?: (prompt: string) => void;
  onSpeakText?: (text: string) => void;
}

type TextSize = 'sm' | 'base' | 'lg';

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
  error,
  onRetryLastMessage,
  onOpenReportWithContext,
  onOpenContactModal,
  onSelectPrompt,
  onSpeakText
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [textSize, setTextSize] = useState<TextSize>('base');

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, error]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const increaseTextSize = () => {
    if (textSize === 'sm') setTextSize('base');
    else if (textSize === 'base') setTextSize('lg');
  };

  const decreaseTextSize = () => {
    if (textSize === 'lg') setTextSize('base');
    else if (textSize === 'base') setTextSize('sm');
  };

  // Font size class mapper for AI responses
  const getProseSizeClass = () => {
    switch (textSize) {
      case 'sm':
        return 'text-xs leading-relaxed';
      case 'lg':
        return 'text-base leading-relaxed';
      case 'base':
      default:
        return 'text-sm leading-relaxed';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-6 space-y-5">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          if (isUser) {
            // USER MESSAGE BUBBLE - Sleek, tight padding, clean bubble geometry
            return (
              <div
                key={msg.id}
                className="flex items-end justify-end gap-2.5 pl-8 sm:pl-16"
              >
                <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
                  <div className="px-4 py-2.5 rounded-2xl rounded-tr-xs bg-gradient-to-r from-[#2563EB] to-[#7C3AED] text-white text-xs sm:text-sm font-normal shadow-md shadow-blue-900/20 border border-blue-400/20 break-words leading-snug select-text">
                    {msg.content}
                  </div>
                  <span className="text-[10px] text-[#687386] mt-1 mr-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="w-7 h-7 rounded-lg bg-[#7C3AED]/30 border border-[#7C3AED]/50 flex items-center justify-center text-white shrink-0 shadow-sm mb-4">
                  <User className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          }

          // AI RESPONSE BUBBLE - High-craft typography & formatting
          return (
            <div
              key={msg.id}
              className="flex items-start gap-3 pr-4 sm:pr-12 group"
            >
              {/* AI Avatar */}
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md border border-blue-400/30">
                <Bot className="w-4 h-4" />
              </div>

              {/* AI Content Area */}
              <div className="flex-1 min-w-0 space-y-2.5">
                
                {/* Main Card */}
                <div className="bg-[#111722] border border-[#1D2533] rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-lg shadow-black/40 text-white transition-all hover:border-[#293548]">
                  
                  {/* Top Bar with Formatting / Text Size Controls */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1D2533] text-xs text-[#8994A7]">
                    <div className="flex items-center gap-1.5 font-semibold text-[#60A5FA] text-[11px]">
                      <Sparkles className="w-3 h-3 text-[#60A5FA]" />
                      <span>Maa AI Assistant</span>
                    </div>

                    {/* Text Size & Quick Actions */}
                    <div className="flex items-center gap-1 bg-[#080C14] px-2 py-0.5 rounded-lg border border-[#1D2533]">
                      <button
                        onClick={decreaseTextSize}
                        disabled={textSize === 'sm'}
                        className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${
                          textSize === 'sm' ? 'opacity-30 cursor-not-allowed' : 'text-[#8994A7]'
                        }`}
                        title="Decrease text size (A-)"
                      >
                        <ZoomOut className="w-3 h-3" />
                      </button>

                      <span className="text-[10px] font-mono text-white/80 px-1 font-semibold">
                        {textSize === 'sm' ? 'A (Small)' : textSize === 'base' ? 'A (Normal)' : 'A (Large)'}
                      </span>

                      <button
                        onClick={increaseTextSize}
                        disabled={textSize === 'lg'}
                        className={`p-1 rounded hover:text-white transition-colors cursor-pointer ${
                          textSize === 'lg' ? 'opacity-30 cursor-not-allowed' : 'text-[#8994A7]'
                        }`}
                        title="Increase text size (A+)"
                      >
                        <ZoomIn className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Super Clear Markdown Renderer */}
                  <div className={`prose prose-invert max-w-none ${getProseSizeClass()} space-y-2`}>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-base sm:text-lg font-bold text-white tracking-tight pb-1 border-b border-[#1D2533] my-2 text-left">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-sm sm:text-base font-bold text-white tracking-tight my-1.5 text-left">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xs sm:text-sm font-semibold text-cyan-300 my-1 text-left">
                            {children}
                          </h3>
                        ),
                        h4: ({ children }) => (
                          <h4 className="text-xs sm:text-sm font-semibold text-slate-200 my-1 text-left">
                            {children}
                          </h4>
                        ),
                        p: ({ children }) => (
                          <p className="my-1.5 text-slate-200 leading-relaxed text-left text-sm sm:text-[14.5px] font-normal">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-semibold text-white tracking-normal">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-slate-300 font-normal">
                            {children}
                          </em>
                        ),
                        u: ({ children }) => (
                          <u className="underline decoration-cyan-400/60 underline-offset-3 text-white font-normal">
                            {children}
                          </u>
                        ),
                        del: ({ children }) => (
                          <del className="line-through text-[#687386]">
                            {children}
                          </del>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 space-y-1 my-2 text-slate-200 marker:text-cyan-400">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-5 space-y-1 my-2 text-slate-200 marker:text-cyan-400">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed pl-0.5 text-left text-sm sm:text-[14.5px]">
                            {children}
                          </li>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="bg-[#0A0F1A] border-l-2 border-cyan-500 pl-3.5 pr-3 py-2 my-2.5 rounded-r-lg text-slate-300 text-xs sm:text-sm leading-relaxed">
                            {children}
                          </blockquote>
                        ),
                        code: ({ children }) => (
                          <code className="bg-[#162032] text-cyan-300 px-1.5 py-0.5 rounded font-mono text-xs font-medium">
                            {children}
                          </code>
                        ),
                        hr: () => <hr className="border-[#1D2533] my-3" />,
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-2.5 rounded-xl border border-[#1D2533]">
                            <table className="w-full text-xs text-left border-collapse">
                              {children}
                            </table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="bg-[#0D131E] border-b border-[#1D2533] px-3 py-2 text-white font-semibold">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="border-b border-[#1D2533]/50 px-3 py-2 text-slate-300">
                            {children}
                          </td>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/40 underline-offset-2 transition-colors font-medium"
                          >
                            {children}
                          </a>
                        )
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>

                {/* Problem Reporting Prompt */}
                {msg.isProblemReportPrompt && onOpenReportWithContext && (
                  <div className="bg-[#111722] rounded-xl border border-amber-500/30 p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-amber-300">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>Need official grievance tracking for this issue?</span>
                    </div>
                    <button
                      onClick={() => onOpenReportWithContext(msg.content)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>Create Support Ticket</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && onSelectPrompt && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {msg.suggestedFollowUps.map((fu: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => onSelectPrompt(fu)}
                        className="px-2.5 py-1 rounded-lg bg-[#111722] hover:bg-[#151D2C] border border-[#1D2533] hover:border-[#293548] text-[11px] text-[#8994A7] hover:text-white transition-all text-left flex items-center gap-1 cursor-pointer"
                      >
                        <span>{fu}</span>
                        <ChevronRight className="w-3 h-3 text-[#687386]" />
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Meta Actions (Copy / Speech / Timestamp) */}
                <div className="flex items-center gap-3 text-[11px] text-[#687386] px-1">
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    className="hover:text-[#8994A7] transition-colors flex items-center gap-1 cursor-pointer"
                    title="Copy response"
                  >
                    {copiedId === msg.id ? (
                      <>
                        <Check className="w-3 h-3 text-[#22C55E]" />
                        <span className="text-[#22C55E]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {onSpeakText && (
                    <button
                      onClick={() => onSpeakText(msg.content)}
                      className="hover:text-[#8994A7] transition-colors flex items-center gap-1 cursor-pointer"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Read</span>
                    </button>
                  )}

                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

              </div>
            </div>
          );
        })}

        {/* Realistic 'Maa AI is typing...' Visual Indicator in Chat Stream */}
        {isLoading && (
          <div className="flex items-start gap-3 pr-4 sm:pr-12 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* AI Avatar with subtle glowing pulse */}
            <div className="relative shrink-0 mt-0.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#7C3AED] flex items-center justify-center text-white shadow-md border border-blue-400/40">
                <Bot className="w-4 h-4" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500 border border-[#080C14]"></span>
              </span>
            </div>

            {/* Realistic Typing Bubble */}
            <div className="bg-[#0E1522] border border-[#1D2533] hover:border-[#2563EB]/40 p-4 rounded-2xl rounded-tl-xs shadow-md shadow-black/30 space-y-2.5 max-w-sm sm:max-w-md transition-colors">
              {/* Header Label with Sparkles */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 font-medium text-cyan-400">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-cyan-400 [animation-duration:3s]" />
                  <span className="font-semibold text-[13px] tracking-tight text-slate-200">
                    Maa AI is typing<span className="inline-flex animate-pulse">...</span>
                  </span>
                </div>
                <span className="text-[10px] text-[#687386] font-medium tracking-wide uppercase">
                  Generating
                </span>
              </div>

              {/* Realistic 3-Dot Wave Animation */}
              <div className="flex items-center gap-1.5 py-1 px-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.32s] shadow-xs shadow-cyan-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.16s] shadow-xs shadow-blue-500/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce shadow-xs shadow-indigo-500/50" />
                <span className="text-[11px] text-[#8994A7] ml-2 italic select-none">
                  Preparing verified response...
                </span>
              </div>

              {/* Subtle Shimmer Bar */}
              <div className="w-full bg-[#162032] h-1 rounded-full overflow-hidden">
                <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full animate-[shimmer_1.5s_infinite] -translate-x-full" />
              </div>
            </div>
          </div>
        )}

        {/* Error State Banner with Retry */}
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-300 flex items-center justify-between gap-4 max-w-xl mx-auto">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>Something went wrong while generating the response. Please try again.</span>
            </div>
            {onRetryLastMessage && (
              <button
                onClick={onRetryLastMessage}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-white font-semibold flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

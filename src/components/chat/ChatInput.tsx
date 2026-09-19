import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff, Sparkles, X, FileCheck } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  onOpenReportModal?: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  isLoading,
  onOpenReportModal
}) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [attachedFile, setAttachedFile] = useState<{ name: string; size: string } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    let messageToSend = input.trim();
    if (attachedFile) {
      messageToSend = `[Attached Document: ${attachedFile.name} (${attachedFile.size})]\n${messageToSend}`;
      setAttachedFile(null);
    }

    onSendMessage(messageToSend);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Web Speech recognition for accessibility
  const toggleVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use keyboard input.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.warn('Speech error:', e);
      setIsListening(false);
    }
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
        : `${Math.round(file.size / 1024)} KB`;
      setAttachedFile({
        name: file.name,
        size: sizeStr
      });
    }
  };

  return (
    <div className="bg-[#101722]/95 backdrop-blur-xl border-t border-[#1D2533] p-3 sm:p-4 shrink-0 z-20">
      <div className="max-w-3xl mx-auto space-y-2">
        
        {/* Attached file preview chip */}
        {attachedFile && (
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-[#111722] border border-[#2563EB]/40 text-xs text-white max-w-sm">
            <div className="flex items-center gap-2 truncate">
              <FileCheck className="w-4 h-4 text-[#60A5FA] shrink-0" />
              <span className="truncate font-medium">{attachedFile.name}</span>
              <span className="text-[10px] text-[#8994A7]">({attachedFile.size})</span>
            </div>
            <button
              onClick={() => setAttachedFile(null)}
              className="p-1 hover:text-rose-400 text-[#8994A7]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Input Box Container */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-[#080C14] rounded-2xl border border-[#1D2533] focus-within:border-[#2563EB]/70 focus-within:ring-1 focus-within:ring-[#2563EB]/40 p-2 sm:p-2.5 transition-all shadow-inner"
        >
          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelected}
            className="hidden"
            accept=".pdf,.doc,.docx,.jpg,.png,.txt"
          />

          {/* Attachment Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-[#8994A7] hover:text-white rounded-xl hover:bg-[#111722] transition-colors shrink-0 cursor-pointer"
            title="Attach Document / MCP Card / Prescriptions"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Voice Input Button */}
          <button
            type="button"
            onClick={toggleVoiceInput}
            className={`p-2 rounded-xl transition-colors shrink-0 cursor-pointer ${
              isListening
                ? 'bg-rose-500/20 text-rose-400 animate-pulse border border-rose-500/40'
                : 'text-[#8994A7] hover:text-white hover:bg-[#111722]'
            }`}
            title={isListening ? 'Listening... Speak now' : 'Voice Input (Click to Speak)'}
          >
            {isListening ? <Mic className="w-4 h-4 text-rose-400" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Maa AI Chat..."
            rows={1}
            disabled={isLoading}
            className="flex-1 bg-transparent text-white placeholder-[#687386] text-xs sm:text-sm resize-none focus:outline-none py-1.5 px-1 max-h-36 leading-relaxed"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            id="chat-send-btn"
            className={`p-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
              input.trim() && !isLoading
                ? 'gradient-btn text-white shadow-md shadow-blue-600/30'
                : 'bg-[#111722] text-[#687386] cursor-not-allowed border border-[#1D2533]'
            }`}
          >
            <span className="hidden sm:inline">Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Disclaimer Footer Note */}
        <div className="flex items-center justify-between text-[11px] text-[#687386] px-1">
          <span>AI can make mistakes. Verify important information.</span>
          <span className="hidden sm:inline">Shift + Enter for new line • Enter to send</span>
        </div>

      </div>
    </div>
  );
};

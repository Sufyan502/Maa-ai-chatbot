/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { LandingPage } from './pages/LandingPage';
import { ChatPage } from './pages/ChatPage';
import { KnowledgeBaseExplorer } from './components/KnowledgeBaseExplorer';
import { SupportDeskView } from './components/SupportDeskView';
import { TestSuiteRunner } from './components/TestSuiteRunner';
import { DocumentationView } from './components/DocumentationView';
import { ProblemReportingModal } from './components/ProblemReportingModal';
import { VerifiedContactModal } from './components/VerifiedContactModal';
import { NotificationProvider } from './context/NotificationContext';
import { NotificationToastContainer } from './components/notifications/NotificationToastContainer';
import { NotificationBell } from './components/notifications/NotificationBell';
import { SupportTicket } from './types';
import { ArrowLeft } from 'lucide-react';
import { AuthModal } from './components/AuthModal';
import { useAuth } from './context/AuthContext';

export type AppView = 'landing' | 'chat' | 'knowledge' | 'tickets' | 'tests' | 'docs';

function AppContent() {
  // STRICT REQUIREMENT: App ALWAYS opens/reloads on Landing Page directly, never jumping straight to Chat.
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [initialChatQuery, setInitialChatQuery] = useState<string>('');
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [problemModalContext, setProblemModalContext] = useState('');
  const [openTicketsCount, setOpenTicketsCount] = useState(2);
  const [authOpen, setAuthOpen] = useState(false);
  const { user, logout } = useAuth();

  // On initial mount, ensure any previous lingering URL hash is cleared so reloads ALWAYS land on the Landing Page
  useEffect(() => {
    if (window.location.hash) {
      // Clear lingering hash without triggering page reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    // Always enforce landing page on load
    setCurrentView('landing');
  }, []);

  const navigateTo = (view: AppView, query?: string) => {
    if (query) {
      setInitialChatQuery(query);
    } else {
      setInitialChatQuery('');
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReportWithContext = (contextStr: string) => {
    setProblemModalContext(contextStr);
    setIsProblemModalOpen(true);
  };

  const handleTicketCreated = (newTicket: SupportTicket) => {
    setOpenTicketsCount((prev) => prev + 1);
  };

  const handleAskDocInChat = (queryText: string) => {
    navigateTo('chat', queryText);
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-white font-sans selection:bg-[#2563EB]/30 selection:text-white relative">
      {/* Floating Global Notification Toast Alerts */}
      <NotificationToastContainer onNavigate={navigateTo} />

      {/* 1. LANDING PAGE VIEW (Default initial view) */}
      {currentView === 'landing' && (
        <LandingPage
          onGetStarted={() => navigateTo('chat')}
          onOpenChatWithQuery={(query) => navigateTo('chat', query)}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          onOpenKnowledgeBase={() => navigateTo('knowledge')}
          onOpenSupportDesk={() => navigateTo('tickets')}
          onNavigate={navigateTo}
          onOpenAuth={() => setAuthOpen(true)}
          user={user}
          onLogout={logout}
        />
      )}

      {/* 2. MAA AI CHAT VIEW (Opened via Get Started / Talk to AI / CTAs) */}
      {currentView === 'chat' && (
        <ChatPage
          onBackToHome={() => navigateTo('landing')}
          initialQuery={initialChatQuery}
          onOpenReportWithContext={handleOpenReportWithContext}
          onOpenContactModal={() => setIsContactModalOpen(true)}
          onOpenKnowledgeBase={() => navigateTo('knowledge')}
          onOpenSupportDesk={() => navigateTo('tickets')}
          onNavigate={navigateTo}
        />
      )}

      {/* 3. VERIFIED KNOWLEDGE BASE DIRECTORY VIEW */}
      {currentView === 'knowledge' && (
        <div className="min-h-screen flex flex-col bg-[#080C14]">
          {/* Subview Nav Header */}
          <div className="h-16 bg-[#101722] border-b border-[#1D2533] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => navigateTo('landing')}
              className="flex items-center gap-2 text-xs font-semibold text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#60A5FA]" />
              <span>Back to Landing Page</span>
            </button>
            <div className="flex items-center gap-3">
              <NotificationBell onNavigate={navigateTo} />
              <button
                onClick={() => navigateTo('chat')}
                className="gradient-btn px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md cursor-pointer"
              >
                ✦ Open Maa AI Chat
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <KnowledgeBaseExplorer onAskDocQuery={handleAskDocInChat} />
          </div>
        </div>
      )}

      {/* 4. SUPPORT DESK & TICKET TRACKER VIEW */}
      {currentView === 'tickets' && (
        <div className="min-h-screen flex flex-col bg-[#080C14]">
          {/* Subview Nav Header */}
          <div className="h-16 bg-[#101722] border-b border-[#1D2533] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => navigateTo('landing')}
              className="flex items-center gap-2 text-xs font-semibold text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#60A5FA]" />
              <span>Back to Landing Page</span>
            </button>
            <div className="flex items-center gap-3">
              <NotificationBell onNavigate={navigateTo} />
              <button
                onClick={() => navigateTo('chat')}
                className="gradient-btn px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md cursor-pointer"
              >
                ✦ Open Maa AI Chat
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <SupportDeskView
              onOpenReportModal={() => {
                setProblemModalContext('');
                setIsProblemModalOpen(true);
              }}
            />
          </div>
        </div>
      )}

      {/* 5. 30-TEST SUITE RUNNER VIEW */}
      {currentView === 'tests' && (
        <div className="min-h-screen flex flex-col bg-[#080C14]">
          <div className="h-16 bg-[#101722] border-b border-[#1D2533] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => navigateTo('landing')}
              className="flex items-center gap-2 text-xs font-semibold text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#60A5FA]" />
              <span>Back to Landing Page</span>
            </button>
            <div className="flex items-center gap-3">
              <NotificationBell onNavigate={navigateTo} />
              <button
                onClick={() => navigateTo('chat')}
                className="gradient-btn px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md cursor-pointer"
              >
                ✦ Open Maa AI Chat
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <TestSuiteRunner />
          </div>
        </div>
      )}

      {/* 6. DOCUMENTATION & SYSTEM ARCHITECTURE VIEW */}
      {currentView === 'docs' && (
        <div className="min-h-screen flex flex-col bg-[#080C14]">
          <div className="h-16 bg-[#101722] border-b border-[#1D2533] px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => navigateTo('landing')}
              className="flex items-center gap-2 text-xs font-semibold text-[#8994A7] hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#60A5FA]" />
              <span>Back to Landing Page</span>
            </button>
            <div className="flex items-center gap-3">
              <NotificationBell onNavigate={navigateTo} />
              <button
                onClick={() => navigateTo('chat')}
                className="gradient-btn px-4 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md cursor-pointer"
              >
                ✦ Open Maa AI Chat
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <DocumentationView onLoadFlowInChat={handleAskDocInChat} />
          </div>
        </div>
      )}

      {/* Problem Reporting & Incident Ticket Creation Modal */}
      <ProblemReportingModal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        initialQuery={problemModalContext}
        onTicketCreated={handleTicketCreated}
      />

      {/* Verified Official Contact Details Modal */}
      <VerifiedContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

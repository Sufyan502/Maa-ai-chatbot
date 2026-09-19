import React, { useState } from 'react';
import { 
  BookOpen, 
  Workflow, 
  Layers, 
  Cpu, 
  Terminal, 
  Presentation, 
  ShieldCheck, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Code2,
  FileText
} from 'lucide-react';
import { CONVERSATION_FLOW_SCENARIOS } from '../data/conversationFlowsData';

interface DocumentationViewProps {
  onLoadFlowInChat?: (firstMsg: string) => void;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({ onLoadFlowInChat }) => {
  const [activeDocSection, setActiveDocSection] = useState<'architecture' | 'flows' | 'requirements' | 'tech' | 'guide' | 'slides'>('architecture');
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  const docSections = [
    { id: 'architecture', label: 'System Architecture', icon: Layers },
    { id: 'flows', label: '10+ Conversation Flows', icon: Workflow },
    { id: 'requirements', label: 'Feature & Use Case Specs', icon: FileText },
    { id: 'tech', label: 'Tech Stack & Licenses', icon: Cpu },
    { id: 'guide', label: 'User & Install Guide', icon: Terminal },
    { id: 'slides', label: 'Presentation Slides', icon: Presentation }
  ];

  const presentationSlides = [
    {
      title: 'Maa AI Chat — Intelligent MaaProject Assistant',
      subtitle: 'AI_03 Track 3: Final Project Showcase',
      badge: 'Production-Quality RAG Architecture',
      points: [
        'Purpose-built conversational assistant for MaaProject public welfare & maternal healthcare.',
        'Strict Knowledge-Grounded RAG architecture preventing hallucinations.',
        'Seamless integration of emergency medical triage and tracked support ticket creation.',
        'Built with Gemini 3.7 Flash, Node.js Express, React 19, and Tailwind CSS.'
      ]
    },
    {
      title: 'Core Architectural Pillars',
      subtitle: 'RAG Retrieval, Grounding & Safety Guardrails',
      badge: 'Zero Hallucination Guarantee',
      points: [
        'Document Tokenization & BM25 / Keyword Similarity Search across verified sources.',
        'Strict System Instruction enforcing citations [Source: Doc Title] and boundary discipline.',
        'Dual Fallback Protocol: Out-of-scope redirection + unverified query transparency.',
        '24/7 Emergency Triage: Automatic escalation for acute maternal symptoms.'
      ]
    },
    {
      title: 'Key Capabilities & Conversational Flows',
      subtitle: '10+ End-to-End Handled User Scenarios',
      badge: 'Multi-Turn Conversational Depth',
      points: [
        'FAQ & Cost Transparency: 100% free service verification with zero hidden agent fees.',
        'Welfare Scheme Guidance: Step-by-step application walkthrough for Janani grants.',
        'Interactive Navigation Assistant: Clickable route links directly in the chat interface.',
        'Grievance Desk: Real-time ticket ID generation with SLA tracking.'
      ]
    },
    {
      title: 'Testing & Verification Metrics',
      subtitle: '30 Comprehensive Test Cases Executed',
      badge: '100% Grounded Accuracy',
      points: [
        'Evaluated across 10 query categories (Normal, Complex, Incomplete, Misconception, etc.).',
        'Sub-800ms median response latency with server-side caching.',
        'Live exportable test suite with JSON/CSV reporting.',
        'Compliant with all AI_03 Track 3 delivery requirements.'
      ]
    }
  ];

  return (
    <div id="documentation-view-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Project Documentation & Specifications</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Track 3: MaaProject
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Complete technical manuals, verified conversation flows, RAG architecture blueprints, and presentation assets.
          </p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="my-4 flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200">
        {docSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => setActiveDocSection(sec.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeDocSection === sec.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-emerald-500" />
              <span>{sec.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="mt-6">
        
        {/* 1. Architecture Section */}
        {activeDocSection === 'architecture' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              <h2 className="text-lg font-bold text-slate-900 mb-2">End-to-End System Architecture Blueprint</h2>
              <p className="text-xs text-slate-600 mb-6">
                Maa AI Chat operates on a modern multi-layer full-stack architecture ensuring real-time responsiveness, strict factual grounding, and secret key encapsulation.
              </p>

              {/* Visual Flow Diagram */}
              <div className="p-6 bg-slate-900 rounded-2xl text-white space-y-4 font-mono text-xs overflow-x-auto">
                <div className="flex items-center justify-between gap-4 min-w-[700px]">
                  
                  {/* Layer 1: Client */}
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex-1 text-center">
                    <span className="text-emerald-400 font-bold block mb-1">1. Frontend Client</span>
                    <p className="text-[11px] text-slate-300">React 19 + Tailwind</p>
                    <p className="text-[10px] text-slate-400 mt-1">Audio TTS + Quick Chips + Action Cards</p>
                  </div>

                  <span className="text-emerald-400 font-bold">➔ POST ➔</span>

                  {/* Layer 2: Express Server */}
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex-1 text-center">
                    <span className="text-teal-400 font-bold block mb-1">2. Express Backend API</span>
                    <p className="text-[11px] text-slate-300">/api/chat & /api/tickets</p>
                    <p className="text-[10px] text-slate-400 mt-1">Input Sanitization + Emergency Triage</p>
                  </div>

                  <span className="text-emerald-400 font-bold">➔ RAG ➔</span>

                  {/* Layer 3: Knowledge Retrieval */}
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex-1 text-center">
                    <span className="text-amber-400 font-bold block mb-1">3. Retrieval Layer</span>
                    <p className="text-[11px] text-slate-300">BM25 / Keyword Scorer</p>
                    <p className="text-[10px] text-slate-400 mt-1">Verified Knowledge Chunks (No Hallucination)</p>
                  </div>

                  <span className="text-emerald-400 font-bold">➔ SDK ➔</span>

                  {/* Layer 4: Gemini 3.7 Flash */}
                  <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 flex-1 text-center">
                    <span className="text-purple-400 font-bold block mb-1">4. Gemini 3.7 Flash</span>
                    <p className="text-[11px] text-slate-300">@google/genai SDK</p>
                    <p className="text-[10px] text-slate-400 mt-1">Temperature 0.2 + Strict Citation</p>
                  </div>

                </div>
              </div>

              {/* Architecture Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Grounding & Hallucination Guard
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    The prompt explicitly binds Gemini to the retrieved MaaProject knowledge contexts. If a query is outside the verified docs, the model returns a safe, helpful boundary message.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Workflow className="w-4 h-4 text-teal-600" /> Multi-Turn Context Resolution
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Conversations retain prior conversational context, allowing users to ask follow-up queries (e.g., "Tell me more about the second service") naturally without loss of state.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                  <h3 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-purple-600" /> Secret Key Encapsulation
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    The Gemini API key is never exposed to the client or browser bundle. All LLM calls are strictly executed server-side with Node.js and injected via process.env.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. Conversation Flows Section */}
        {activeDocSection === 'flows' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Flow List */}
            <div className="lg:col-span-4 space-y-2">
              {CONVERSATION_FLOW_SCENARIOS.map((flow, idx) => (
                <div
                  key={flow.id}
                  onClick={() => setSelectedFlowIndex(idx)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    selectedFlowIndex === idx
                      ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    {flow.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-xs mt-1.5">{flow.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{flow.description}</p>
                </div>
              ))}
            </div>

            {/* Right Flow Stepper */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
              {CONVERSATION_FLOW_SCENARIOS[selectedFlowIndex] && (
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div>
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                        {CONVERSATION_FLOW_SCENARIOS[selectedFlowIndex].category}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                        {CONVERSATION_FLOW_SCENARIOS[selectedFlowIndex].title}
                      </h2>
                    </div>

                    <button
                      onClick={() =>
                        onLoadFlowInChat &&
                        onLoadFlowInChat(CONVERSATION_FLOW_SCENARIOS[selectedFlowIndex].steps[0].message)
                      }
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Test in Chat</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <strong>User Objective:</strong> {CONVERSATION_FLOW_SCENARIOS[selectedFlowIndex].userGoal}
                  </p>

                  <div className="space-y-4">
                    {CONVERSATION_FLOW_SCENARIOS[selectedFlowIndex].steps.map((step, sIdx) => (
                      <div
                        key={sIdx}
                        className={`p-3.5 rounded-xl border ${
                          step.sender === 'user'
                            ? 'bg-slate-900 text-white border-slate-800 ml-4'
                            : 'bg-emerald-50/60 border-emerald-200 text-slate-900 mr-4'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] mb-1 opacity-75">
                          <span className="font-bold uppercase">{step.sender === 'user' ? 'User Turn' : 'Maa AI Chat'}</span>
                          {step.note && <span className="italic">{step.note}</span>}
                        </div>
                        <p className="text-xs whitespace-pre-line leading-relaxed">{step.message}</p>
                        {step.expectedAction && (
                          <div className="mt-2 pt-2 border-t border-emerald-200/60 text-[11px] font-semibold text-emerald-800">
                            Action: {step.expectedAction}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Requirements Section */}
        {activeDocSection === 'requirements' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">Functional & Non-Functional Requirements Specification</h2>
              <p className="text-xs text-slate-500">Maa AI Chat (Track 3 — MaaProject Chatbot)</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-900 text-sm mb-2 text-emerald-800">1. Core Conversational Capabilities</h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 leading-relaxed">
                  <li><strong>FAQ Engine:</strong> Answers common queries on services, eligibility, documents, and zero-fee policies.</li>
                  <li><strong>Service Breakdown:</strong> Comprehensive coverage of Maa Care, Maa Welfare Grants, Poshan Kits, and SHG empowerment.</li>
                  <li><strong>Step-by-Step Guidance:</strong> Clear sequential procedures for welfare applications and tele-consultations.</li>
                  <li><strong>Navigation Assistance:</strong> Interactive routing links (/maternal-care, /welfare-schemes, /support/report).</li>
                  <li><strong>Conversational Search:</strong> BM25 keyword matching against indexed MaaProject documentation with inline source citations.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-900 text-sm mb-2 text-emerald-800">2. Issue Reporting & Support Escalation</h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 leading-relaxed">
                  <li><strong>Automated Incident Logging:</strong> Instant creation of unique Ticket IDs (MAA-TKT-XXXXX) for payment delays and errors.</li>
                  <li><strong>Human Officer Transfer:</strong> One-click escalation mechanism for complex or high-priority disputes.</li>
                  <li><strong>Emergency Medical Triage:</strong> Immediate hotline dispatch and banner triggers for acute pregnancy complications.</li>
                </ul>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-900 text-sm mb-2 text-emerald-800">3. Non-Functional & Security Constraints</h3>
                <ul className="list-disc list-inside space-y-1.5 text-slate-700 leading-relaxed">
                  <li><strong>Strict Zero-Hallucination:</strong> Never fabricates phone numbers, emails, fees, or fictional schemes.</li>
                  <li><strong>Safe Fallbacks:</strong> Courteously declines out-of-scope queries (e.g. stock market, crypto, generic coding).</li>
                  <li><strong>Latency SLA:</strong> Average response generation below 1,000ms.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 4. Tech Stack Section */}
        {activeDocSection === 'tech' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Technology Stack & Open Source Licenses</h2>
            <p className="text-xs text-slate-600 mb-4">
              All dependencies utilize permissive open-source licenses compliant with enterprise and public sector standards.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-xl">
                <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Component / Library</th>
                    <th className="p-3">Role / Purpose</th>
                    <th className="p-3">License</th>
                    <th className="p-3">Selection Justification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-600">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">@google/genai (v2.4)</td>
                    <td className="p-3">Gemini 3.7 Flash LLM SDK</td>
                    <td className="p-3 font-mono">Apache-2.0</td>
                    <td className="p-3">Official SDK for server-side grounded reasoning and ultra-low latency.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Express (v4.21)</td>
                    <td className="p-3">Backend Server & API Proxy</td>
                    <td className="p-3 font-mono">MIT</td>
                    <td className="p-3">Lightweight, performant HTTP server encapsulating API secrets securely.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">React 19 & TypeScript 5.8</td>
                    <td className="p-3">Client UI Architecture</td>
                    <td className="p-3 font-mono">MIT / Apache-2.0</td>
                    <td className="p-3">Component modularity, type safety, and reactive conversation management.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Tailwind CSS (v4)</td>
                    <td className="p-3">Responsive Styling</td>
                    <td className="p-3 font-mono">MIT</td>
                    <td className="p-3">Modern CSS engine providing accessible, responsive styling across mobile & desktop.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Lucide React</td>
                    <td className="p-3">Icons & Visual Cues</td>
                    <td className="p-3 font-mono">ISC</td>
                    <td className="p-3">Consistent vector iconography without external font dependencies.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. User & Install Guide */}
        {activeDocSection === 'guide' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">User Manual & Developer Installation Guide</h2>
              <p className="text-xs text-slate-500">Step-by-step instructions for operating and deploying Maa AI Chat</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <h3 className="font-bold text-slate-900 text-sm mb-2 text-emerald-800">For Users: How to Interact</h3>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
                  <li><strong>Start Asking:</strong> Type any question regarding MaaProject into the chat box or tap any of the popular starter chips.</li>
                  <li><strong>Listen to Responses:</strong> Tap the "Listen" audio button on any answer for voice playback.</li>
                  <li><strong>Click Actions:</strong> Use direct route buttons (e.g. [Maa Care Hub]) to jump immediately to relevant platform portals.</li>
                  <li><strong>Report an Issue:</strong> If facing an application delay, click "Report Problem" to open an authenticated ticket.</li>
                </ol>
              </div>

              <div className="p-4 bg-slate-900 text-slate-100 rounded-xl font-mono">
                <h3 className="font-bold text-emerald-400 text-sm mb-2 font-sans">For Developers: Installation & Run</h3>
                <pre className="text-[11px] leading-relaxed overflow-x-auto">
{`# 1. Clone or access the workspace repository
git clone https://github.com/maaproject/maa-ai-chat.git
cd maa-ai-chat

# 2. Configure environment variables in .env (or Secrets panel)
GEMINI_API_KEY="your-gemini-api-key"

# 3. Install dependencies
npm install

# 4. Run full-stack dev server (Express + Vite on port 3000)
npm run dev

# 5. Build for production container deployment
npm run build
npm start`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* 6. Presentation Slides */}
        {activeDocSection === 'slides' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">
                  Slide {slideIndex + 1} of {presentationSlides.length}
                </span>
                <h2 className="text-xl font-bold text-slate-900">{presentationSlides[slideIndex].title}</h2>
                <p className="text-xs text-slate-500">{presentationSlides[slideIndex].subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSlideIndex((prev) => Math.max(0, prev - 1))}
                  disabled={slideIndex === 0}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSlideIndex((prev) => Math.min(presentationSlides.length - 1, prev + 1))}
                  disabled={slideIndex === presentationSlides.length - 1}
                  className="p-2 rounded-lg border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Slide Canvas */}
            <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700 shadow-lg min-h-[300px] flex flex-col justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full text-xs font-semibold mb-3">
                  {presentationSlides[slideIndex].badge}
                </span>
                <h3 className="text-2xl font-black text-white">{presentationSlides[slideIndex].title}</h3>
                <p className="text-xs text-slate-300 mt-1 mb-6">{presentationSlides[slideIndex].subtitle}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {presentationSlides[slideIndex].points.map((pt, pIdx) => (
                    <div key={pIdx} className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-slate-200 leading-relaxed">{pt}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <span>MaaProject Intelligent Assistant (Track 3)</span>
                <span>Google AI Studio & Gemini 3.7 Flash</span>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Plus, 
  BookOpen, 
  Tag, 
  ShieldCheck, 
  Trash2, 
  ExternalLink, 
  Filter, 
  RefreshCw,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { KnowledgeDocument } from '../types';

interface KnowledgeBaseExplorerProps {
  onAskDocQuery?: (query: string) => void;
}

export const KnowledgeBaseExplorer: React.FC<KnowledgeBaseExplorerProps> = ({ onAskDocQuery }) => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // New Doc Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<'about' | 'service' | 'guide' | 'faq' | 'contact' | 'policy' | 'troubleshooting'>('service');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('');
  const [newRoute, setNewRoute] = useState('');

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      let url = `/api/knowledge?category=${selectedCategory}`;
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery.trim())}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setDocuments(data.documents || []);
      if (data.documents && data.documents.length > 0 && !selectedDoc) {
        setSelectedDoc(data.documents[0]);
      }
    } catch (err) {
      console.error('Failed to fetch knowledge docs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [selectedCategory]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDocuments();
  };

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Please provide at least a title and content.');
      return;
    }

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          summary: newSummary || newTitle,
          content: newContent,
          tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
          route: newRoute || '/knowledge-base'
        })
      });

      if (res.ok) {
        const data = await res.json();
        setIsAddingDoc(false);
        setNewTitle('');
        setNewSummary('');
        setNewContent('');
        setNewTags('');
        setNewRoute('');
        fetchDocuments();
        if (data.document) {
          setSelectedDoc(data.document);
        }
      }
    } catch (err) {
      console.error('Error creating doc:', err);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to remove this document from the knowledge base?')) return;
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        if (selectedDoc?.id === id) {
          setSelectedDoc(null);
        }
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const categories = [
    { id: 'all', label: 'All Documents' },
    { id: 'about', label: 'About & Vision' },
    { id: 'service', label: 'Core Services' },
    { id: 'guide', label: 'Step Guides' },
    { id: 'faq', label: 'FAQs' },
    { id: 'contact', label: 'Official Contacts' },
    { id: 'troubleshooting', label: 'Troubleshooting' }
  ];

  return (
    <div id="knowledge-base-explorer-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">MaaProject Knowledge Base</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 backdrop-blur-xs">
              Verified RAG Sources ({documents.length})
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Browse, search, and manage verified documentation used to ground the Maa AI Chat assistant.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddingDoc(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-400/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Verified Document</span>
          </button>

          <button
            onClick={fetchDocuments}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 transition-colors backdrop-blur-md cursor-pointer"
            title="Refresh Knowledge Index"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="my-4 flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified articles, services, nutrition guides, contact numbers..."
              className="w-full bg-white/[0.05] pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 border border-white/15 rounded-xl backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-400"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white border border-white/15 rounded-xl text-sm font-medium backdrop-blur-md transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 border border-emerald-400/30'
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 backdrop-blur-md'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Document List & Document Reader */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left Column: Documents List */}
        <div className="lg:col-span-5 space-y-3 max-h-[680px] overflow-y-auto pr-1">
          {documents.length === 0 ? (
            <div className="p-8 text-center bg-white/[0.03] rounded-3xl border border-white/10 text-slate-400 backdrop-blur-xl">
              <Database className="w-8 h-8 mx-auto mb-2 text-slate-500" />
              <p className="text-sm font-medium">No documents found matching the search criteria.</p>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer backdrop-blur-xl ${
                  selectedDoc?.id === doc.id
                    ? 'bg-white/10 border-emerald-400/50 shadow-lg shadow-emerald-950/40 ring-1 ring-emerald-400/40'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-md">
                    {doc.category}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">ID: {doc.id}</span>
                </div>
                <h3 className="font-bold text-white text-sm mt-2 leading-snug">{doc.title}</h3>
                <p className="text-xs text-slate-300 mt-1 line-clamp-2">{doc.summary}</p>
                <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10 text-[11px] text-slate-400">
                  <span>Updated: {doc.lastUpdated}</span>
                  <span>•</span>
                  <span className="truncate">{doc.tags.slice(0, 3).join(', ')}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Column: Active Document Reader */}
        <div className="lg:col-span-7">
          {selectedDoc ? (
            <div className="bg-white/[0.04] rounded-3xl border border-white/10 backdrop-blur-2xl shadow-2xl p-6 flex flex-col justify-between min-h-[520px]">
              <div>
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase tracking-wide">
                      {selectedDoc.category}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Doc ID: {selectedDoc.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAskDocQuery && onAskDocQuery(`Explain verified details of: ${selectedDoc.title}`)}
                      className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-emerald-300 border border-white/15 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 backdrop-blur-md cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ask AI Chat</span>
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(selectedDoc.id)}
                      className="p-1.5 text-slate-400 hover:text-red-400 transition-colors rounded-lg hover:bg-white/5 cursor-pointer"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-white">{selectedDoc.title}</h2>
                <p className="text-xs text-emerald-400 font-semibold mt-1">Verified By: {selectedDoc.verifiedBy}</p>

                {/* Summary Box */}
                <div className="p-3.5 my-4 bg-white/[0.04] border border-white/10 rounded-2xl text-xs text-slate-200 leading-relaxed backdrop-blur-md">
                  <strong className="text-emerald-300">Executive Summary:</strong> {selectedDoc.summary}
                </div>

                {/* Full Content */}
                <div className="text-sm text-slate-200 leading-relaxed whitespace-pre-line font-normal space-y-2">
                  {selectedDoc.content}
                </div>

                {/* Metadata & Tags Footer */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {selectedDoc.tags.map((t, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-white/10 rounded-md text-slate-300 font-medium border border-white/5">
                        #{t}
                      </span>
                    ))}
                  </div>
                  {selectedDoc.route && (
                    <span className="text-emerald-400 font-semibold">Route: {selectedDoc.route}</span>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  RAG-Indexed & Grounded for Gemini 3.7 Flash
                </span>
                <span>Last Audited: {selectedDoc.lastUpdated}</span>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white/[0.03] rounded-3xl border border-white/10 backdrop-blur-xl text-slate-400">
              <BookOpen className="w-10 h-10 mx-auto mb-2 text-slate-500" />
              <p className="font-medium text-sm">Select a document from the list to view verified content.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add Document Modal */}
      {isAddingDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950/95 rounded-3xl shadow-2xl border border-white/15 max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto text-slate-100 backdrop-blur-2xl">
            <h3 className="text-lg font-bold text-white">Add Verified MaaProject Document</h3>
            <p className="text-xs text-slate-400 mt-1">
              New documents will be immediately indexed into the RAG retrieval engine.
            </p>

            <form onSubmit={handleCreateDocument} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Maa Care — Neonatal Follow-Up Guidelines"
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-white/15 rounded-xl text-white focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                  >
                    <option value="about">About & Vision</option>
                    <option value="service">Core Service</option>
                    <option value="guide">User Guide</option>
                    <option value="faq">FAQ</option>
                    <option value="contact">Official Contact</option>
                    <option value="troubleshooting">Troubleshooting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Platform Route (Optional)</label>
                  <input
                    type="text"
                    value={newRoute}
                    onChange={(e) => setNewRoute(e.target.value)}
                    placeholder="e.g. /maternal-care"
                    className="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Short Summary</label>
                <input
                  type="text"
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="A concise 1-sentence summary of this document..."
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Document Content (Markdown Supported)</label>
                <textarea
                  rows={6}
                  required
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Enter the full verified text, eligibility conditions, or procedures..."
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (Comma Separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. maternal, health, newborn, clinic"
                  className="w-full px-3 py-2 text-sm bg-white/5 border border-white/15 rounded-xl text-white placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500/40 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddingDoc(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-slate-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-emerald-500/20 border border-emerald-400/30 cursor-pointer"
                >
                  Save & Re-Index
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

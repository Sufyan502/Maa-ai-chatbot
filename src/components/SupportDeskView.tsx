import React, { useState, useEffect } from 'react';
import { 
  LifeBuoy, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  UserCheck, 
  Plus, 
  Phone, 
  Mail, 
  Filter, 
  ArrowRight,
  ShieldAlert,
  Search
} from 'lucide-react';
import { SupportTicket } from '../types';

interface SupportDeskViewProps {
  onOpenReportModal: () => void;
}

export const SupportDeskView: React.FC<SupportDeskViewProps> = ({ onOpenReportModal }) => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTickets = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
      if (data.tickets && data.tickets.length > 0 && !selectedTicket) {
        setSelectedTicket(data.tickets[0]);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (ticketId: string, newStatus: SupportTicket['status'], resolutionNote?: string) => {
    try {
      const res = await fetch(`/api/tickets/${ticketId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          resolutionNotes: resolutionNote || 'Status updated by Support Desk Officer.'
        })
      });
      if (res.ok) {
        fetchTickets();
        if (selectedTicket && selectedTicket.id === ticketId) {
          setSelectedTicket({
            ...selectedTicket,
            status: newStatus,
            resolutionNotes: resolutionNote || selectedTicket.resolutionNotes
          });
        }
      }
    } catch (err) {
      console.error('Failed to update ticket:', err);
    }
  };

  const handleEscalateToHuman = (ticketId: string) => {
    handleUpdateStatus(ticketId, 'escalated_to_human', 'Escalated to Senior Grievance & Medical Triage Officer.');
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesSearch =
      searchQuery === '' ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userContact.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getSeverityBadge = (severity: SupportTicket['severity']) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-100 text-red-800 border border-red-200">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Low</span>;
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" /> Resolved
          </span>
        );
      case 'escalated_to_human':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200 animate-pulse">
            <ShieldAlert className="w-3.5 h-3.5" /> Escalated to Officer
          </span>
        );
      case 'in_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3.5 h-3.5" /> In Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" /> Open
          </span>
        );
    }
  };

  return (
    <div id="support-desk-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">MaaProject Support & Problem Desk</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Active Issues ({tickets.length})
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time tracking of reported problems, application delays, and human grievance officer escalations.
          </p>
        </div>

        <button
          onClick={onOpenReportModal}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Report New Problem / Issue</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="my-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tickets by ID (e.g. MAA-TKT-84920), title, or contact..."
            className="w-full bg-white pl-10 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {['all', 'open', 'in_review', 'escalated_to_human', 'resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {st.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-4">
        
        {/* Left: Ticket List */}
        <div className="lg:col-span-5 space-y-3 max-h-[640px] overflow-y-auto pr-1">
          {filteredTickets.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
              <LifeBuoy className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-sm font-medium">No tickets match the current criteria.</p>
            </div>
          ) : (
            filteredTickets.map((t) => (
              <div
                key={t.id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  selectedTicket?.id === t.id
                    ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400 shadow-xs'
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700">{t.id}</span>
                  <div className="flex items-center gap-1.5">
                    {getSeverityBadge(t.severity)}
                    {getStatusBadge(t.status)}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm mt-2 leading-snug">{t.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{t.description}</p>

                <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-400">
                  <span>Contact: {t.userContact}</span>
                  <span>{new Date(t.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right: Selected Ticket Detail & Actions */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between min-h-[500px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <span className="font-mono text-sm font-bold text-emerald-700">{selectedTicket.id}</span>
                    <span className="ml-2 text-xs text-slate-400">Category: {selectedTicket.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(selectedTicket.severity)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-slate-900">{selectedTicket.title}</h2>

                {/* Meta details */}
                <div className="grid grid-cols-2 gap-4 p-3.5 my-4 bg-slate-50 border border-slate-200/80 rounded-xl text-xs">
                  <div>
                    <span className="text-slate-500 font-medium">User Contact:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedTicket.userContact}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium">Assigned Officer:</span>
                    <p className="font-bold text-slate-900 mt-0.5">{selectedTicket.assignedAgent || 'Auto-Triage Cell'}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Issue Description</h4>
                  <p className="text-sm text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                    {selectedTicket.description}
                  </p>
                </div>

                {/* Troubleshooting steps */}
                {selectedTicket.troubleshootingStepsTaken && selectedTicket.troubleshootingStepsTaken.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Automated Triage Steps</h4>
                    <ul className="list-disc list-inside text-xs text-slate-700 space-y-1">
                      {selectedTicket.troubleshootingStepsTaken.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Resolution Notes */}
                {selectedTicket.resolutionNotes && (
                  <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">Officer Notes</h4>
                    <p className="text-xs text-emerald-900">{selectedTicket.resolutionNotes}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400">
                  Last Activity: {new Date(selectedTicket.updatedAt).toLocaleString()}
                </div>

                <div className="flex items-center gap-2">
                  {selectedTicket.status !== 'escalated_to_human' && selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => handleEscalateToHuman(selectedTicket.id)}
                      className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Escalate to Human Officer
                    </button>
                  )}

                  {selectedTicket.status !== 'resolved' ? (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'resolved', 'Verified and cleared by Support Team.')}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Mark as Resolved
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(selectedTicket.id, 'open', 'Reopened for additional investigation.')}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Reopen Ticket
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
              <LifeBuoy className="w-10 h-10 mx-auto mb-2 text-slate-300" />
              <p className="font-medium text-sm">Select an active ticket from the list to manage.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

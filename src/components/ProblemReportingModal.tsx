import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, CheckCircle2, ShieldCheck, LifeBuoy } from 'lucide-react';
import { SupportTicket } from '../types';
import { useNotifications } from '../context/NotificationContext';

interface ProblemReportingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onTicketCreated?: (ticket: SupportTicket) => void;
}

export const ProblemReportingModal: React.FC<ProblemReportingModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onTicketCreated
}) => {
  const { addNotification } = useNotifications();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('Welfare Application');
  const [severity, setSeverity] = useState<SupportTicket['severity']>('high');
  const [userContact, setUserContact] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<SupportTicket | null>(null);

  useEffect(() => {
    if (initialQuery) {
      setTitle(initialQuery.slice(0, 70));
      setDescription(initialQuery);
    }
  }, [initialQuery]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !userContact.trim() || !description.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          category,
          severity,
          userContact: userContact.trim(),
          description: description.trim(),
          troubleshootingStepsTaken: [
            'Auto-logged via Maa AI Chat Problem Reporting Flow',
            'Cross-checked with MaaProject knowledge base SLAs'
          ]
        })
      });

      if (res.ok) {
        const data = await res.json();
        setCreatedTicket(data.ticket);
        if (onTicketCreated) {
          onTicketCreated(data.ticket);
        }
        addNotification({
          type: 'ticket',
          title: `Ticket Logged: #${data.ticket.id}`,
          message: `Your grievance regarding "${data.ticket.title}" has been registered in the system.`,
          severity: 'success',
          actionRoute: 'tickets',
          playSound: true,
          showToast: true
        });
      } else {
        alert('Failed to create ticket. Please try again.');
      }
    } catch (err) {
      console.error('Error submitting problem report:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCreatedTicket(null);
    setTitle('');
    setDescription('');
    setUserContact('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {createdTicket ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Support Ticket Logged!</h3>
            <p className="text-xs text-slate-500 mt-1">
              Your grievance has been submitted to the MaaProject Support Desk.
            </p>

            <div className="p-4 my-5 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Ticket ID:</span>
                <span className="font-mono font-bold text-emerald-700">{createdTicket.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Category:</span>
                <span className="font-semibold text-slate-800">{createdTicket.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Severity:</span>
                <span className="font-bold text-amber-600 uppercase">{createdTicket.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-bold text-emerald-600">Open (SLA: &lt; 24h)</span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              An officer will contact you at <strong>{createdTicket.userContact}</strong>. You can also track this in the Support Desk tab.
            </p>

            <button
              onClick={handleResetAndClose}
              className="mt-5 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
            >
              Done & Return
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Report a Problem / Issue</h3>
                <p className="text-xs text-slate-500">Official MaaProject Grievance & Technical Redressal</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Summary *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Welfare Grant installment delayed for 10 days"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="Welfare Application">Welfare Application</option>
                    <option value="Service Access">Service Access</option>
                    <option value="Health Center / Clinic">Health Center / Clinic</option>
                    <option value="Technical Bug">Technical Bug</option>
                    <option value="Grievance">Grievance</option>
                    <option value="General Support">General Support</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Urgency / Severity *</label>
                  <select
                    value={severity}
                    onChange={(e: any) => setSeverity(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="low">Low (Standard SLA)</option>
                    <option value="medium">Medium (48 Hours)</option>
                    <option value="high">High (24 Hours)</option>
                    <option value="critical">Critical (&lt; 4 Hours)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Contact Phone / Email *</label>
                <input
                  type="text"
                  required
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  placeholder="e.g. +91 9876543210 or your.email@example.com"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Detailed Description & Reference Numbers *</label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Please describe what happened, including Application ID, date, or care center name..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-xs disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? 'Logging Ticket...' : 'Submit Support Ticket'}
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

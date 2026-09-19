import React from 'react';
import { PhoneCall, Mail, MapPin, Clock, X, ShieldCheck, AlertCircle } from 'lucide-react';

interface VerifiedContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VerifiedContactModal: React.FC<VerifiedContactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 relative">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Verified Official Contacts</h3>
            <p className="text-xs text-slate-500">MaaProject Secretariat & Emergency Helplines</p>
          </div>
        </div>

        {/* Emergency Hotline Card */}
        <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 text-red-800 text-xs font-bold uppercase tracking-wider mb-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span>24/7 Maternal Emergency & Triage Hotline</span>
          </div>
          <p className="text-2xl font-black text-red-700 tracking-tight">1800-11-MAA-CARE</p>
          <p className="text-sm font-semibold text-red-800 mt-0.5">(1800-11-6222)</p>
          <p className="text-[11px] text-red-600 mt-1">
            Toll-free across all national telephone networks. Connected to emergency ambulance dispatch.
          </p>
        </div>

        {/* Contact List */}
        <div className="space-y-3 text-xs">
          
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 block">General Support & Inquiries</span>
              <a href="mailto:support@maaproject.org" className="text-emerald-700 font-bold hover:underline">
                support@maaproject.org
              </a>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 block">Grievance Redressal & Escalations</span>
              <a href="mailto:grievance@maaproject.org" className="text-emerald-700 font-bold hover:underline">
                grievance@maaproject.org
              </a>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 block">National Secretariat Headquarters</span>
              <p className="text-slate-600 leading-relaxed mt-0.5">
                MaaProject National Directorate, 4th Floor, Community Welfare Bhawan, Institutional Area, New Delhi — 110001
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
            <Clock className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-700 block">Operating Hours</span>
              <p className="text-slate-600 leading-relaxed mt-0.5">
                • Emergency Line: 24/7/365<br />
                • Administrative Helpdesks: Mon–Sat, 8:00 AM – 8:00 PM IST
              </p>
            </div>
          </div>

        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold shadow-xs transition-colors"
        >
          Close
        </button>

      </div>
    </div>
  );
};

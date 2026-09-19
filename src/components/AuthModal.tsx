import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, UserRound, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const { setSession } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  if (!isOpen) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setBusy(true);
    try {
      const res = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Authentication failed.');
      setSession(data.token, data.user); onClose(); setPassword('');
    } catch (err: any) { setError(err.message || 'Authentication failed.'); }
    finally { setBusy(false); }
  };

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4" role="dialog" aria-modal="true">
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0D131E] shadow-2xl p-6 sm:p-8 relative">
      <button onClick={onClose} className="absolute right-4 top-4 p-2 rounded-xl text-[#8994A7] hover:text-white hover:bg-white/5" aria-label="Close"><X className="w-5 h-5" /></button>
      <div className="mb-7"><div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center font-extrabold text-xl mb-4">M</div><h2 className="text-2xl font-bold text-white">{mode === 'login' ? 'Welcome back' : 'Create your MaaProject account'}</h2><p className="text-sm text-[#8994A7] mt-1">{mode === 'login' ? 'Sign in to keep your conversations connected to your account.' : 'Create an account to keep your chats and preferences across sessions.'}</p></div>
      <form onSubmit={submit} className="space-y-4">
        {mode === 'signup' && <label className="block"><span className="text-xs text-[#AAB4C5]">Name</span><div className="relative mt-1"><UserRound className="absolute left-3 top-3.5 w-4 h-4 text-[#667085]" /><input required value={name} onChange={e => setName(e.target.value)} className="w-full rounded-xl border border-[#273244] bg-[#080C14] py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500" placeholder="Your name" /></div></label>}
        <label className="block"><span className="text-xs text-[#AAB4C5]">Email</span><div className="relative mt-1"><Mail className="absolute left-3 top-3.5 w-4 h-4 text-[#667085]" /><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-xl border border-[#273244] bg-[#080C14] py-3 pl-10 pr-3 text-sm outline-none focus:border-blue-500" placeholder="you@example.com" /></div></label>
        <label className="block"><span className="text-xs text-[#AAB4C5]">Password</span><div className="relative mt-1"><LockKeyhole className="absolute left-3 top-3.5 w-4 h-4 text-[#667085]" /><input required minLength={8} type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-[#273244] bg-[#080C14] py-3 pl-10 pr-10 text-sm outline-none focus:border-blue-500" placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-3 text-[#667085]">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></label>
        {error && <div className="rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs p-3">{error}</div>}
        <button disabled={busy} className="w-full gradient-btn rounded-xl py-3 font-semibold text-sm disabled:opacity-50">{busy ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}</button>
      </form>
      <div className="mt-5 text-center text-xs text-[#8994A7]">{mode === 'login' ? 'New to MaaProject?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} className="text-blue-400 font-semibold">{mode === 'login' ? 'Create account' : 'Sign in'}</button></div>
      <p className="mt-5 text-[10px] leading-4 text-[#667085] text-center">Google Sign-In can be enabled later with a configured Google OAuth Client ID; no fake OAuth flow is presented here.</p>
    </div>
  </div>;
};

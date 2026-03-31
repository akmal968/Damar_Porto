import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg p-4 selection:bg-brand-primary selection:text-black">
      <div className="w-full max-w-md glass rounded-3xl sm:rounded-[2rem] p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-6 neon-glow border-brand-primary/30">
            <LogIn className="text-brand-primary w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">System Access</h1>
          <p className="text-zinc-500 font-mono text-xs mt-3 uppercase tracking-widest">Authentication Required</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-xs font-mono">
              {'>'} ERROR: {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Identity</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brand-bg border border-brand-border rounded-2xl focus:border-brand-primary outline-none transition-all text-white font-mono placeholder:text-zinc-700"
                placeholder="admin@system.local"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-widest ml-1">Security Key</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600 group-focus-within:text-brand-primary transition-colors" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-brand-bg border border-brand-border rounded-2xl focus:border-brand-primary outline-none transition-all text-white font-mono placeholder:text-zinc-700"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-brand-primary transition-all duration-300 transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {loading ? 'AUTHENTICATING...' : 'INITIALIZE LOGIN'}
          </button>
        </form>
      </div>
    </div>
  );
}

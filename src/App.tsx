import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  state = { hasError: false, error: null as Error | null };

  constructor(props: { children: React.ReactNode }) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg p-6 selection:bg-red-500/30">
          <div className="max-w-md w-full glass p-10 rounded-[2.5rem] border-red-500/20 shadow-[0_0_50px_rgba(255,0,0,0.05)]">
            <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center mb-8 border-red-500/30">
              <span className="text-3xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-4 tracking-tight">System Failure</h1>
            <p className="text-zinc-400 mb-6 font-mono text-sm leading-relaxed">Critical error detected in application module. Verify Supabase configuration and database connectivity.</p>
            <div className="bg-black/40 p-5 rounded-2xl border border-red-500/10 mb-8">
              <pre className="text-[10px] font-mono text-red-400 overflow-auto max-h-40 scrollbar-hide">
                {this.state.error?.message}
              </pre>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-red-500 hover:text-white transition-all transform hover:-translate-y-1 shadow-lg"
            >
              REBOOT SYSTEM
            </button>
          </div>
        </div>
      );
    }
    return (this as any).props.children;
  }
}

export default function App() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4 shadow-[0_0_10px_rgba(0,255,0,0.2)]"></div>
          <div className="font-mono text-brand-primary text-xs tracking-widest">INITIALIZING...</div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={session ? <Navigate to="/admin" /> : <Login />} />
          <Route path="/admin/*" element={session ? <Admin /> : <Navigate to="/login" />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

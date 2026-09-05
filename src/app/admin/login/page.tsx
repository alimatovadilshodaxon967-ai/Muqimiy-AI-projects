'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, User, ArrowRight } from 'lucide-react';
import { TouchButton } from '@/components/ui/TouchButton';

export default function AdminLoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      router.push('/admin');
    } else {
      setError('Login yoki parol xato! (Demo credentials: admin / admin123)');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
      <div className="bg-slate-800/80 backdrop-blur-2xl p-10 rounded-3xl border border-slate-700 max-w-md w-full shadow-2xl">
        <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
          <ShieldCheck className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-center mb-1">AQL MARKAZI ADMIN</h1>
        <p className="text-slate-400 text-center text-sm mb-8">Boshqaruv va Monitoring Tizimi</p>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/20 border border-rose-500/50 text-rose-300 rounded-xl text-sm font-semibold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Admin Login:</label>
            <div className="relative">
              <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Parol:</label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <TouchButton variant="accent" size="lg" fullWidth type="submit" icon={<ArrowRight className="w-6 h-6" />}>
            KIRISH ➔
          </TouchButton>
        </form>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MOCK_TERMINALS, MOCK_AI_TOOLS, MOCK_LANGUAGES, MOCK_CAREERS } from '@/lib/mockData';
import {
  Monitor,
  Users,
  Clock,
  Bot,
  Globe,
  Briefcase,
  Compass,
  HeartHandshake,
  Wrench,
  BarChart3,
  Settings,
  LogOut,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function AdminDashboardScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'terminals' | 'content' | 'analytics' | 'settings'>('overview');
  const [terminals, setTerminals] = useState(MOCK_TERMINALS);
  const [demoUrlIbrat, setDemoUrlIbrat] = useState('https://ibratfarzandlari.uz');
  const [demoUrlUstoz, setDemoUrlUstoz] = useState('https://ustoz.ai');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin_auth');
      if (!auth) {
        router.push('/admin/login');
      }
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    router.push('/admin/login');
  };

  const handleSaveUrls = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center font-black text-white text-xl">
              AQL
            </div>
            <div>
              <div className="font-extrabold text-white text-base">AQL MARKAZI</div>
              <div className="text-xs text-emerald-400 font-semibold">ADMIN PANEL v1.0</div>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { id: 'overview', label: 'Boshqaruv Paneli', icon: BarChart3 },
              { id: 'terminals', label: 'Terminallar (4 ta)', icon: Monitor },
              { id: 'content', label: 'Kontent va Linklar', icon: Wrench },
              { id: 'analytics', label: 'Statistika', icon: Users },
              { id: 'settings', label: 'Sozlamalar', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                    activeTab === item.id
                      ? 'bg-brand-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-400 hover:bg-rose-500/10 transition-all border border-rose-500/20"
        >
          <LogOut className="w-5 h-5" />
          <span>CHIQISH</span>
        </button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-8 overflow-y-auto max-w-7xl">
        {/* TOP BAR */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-white">Muqimiy "Aql Markazi" Dashboard</h1>
            <p className="text-slate-400 text-sm">4 ta Touchscreen Kiosk platformasi holati va monitoringi</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> TIZIM ISHLAMOQDA
            </span>
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 transition-all"
            >
              KIOSK INTERFEYSIGA O'TISH ➔
            </button>
          </div>
        </div>

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            {/* STAT CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="text-slate-400 text-xs font-bold mb-1">BUGUNGI FOYDALANUVCHILAR</div>
                <div className="text-3xl font-extrabold text-white">142 kishi</div>
                <div className="text-emerald-400 text-xs font-semibold mt-2">↑ 18% kechagiga nisbatan</div>
              </div>

              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="text-slate-400 text-xs font-bold mb-1">FAOL TERMINALLAR</div>
                <div className="text-3xl font-extrabold text-emerald-400">3 / 4 Kiosk</div>
                <div className="text-slate-400 text-xs font-semibold mt-2">Terminal 3 — Idle</div>
              </div>

              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="text-slate-400 text-xs font-bold mb-1">BUGUNGI SESSIYALAR</div>
                <div className="text-3xl font-extrabold text-sky-400">188 sessiya</div>
                <div className="text-slate-400 text-xs font-semibold mt-2">O'rtacha davomiylik: 8.5 daq</div>
              </div>

              <div className="p-6 bg-slate-800/80 rounded-2xl border border-slate-700">
                <div className="text-slate-400 text-xs font-bold mb-1">AI SO'ROVLARI</div>
                <div className="text-3xl font-extrabold text-amber-400">512 so'rov</div>
                <div className="text-emerald-400 text-xs font-semibold mt-2">100% javob berildi</div>
              </div>
            </div>

            {/* TERMINAL MONITORING GRID (REQUIREMENT 22) */}
            <div>
              <h2 className="text-2xl font-extrabold text-white mb-4 flex items-center gap-2">
                <Monitor className="w-6 h-6 text-brand-500" />
                4 ta Touchscreen Terminal Holati:
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {terminals.map((term) => (
                  <div
                    key={term.id}
                    className="p-6 bg-slate-800/90 rounded-2xl border border-slate-700 space-y-4 shadow-lg"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-extrabold text-white text-lg">{term.id}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                          term.status === 'online'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : term.status === 'idle'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            term.status === 'online'
                              ? 'bg-emerald-400'
                              : term.status === 'idle'
                              ? 'bg-amber-400'
                              : 'bg-rose-400'
                          }`}
                        />
                        {term.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300">
                      <div><strong>Nomi:</strong> {term.name}</div>
                      <div><strong>IP Manzil:</strong> {term.ip}</div>
                      <div><strong>Uptime:</strong> {term.uptime}</div>
                      <div><strong>Oxirgi faollik:</strong> {term.lastActivity}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TERMINALS TAB */}
        {activeTab === 'terminals' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-white">Terminallar Boshqaruvi</h2>
            <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-xs font-bold uppercase">
                  <tr>
                    <th className="p-4">Terminal</th>
                    <th className="p-4">Joylashuvi</th>
                    <th className="p-4">Holat</th>
                    <th className="p-4">IP Manzil</th>
                    <th className="p-4">Uptime</th>
                    <th className="p-4">Faol Sessiya</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {terminals.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-700/50">
                      <td className="p-4 font-bold text-white">{t.id}</td>
                      <td className="p-4">{t.name}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          t.status === 'online' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{t.ip}</td>
                      <td className="p-4">{t.uptime}</td>
                      <td className="p-4 font-mono text-sky-400">{t.currentSessionId || 'Yo‘q'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CONTENT & EXTERNAL LINK MANAGER (REQUIREMENT 24) */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-fade-in max-w-3xl">
            <h2 className="text-2xl font-extrabold text-white">Tashqi Platformalar va Linklar Sozlamasi</h2>

            {savedSuccess && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 rounded-xl text-sm font-bold flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Sozlamalar va URL manzillar muvaffaqiyatli saqlandi!
              </div>
            )}

            <form onSubmit={handleSaveUrls} className="p-6 bg-slate-800 rounded-2xl border border-slate-700 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  "Ibrat Farzandlari" Platformasi URL Manzili:
                </label>
                <input
                  type="url"
                  value={demoUrlIbrat}
                  onChange={(e) => setDemoUrlIbrat(e.target.value)}
                  className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500 font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">
                  "Ustoz AI" Platformasi URL Manzili:
                </label>
                <input
                  type="url"
                  value={demoUrlUstoz}
                  onChange={(e) => setDemoUrlUstoz(e.target.value)}
                  className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-white outline-none focus:border-brand-500 font-mono text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base rounded-xl transition-all shadow-md active:scale-95"
              >
                SAQLASH
              </button>
            </form>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-extrabold text-white">Anonimlashtirilgan Statistikalar</h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Eng Ko'p Ishlatilgan Bo'limlar:</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>1. Kasb O'rganish (Ustoz AI)</span>
                      <span>38%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full w-[38%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>2. Til O'rganish (Ibrat Farzandlari)</span>
                      <span>27%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-sky-500 h-full w-[27%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>3. AI Bilan Ochiq Muloqot</span>
                      <span>19%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-amber-500 h-full w-[19%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>4. Migratsiyaga Ketish</span>
                      <span>11%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-rose-500 h-full w-[11%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                <h3 className="font-bold text-white mb-4">Foydalanuvchilar Yosh Darajasi:</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>18-24 yosh (Yoshlar)</span>
                      <span>44%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-brand-500 h-full w-[44%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>25-35 yosh</span>
                      <span>28%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-teal-500 h-full w-[28%]" />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
                      <span>13-17 yosh (O'smirlar)</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[18%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-fade-in max-w-xl">
            <h2 className="text-2xl font-extrabold text-white">Platforma Sozlamalari</h2>
            <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Session Timeout (Daqiqa):</label>
                <input
                  type="number"
                  defaultValue={5}
                  className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">Data Retention (Kunlar):</label>
                <select className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white">
                  <option value="0">Session only (Darhol o'chirish)</option>
                  <option value="1">1 kun</option>
                  <option value="7">7 kun</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { 
  LayoutDashboard, 
  Smartphone, 
  UserCircle, 
  Settings, 
  ChevronRight, 
  Menu, 
  X, 
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminPanel } from './features/admin/AdminPanel';
import { WaiterApp } from './features/waiter/WaiterApp';
import { cn, translations } from './lib/utils';
import { Language } from './types';

function App() {
  const [activeTab, setActiveTab] = useState<'admin' | 'waiter'>('admin');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [isOnline, setIsOnline] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const t = translations[lang];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Toaster position="top-center" expand={true} richColors />
      
      {/* Sidebar for Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col bg-slate-900 text-white transition-all duration-300 ease-in-out relative",
        sidebarOpen ? "w-72" : "w-24"
      )}>
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
             <span className="font-black text-xl">E</span>
          </div>
          {sidebarOpen && (
            <div className="flex flex-col text-white">
              <span className="text-xl font-black tracking-tight leading-none">EthioSync</span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest mt-1">B2B Payments</span>
            </div>
          )}
        </div>

        <nav className="flex-1 mt-8 px-4 space-y-3">
          <NavItem 
            icon={<LayoutDashboard size={22} />} 
            label={t.dashboard} 
            active={activeTab === 'admin'} 
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab('admin')}
          />
          <NavItem 
            icon={<Smartphone size={22} />} 
            label={t.waiterPortal} 
            active={activeTab === 'waiter'} 
            collapsed={!sidebarOpen}
            onClick={() => setActiveTab('waiter')}
          />
        </nav>

        <div className="p-6 space-y-4 border-t border-slate-800/50">
          <div className={cn("flex items-center gap-3 px-3", !sidebarOpen && "justify-center")}>
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
            >
              <Globe size={20} />
              {sidebarOpen && <span className="text-sm font-bold">{lang === 'en' ? 'Amharic' : 'English'}</span>}
            </button>
          </div>
          
          <div className={cn("flex items-center gap-3 px-3", !sidebarOpen && "justify-center")}>
            <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500")} />
            {sidebarOpen && (
              <span className="text-xs font-bold text-slate-400">
                {isOnline ? 'NETWORK ONLINE' : 'OFFLINE MODE'}
              </span>
            )}
          </div>

          <NavItem 
            icon={<UserCircle size={22} />} 
            label={t.profile} 
            collapsed={!sidebarOpen}
          />
        </div>
        
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-24 bg-white text-slate-900 border border-slate-200 rounded-full p-1.5 hover:bg-slate-50 transition-colors shadow-xl z-20"
        >
          <ChevronRight size={16} className={cn("transition-transform duration-300", sidebarOpen && "rotate-180")} />
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black">E</div>
            <span className="font-black text-slate-900 tracking-tight text-lg">EthioSync</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
              className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
            >
              <Globe size={20} />
            </button>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-900 hover:bg-slate-50 rounded-lg transition-colors active:scale-95"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Dynamic Content Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Mobile Nav Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="md:hidden absolute inset-0 bg-slate-900/95 backdrop-blur-sm z-50 flex flex-col p-6"
              >
                <div className="space-y-4">
                  <button 
                    onClick={() => { setActiveTab('admin'); setIsMobileMenuOpen(false); }}
                    className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all", activeTab === 'admin' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-white/5")}
                  >
                    <LayoutDashboard size={24} />
                    <span className="font-bold text-lg">{t.dashboard}</span>
                  </button>
                  <button 
                    onClick={() => { setActiveTab('waiter'); setIsMobileMenuOpen(false); }}
                    className={cn("w-full flex items-center gap-4 p-4 rounded-2xl transition-all", activeTab === 'waiter' ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-white/5")}
                  >
                    <Smartphone size={24} />
                    <span className="font-bold text-lg">{t.waiterPortal}</span>
                  </button>
                </div>
                <div className="mt-auto border-t border-slate-800 pt-6 space-y-4 pb-8">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2.5 h-2.5 rounded-full", isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-rose-500")} />
                    <span className="text-slate-400 font-black uppercase tracking-widest text-xs">{isOnline ? 'Online Status: active' : 'Network Disconnected'}</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 bg-slate-800 text-white rounded-2xl font-bold active:scale-95 transition-transform">Close Menu</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === 'admin' ? (
              <motion.div 
                key="admin-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full"
              >
                <AdminPanel lang={lang} />
              </motion.div>
            ) : (
              <motion.div 
                key="waiter-app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-h-full w-full flex items-center justify-center p-0 md:p-8 bg-slate-100/50"
              >
                 <WaiterApp lang={lang} isOnline={isOnline} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, collapsed, onClick }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300",
      active 
        ? "bg-blue-600 text-white shadow-xl shadow-blue-500/20" 
        : "text-slate-400 hover:bg-slate-800 hover:text-white text-white"
    )}
  >
    <div className={cn("shrink-0", active && "scale-110 transition-transform")}>{icon}</div>
    {!collapsed && <span className="font-bold text-sm tracking-wide">{label}</span>}
    {active && !collapsed && <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full" />}
  </button>
);

export default App;
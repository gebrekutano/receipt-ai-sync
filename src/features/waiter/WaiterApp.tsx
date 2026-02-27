import React, { useState } from 'react';
import { 
  Scan, 
  History, 
  Wallet, 
  CheckCircle2, 
  ChevronRight,
  Plus,
  X,
  Star,
  ThumbsUp,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Info,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { formatCurrency, cn, translations } from '../../lib/utils';
import { Language } from '../../types';

type Step = 'main' | 'scanning-receipt' | 'scanning-payment' | 'matching' | 'feedback' | 'history' | 'shift-summary';

interface WaiterAppProps {
  lang: Language;
  isOnline: boolean;
}

export const WaiterApp: React.FC<WaiterAppProps> = ({ lang, isOnline }) => {
  const [step, setStep] = useState<Step>('main');
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedData, setScannedData] = useState<{ receipt?: any; payment?: any }>({});
  const [rating, setRating] = useState(0);
  const t = translations[lang];

  const simulateScan = (type: 'receipt' | 'payment') => {
    if (!isOnline && type === 'payment') {
       toast.error("Payment verification requires internet connection");
       return;
    }
    setStep(type === 'receipt' ? 'scanning-receipt' : 'scanning-payment');
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (type === 'receipt') {
              setScannedData(prev => ({ ...prev, receipt: { id: 'RCP-' + Math.floor(Math.random()*9000), amount: 1250 } }));
              toast.success("Receipt scanned successfully!");
              setStep('main');
            } else {
              setScannedData(prev => ({ ...prev, payment: { id: 'TXN-' + Math.floor(Math.random()*9000), amount: 1250, method: 'Telebirr' } }));
              toast.success("Payment confirmed!");
              setStep('matching');
            }
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const startFeedback = () => {
    setStep('feedback');
  };

  const completeMatch = () => {
    toast.success("Session completed!");
    setScannedData({});
    setRating(0);
    setStep('main');
  };

  const closeShift = () => {
    setStep('shift-summary');
  };

  return (
    <div className="relative w-full max-w-md h-full md:h-[90vh] md:max-h-[850px] bg-white md:rounded-[3rem] md:shadow-2xl md:border-[8px] border-slate-900 overflow-hidden flex flex-col">
      {/* Phone Notch/Header Area */}
      <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-[1.5rem] z-50"></div>
      
      {/* Mobile-only Top Bar */}
      <div className="md:hidden h-2 bg-slate-900 w-full"></div>

      <div className="flex-1 flex flex-col overflow-hidden pt-4 md:pt-10">
        <AnimatePresence mode="wait">
          {step === 'main' && (
            <motion.div 
              key="main"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="flex-1 p-6 overflow-y-auto space-y-6"
            >
              <header className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">{lang === 'en' ? 'Hello, Abebe' : 'ሰላም አበበ'}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{t.shift}: LUNCH RUSH</p>
                  </div>
                </div>
                <button 
                  onClick={closeShift}
                  className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </header>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 p-5 rounded-[2rem] text-white shadow-xl group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center">
                       <Wallet size={20} className="text-blue-400" />
                    </div>
                    <Info size={14} className="text-slate-500 group-hover:text-white transition-colors cursor-pointer" />
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">{t.revenue}</p>
                  <p className="text-xl font-black">{formatCurrency(14500, lang)}</p>
                </div>
                
                <div className="bg-blue-600 p-5 rounded-[2rem] text-white shadow-xl shadow-blue-500/20">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                       <Star size={20} className="text-blue-100" />
                    </div>
                    <span className="text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">+12%</span>
                  </div>
                  <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">{t.tips}</p>
                  <p className="text-xl font-black">{formatCurrency(1200, lang)}</p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <h3 className="font-extrabold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={16} className="text-blue-600" />
                   RECONCILIATION ACTIONS
                </h3>
                
                <ActionButton 
                  onClick={() => simulateScan('receipt')}
                  icon={<Scan size={28} />}
                  title={t.scanReceipt}
                  subtitle="OCR parsing for fiscal bills"
                  color="orange"
                />

                <ActionButton 
                  disabled={!scannedData.receipt}
                  onClick={() => simulateScan('payment')}
                  icon={<Wallet size={28} />}
                  title={t.matchPayment}
                  subtitle="Link digital transaction"
                  color="emerald"
                  active={!!scannedData.receipt}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-900">{t.recentActivity}</h3>
                  <button className="text-blue-600 text-xs font-bold underline underline-offset-4">{t.history}</button>
                </div>
                
                <div className="space-y-3">
                  {scannedData.receipt ? (
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4 animate-in slide-in-from-right-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center font-bold text-blue-600">
                        {scannedData.receipt.id.split('-')[1]}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-black text-slate-900">{scannedData.receipt.id}</p>
                        <p className="text-xs text-slate-500 font-bold">{formatCurrency(scannedData.receipt.amount, lang)}</p>
                      </div>
                      <button onClick={() => setScannedData({})} className="p-2 hover:bg-slate-200 rounded-full text-slate-400">
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <div className="py-12 flex flex-col items-center border-2 border-dashed border-slate-200 rounded-3xl">
                       <History className="text-slate-300 mb-3" size={32} />
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">No pending matches</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {(step === 'scanning-receipt' || step === 'scanning-payment') && (
            <motion.div 
              key="scanning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 relative bg-black"
            >
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <div className="w-full aspect-[3/4] border-4 border-white/40 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute inset-0 bg-blue-500/5" />
                    <motion.div 
                      initial={{ top: 0 }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="absolute left-0 right-0 h-1.5 bg-blue-400 shadow-[0_0_25px_rgba(59,130,246,1)] z-10"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="w-full h-full border-[60px] border-black/60 rounded-[2.5rem]" />
                    </div>
                 </div>
              </div>
              
              <div className="absolute bottom-20 left-0 right-0 px-8 text-center text-white">
                <h3 className="text-2xl font-black mb-2 tracking-tight">
                  {step === 'scanning-receipt' ? 'AI ANALYZING BILL...' : 'LINKING PAYMENT...'}
                </h3>
                <p className="text-slate-400 text-sm font-medium mb-8">Keep camera steady and centered</p>
                <div className="max-w-xs mx-auto bg-white/10 h-2.5 rounded-full overflow-hidden backdrop-blur-md">
                  <motion.div 
                    className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${scanProgress}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 'matching' && (
            <motion.div 
              key="matching"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="w-28 h-28 bg-emerald-100 rounded-[3rem] flex items-center justify-center text-emerald-600 mb-8 shadow-inner animate-in zoom-in-50">
                <CheckCircle2 size={56} />
              </div>
              <h2 className="text-4xl font-black mb-3 text-slate-900 tracking-tighter">MATCHED!</h2>
              <p className="text-slate-500 mb-10 font-medium px-6 leading-relaxed">
                Receipt <span className="font-bold text-slate-900">{scannedData.receipt?.id}</span> successfully linked to <span className="font-bold text-slate-900">{scannedData.payment?.method}</span> transaction.
              </p>

              <div className="w-full space-y-4 mb-10">
                <div className="flex justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                  <span className="text-slate-500 font-bold text-sm">Subtotal</span>
                  <span className="font-black text-slate-900 text-lg">{formatCurrency(scannedData.receipt?.amount || 0, lang)}</span>
                </div>
                <div className="flex justify-between p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                  <span className="text-emerald-600 font-bold text-sm">Expected Tip</span>
                  <span className="font-black text-emerald-700 text-lg">+ {formatCurrency(150, lang)}</span>
                </div>
              </div>

              <button 
                onClick={startFeedback}
                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-3 active:scale-95"
              >
                Complete & Next <ArrowRight size={20} />
              </button>
            </motion.div>
          )}

          {step === 'shift-summary' && (
            <motion.div 
              key="shift-summary"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="flex-1 p-6 flex flex-col h-full"
            >
               <header className="flex items-center gap-4 mb-8">
                  <button onClick={() => setStep('main')} className="p-2 bg-slate-100 rounded-xl">
                    <X size={20} />
                  </button>
                  <h2 className="text-xl font-black tracking-tight">Shift Summary</h2>
               </header>

               <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden mb-8">
                  <img 
                    src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/f9ced266-3235-47c0-b1ab-f47c5bdc7d30/waiter-shift-summary-db18f8a7-1772177561876.webp" 
                    className="w-full h-40 object-cover opacity-80"
                    alt="Summary"
                  />
                  <div className="p-6 space-y-6">
                     <div className="flex justify-between items-center">
                        <div>
                           <p className="text-xs font-bold text-slate-400">TOTAL SALES</p>
                           <p className="text-2xl font-black">{formatCurrency(14500, lang)}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-xs font-bold text-slate-400">TIPS COLLECTED</p>
                           <p className="text-2xl font-black text-emerald-600">{formatCurrency(1200, lang)}</p>
                        </div>
                     </div>
                     
                     <div className="space-y-3">
                        <div className="flex justify-between text-sm font-bold border-b border-slate-50 pb-2">
                           <span className="text-slate-500">Telebirr</span>
                           <span>{formatCurrency(8500, lang)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold border-b border-slate-50 pb-2">
                           <span className="text-slate-500">CBE Birr</span>
                           <span>{formatCurrency(4000, lang)}</span>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                           <span className="text-slate-500">Cash/Other</span>
                           <span>{formatCurrency(2000, lang)}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <button 
                onClick={() => { toast.info("Shift closed! Good job today."); setStep('main'); }}
                className="mt-auto w-full py-5 bg-rose-600 text-white rounded-[2rem] font-black hover:bg-rose-700 transition-all shadow-xl flex items-center justify-center gap-3"
               >
                 Close & Finalize Shift
               </button>
            </motion.div>
          )}

          {step === 'feedback' && (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 p-8 flex flex-col items-center justify-center text-center"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-8">
                <ThumbsUp size={48} />
              </div>
              <h2 className="text-3xl font-black mb-2 tracking-tight">Guest Feedback</h2>
              <p className="text-slate-500 mb-10 font-medium">Quickly record customer satisfaction</p>

              <div className="flex gap-3 mb-10">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                      rating >= star ? "bg-amber-400 text-white shadow-lg shadow-amber-200" : "bg-slate-100 text-slate-300"
                    )}
                  >
                    <Star size={24} className={cn(rating >= star && "fill-white")} />
                  </button>
                ))}
              </div>

              <div className="w-full p-5 bg-slate-50 rounded-[1.5rem] border border-slate-200 mb-10">
                <textarea 
                  placeholder="Special notes..."
                  className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium resize-none placeholder:text-slate-300"
                  rows={3}
                />
              </div>

              <button 
                onClick={completeMatch}
                className="w-full py-5 bg-blue-600 text-white rounded-[2rem] font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
              >
                Submit Experience
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Nav Area */}
        <nav className="h-24 border-t border-slate-100 flex items-center justify-around px-8 bg-white shrink-0">
          <NavButton 
            active={step === 'main'} 
            icon={<Scan size={24} />} 
            label="HOME"
            onClick={() => setStep('main')}
          />
          <NavButton 
            active={step === 'history'} 
            icon={<History size={24} />} 
            label="LOGS"
            onClick={() => setStep('history')}
          />
          <div className="w-16 h-16 bg-slate-900 rounded-3xl -mt-16 flex items-center justify-center text-white shadow-2xl border-[6px] border-white transition-all active:scale-90">
            <Plus size={32} />
          </div>
          <NavButton 
            active={false} 
            icon={<Wallet size={24} />} 
            label="PAY"
          />
          <NavButton 
            active={false} 
            icon={<Star size={24} />} 
            label="RATE"
          />
        </nav>
      </div>
    </div>
  );
};

const ActionButton = ({ icon, title, subtitle, color, onClick, disabled, active }: any) => (
  <button 
    disabled={disabled}
    onClick={onClick}
    className={cn(
      "w-full flex items-center justify-between p-5 rounded-[2.5rem] transition-all border",
      disabled 
        ? "bg-slate-50/50 border-transparent opacity-40 cursor-not-allowed" 
        : "bg-white border-slate-100 hover:border-blue-200 hover:shadow-lg",
      active && "bg-blue-50 border-blue-200 ring-2 ring-blue-100 ring-offset-2 shadow-inner"
    )}
  >
    <div className="flex items-center gap-4">
      <div className={cn(
        "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-inner transition-transform",
        color === 'orange' ? "bg-orange-50 text-orange-600" : "bg-emerald-50 text-emerald-600",
        !disabled && "hover:scale-105 active:scale-95"
      )}>
        {icon}
      </div>
      <div className="text-left">
        <p className="font-black text-slate-900 uppercase tracking-tight">{title}</p>
        <p className="text-xs text-slate-500 font-bold">{subtitle}</p>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
       <ChevronRight size={20} />
    </div>
  </button>
);

const NavButton = ({ active, icon, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex flex-col items-center gap-1 transition-all duration-300",
      active ? "text-blue-600 scale-110" : "text-slate-300 hover:text-slate-400"
    )}
  >
    {icon}
    <span className="text-[9px] font-black tracking-widest">{label}</span>
  </button>
);
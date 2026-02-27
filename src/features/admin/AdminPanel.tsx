import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  DollarSign, 
  AlertCircle, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar,
  CreditCard,
  Star,
  Zap,
  ShieldAlert,
  TrendingUp,
  Award,
  Search,
  Lock
} from 'lucide-react';
import { formatCurrency, cn, translations } from '../../lib/utils';
import { Transaction, Discrepancy, Language } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';

const mockTransactions: Transaction[] = [
  { id: '1', waiterId: 'w1', waiterName: 'Abebe B.', amount: 1250, tip: 150, method: 'Telebirr', status: 'matched', receiptId: 'RCP-8821', timestamp: '2024-03-20 12:30', riskScore: 5 },
  { id: '2', waiterId: 'w2', waiterName: 'Selam T.', amount: 450, tip: 50, method: 'CBE Birr', status: 'flagged', receiptId: 'RCP-8822', timestamp: '2024-03-20 12:45', riskScore: 88 },
  { id: '3', waiterId: 'w1', waiterName: 'Abebe B.', amount: 2100, tip: 200, method: 'M-Pesa', status: 'matched', receiptId: 'RCP-8823', timestamp: '2024-03-20 13:10', riskScore: 12 },
  { id: '4', waiterId: 'w3', waiterName: 'Kebede K.', amount: 890, tip: 90, method: 'Cash', status: 'pending', receiptId: 'RCP-8824', timestamp: '2024-03-20 13:25', riskScore: 45 },
];

const mockDiscrepancies: Discrepancy[] = [
  { id: 'D1', type: 'amount_mismatch', severity: 'high', description: 'Receipt Br 1,250 vs Telebirr Br 1,150', timestamp: '2 mins ago', transactionId: 'TXN-101' },
  { id: 'D2', type: 'invalid_merchant', severity: 'medium', description: 'Payment made to unverified sub-merchant ID', timestamp: '15 mins ago', transactionId: 'TXN-102' },
  { id: 'D3', type: 'duplicate_receipt', severity: 'low', description: 'Receipt RCP-8821 scanned again after 30 mins', timestamp: '1 hour ago', transactionId: 'TXN-103' },
];

const revenueData = [
  { name: 'Mon', amount: 45000 },
  { name: 'Tue', amount: 52000 },
  { name: 'Wed', amount: 48000 },
  { name: 'Thu', amount: 61000 },
  { name: 'Fri', amount: 75000 },
  { name: 'Sat', amount: 92000 },
  { name: 'Sun', amount: 88000 },
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

type AdminTab = 'overview' | 'fraud' | 'analytics' | 'alerts';

interface AdminPanelProps {
  lang: Language;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ lang }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const t = translations[lang];

  return (
    <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t.dashboard} Hub</h1>
          <p className="text-slate-500 font-medium mt-1">Business Intelligence & Real-time Reconciliation</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
           <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-bold text-slate-500 shadow-sm">
              <Calendar size={16} />
              <span>Mar 20, 2024</span>
           </div>
           <button className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black hover:bg-black transition-all shadow-xl shadow-slate-200 active:scale-95">
             <Download size={18} /> Export Data
           </button>
        </div>
      </header>

      {/* Main Tabs */}
      <div className="flex overflow-x-auto pb-2 gap-2 bg-slate-200/40 p-1.5 rounded-2xl w-fit">
        <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} label="Analytics" icon={<TrendingUp size={18} />} />
        <TabButton active={activeTab === 'fraud'} onClick={() => setActiveTab('fraud')} label="Fraud Shield" icon={<Lock size={18} />} />
        <TabButton active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')} label="Discrepancies" icon={<ShieldAlert size={18} />} badge="3" />
        <TabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')} label="Performance" icon={<Award size={18} />} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="space-y-8"
        >
          {activeTab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Gross Revenue" value={formatCurrency(124500, lang)} change="+12%" positive icon={<DollarSign className="text-blue-600" />} />
                <StatCard title="Success Rate" value="99.2%" change="+0.5%" positive icon={<Zap className="text-amber-500" />} />
                <StatCard title="Waiters Active" value="14" change="Live" positive icon={<Users className="text-emerald-600" />} />
                <StatCard title="Alerts" value="03" change="+2" positive={false} icon={<AlertCircle className="text-rose-600" />} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                <div className="xl:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-xl font-black text-slate-900">Revenue Trends</h3>
                     <div className="flex gap-2">
                        <button className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">DAILY</button>
                        <button className="px-3 py-1 text-slate-400 rounded-lg text-xs font-bold">WEEKLY</button>
                     </div>
                  </div>
                  <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `Br ${v/1000}k`} tick={{fontSize: 12, fontWeight: 600, fill: '#94a3b8'}} />
                        <Tooltip 
                           contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
                   <div className="relative z-10">
                      <h3 className="text-xl font-black mb-6">Channel Distribution</h3>
                      <div className="h-[250px]">
                         <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                               <Pie
                                  data={[
                                     { name: 'Telebirr', value: 45 },
                                     { name: 'CBE Birr', value: 25 },
                                     { name: 'M-Pesa', value: 15 },
                                     { name: 'Cash', value: 15 },
                                  ]}
                                  innerRadius={70}
                                  outerRadius={95}
                                  paddingAngle={8}
                                  dataKey="value"
                               >
                                  {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                               </Pie>
                               <Tooltip />
                            </PieChart>
                         </ResponsiveContainer>
                      </div>
                      <div className="space-y-4 mt-6">
                         {[ 
                            { name: 'Telebirr', val: '45%', color: COLORS[0] },
                            { name: 'CBE Birr', val: '25%', color: COLORS[1] },
                            { name: 'M-Pesa', val: '15%', color: COLORS[2] },
                            { name: 'Cash/Other', val: '15%', color: COLORS[3] }
                         ].map(item => (
                            <div key={item.name} className="flex items-center justify-between">
                               <div className="flex items-center gap-2">
                                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                  <span className="text-sm font-bold text-slate-400">{item.name}</span>
                               </div>
                               <span className="text-sm font-black">{item.val}</span>
                            </div>
                         ))}
                      </div>
                   </div>
                   <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                 <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="text-xl font-black">Transaction Ledger</h3>
                    <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl">
                       <Search size={16} className="text-slate-400" />
                       <input type="text" placeholder="Search ID..." className="bg-transparent border-none text-sm font-bold focus:ring-0 w-32" />
                    </div>
                 </div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          <tr>
                             <th className="px-8 py-5">Receipt ID</th>
                             <th className="px-8 py-5">Waiter</th>
                             <th className="px-8 py-5">Amount</th>
                             <th className="px-8 py-5">Status</th>
                             <th className="px-8 py-5 text-center">Risk</th>
                             <th className="px-8 py-5">Time</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-100">
                          {mockTransactions.map(tx => (
                             <tr key={tx.id} className="group hover:bg-slate-50/50 transition-colors">
                                <td className="px-8 py-6 font-mono font-bold text-slate-900">{tx.receiptId}</td>
                                <td className="px-8 py-6">
                                   <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black">{tx.waiterName[0]}</div>
                                      <span className="text-sm font-bold">{tx.waiterName}</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6 font-black text-slate-900">{formatCurrency(tx.amount, lang)}</td>
                                <td className="px-8 py-6">
                                   <span className={cn(
                                      "px-3 py-1 rounded-full text-[10px] font-black",
                                      tx.status === 'matched' ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                   )}>
                                      {tx.status.toUpperCase()}
                                   </span>
                                </td>
                                <td className="px-8 py-6">
                                   <div className="flex flex-col items-center">
                                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                         <div 
                                            className={cn(
                                               "h-full transition-all",
                                               (tx.riskScore || 0) < 30 ? "bg-emerald-500" : (tx.riskScore || 0) < 70 ? "bg-amber-500" : "bg-rose-500"
                                            )} 
                                            style={{ width: `${tx.riskScore}%` }}
                                         />
                                      </div>
                                      <span className="text-[9px] font-black mt-1">{tx.riskScore}%</span>
                                   </div>
                                </td>
                                <td className="px-8 py-6 text-slate-400 font-bold text-xs">{tx.timestamp}</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
            </>
          )}

          {activeTab === 'fraud' && (
            <div className="space-y-8">
               <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                     <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-blue-500/20 px-4 py-2 rounded-full border border-blue-500/30">
                           <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                           <span className="text-xs font-black uppercase tracking-widest">AI Fraud Shield Active</span>
                        </div>
                        <h2 className="text-5xl font-black leading-tight tracking-tighter">Detect anomalies before they hit your books.</h2>
                        <p className="text-slate-400 text-lg">Our neural engine cross-references POS data with payment gateway webhooks in 200ms.</p>
                        <div className="grid grid-cols-2 gap-4 pt-4">
                           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                              <p className="text-xs font-bold text-slate-500">THREATS BLOCKED</p>
                              <p className="text-3xl font-black mt-1">1,240</p>
                           </div>
                           <div className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                              <p className="text-xs font-bold text-slate-500">SECURITY SCORE</p>
                              <p className="text-3xl font-black mt-1 text-blue-400">A+</p>
                           </div>
                        </div>
                     </div>
                     <div className="relative">
                        <img 
                           src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/f9ced266-3235-47c0-b1ab-f47c5bdc7d30/fraud-detection-dashboard-53d00188-1772177561676.webp" 
                           className="rounded-[2.5rem] shadow-2xl shadow-blue-500/20 border-4 border-white/5"
                           alt="Shield UI"
                        />
                     </div>
                  </div>
                  <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-600/20 blur-[100px]" />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FraudAlert type="Double Scan" count={4} severity="high" />
                  <FraudAlert type="Amount Variance" count={12} severity="medium" />
                  <FraudAlert type="Delayed Auth" count={8} severity="low" />
               </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                     <ShieldAlert className="text-rose-500" />
                     Critical Mismatches
                  </h3>
                  <div className="space-y-4">
                     {mockDiscrepancies.map(d => (
                        <div key={d.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-md transition-all cursor-pointer group">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                 <span className={cn(
                                    "w-2 h-2 rounded-full",
                                    d.severity === 'high' ? "bg-rose-500" : "bg-amber-500"
                                 )} />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{d.type.replace('_', ' ')}</span>
                              </div>
                              <span className="text-[10px] font-bold text-slate-400">{d.timestamp}</span>
                           </div>
                           <p className="text-sm font-bold text-slate-900 mt-2">{d.description}</p>
                           <div className="flex justify-between items-center mt-4">
                              <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border">REF: {d.transactionId}</span>
                              <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">Investigate</button>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col justify-center items-center text-center">
                  <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center mb-6 backdrop-blur-md">
                     <Zap size={48} />
                  </div>
                  <h3 className="text-3xl font-black mb-4">Resolution Center</h3>
                  <p className="text-blue-100 mb-8 max-w-sm font-medium">Quickly reconcile flagging items by approving variances or requesting re-scans from staff.</p>
                  <button className="px-10 py-4 bg-white text-blue-600 rounded-2xl font-black shadow-xl hover:bg-blue-50 transition-all">
                     Go to Resolution Hub
                  </button>
               </div>
            </div>
          )}

          {activeTab === 'analytics' && (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                   <h3 className="text-xl font-black mb-8">Staff Sales Leaderboard</h3>
                   <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={[
                            { name: 'Abebe B.', val: 45000 },
                            { name: 'Selam T.', val: 38000 },
                            { name: 'Mekdes Z.', val: 51000 },
                            { name: 'Kebede K.', val: 29000 },
                         ]} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f1f5f9" />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontWeight: 600, fontSize: 13}} />
                            <Bar dataKey="val" fill="#3b82f6" radius={[0, 8, 8, 0]} barSize={24} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                   <h3 className="text-xl font-black mb-8">Service Feedback Mix</h3>
                   <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart>
                            <Pie
                               data={[
                                  { name: 'Excellent', value: 65 },
                                  { name: 'Good', value: 25 },
                                  { name: 'Average', value: 8 },
                                  { name: 'Poor', value: 2 },
                               ]}
                               cx="50%"
                               cy="50%"
                               innerRadius={80}
                               outerRadius={120}
                               paddingAngle={5}
                               dataKey="value"
                            >
                               {COLORS.map((c, i) => <Cell key={i} fill={c} />)}
                            </Pie>
                            <Tooltip />
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                </div>
             </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  badge?: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label, icon, badge }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-black transition-all whitespace-nowrap",
      active 
        ? "bg-white text-blue-600 shadow-sm scale-105" 
        : "text-slate-500 hover:text-slate-800 hover:bg-white/40"
    )}
  >
    {icon}
    {label}
    {badge && (
      <span className="flex items-center justify-center min-w-[20px] h-5 px-1 bg-rose-500 text-white text-[10px] font-black rounded-full">
        {badge}
      </span>
    )}
  </button>
);

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, positive, icon }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
    <div className="flex justify-between items-start mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <div className={cn(
        "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black",
        positive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
      )}>
        {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {change}
      </div>
    </div>
    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
    <h4 className="text-3xl font-black text-slate-900 mt-1">{value}</h4>
  </div>
);

interface FraudAlertProps {
  type: string;
  count: number;
  severity: 'high' | 'medium' | 'low';
}

const FraudAlert: React.FC<FraudAlertProps> = ({ type, count, severity }) => (
   <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{type}</p>
         <p className="text-2xl font-black mt-1">{count}</p>
      </div>
      <div className={cn(
         "w-10 h-10 rounded-xl flex items-center justify-center",
         severity === 'high' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
      )}>
         <ShieldAlert size={20} />
      </div>
   </div>
);
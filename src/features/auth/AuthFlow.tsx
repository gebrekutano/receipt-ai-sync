import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Hash, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import { SignupData } from '../../types';

interface AuthFlowProps {
  onSuccess: (user: any) => void;
}

export const AuthFlow: React.FC<AuthFlowProps> = ({ onSuccess }) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupData>({
    businessName: '',
    username: '',
    email: '',
    phone: '',
    tinNumber: '',
  });
  const [otp, setOtp] = useState('');

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || !formData.username || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    // Simulate OTP generation
    setTimeout(() => {
      setIsLoading(false);
      setStep('otp');
      toast.success(`OTP sent to ${formData.phone || formData.email}`);
    }, 1500);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      toast.error('Please enter a valid OTP');
      return;
    }

    setIsLoading(true);
    // Simulate Verification
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Registration successful!');
      onSuccess({
        id: 'user_123',
        ...formData
      });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-sans">
      {/* Left Side: Branding/Image */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative p-12 flex-col justify-between">
        <div className="absolute inset-0 opacity-40">
           <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/f9ced266-3235-47c0-b1ab-f47c5bdc7d30/auth-background-bb72ca13-1772193461845.webp" 
            alt="Background" 
            className="w-full h-full object-cover"
           />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20">E</div>
            <span className="text-3xl font-black text-white tracking-tighter">EthioSync</span>
          </div>
          <h1 className="text-6xl font-black text-white mt-20 leading-tight">
            The backbone of <br />
            <span className="text-blue-500">Ethiopian</span> Retail.
          </h1>
          <p className="text-slate-400 text-xl mt-6 max-w-md font-medium">
            Join the most advanced B2B payment reconciliation platform in the region.
          </p>
        </div>
        <div className="relative z-10 flex gap-12">
           <div>
              <p className="text-3xl font-black text-white">2.5k+</p>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Businesses</p>
           </div>
           <div>
              <p className="text-3xl font-black text-white">99.9%</p>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Accuracy</p>
           </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-50 lg:bg-white relative">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {step === 'details' ? (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Create Account</h2>
                  <p className="text-slate-500 font-medium mt-2">Scale your hospitality business with ease.</p>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  <div className="space-y-4">
                    <InputField 
                      icon={<Building2 size={20} />} 
                      label="Business Name" 
                      placeholder="e.g. Hilton Addis Ababa"
                      required
                      value={formData.businessName}
                      onChange={(v) => setFormData({...formData, businessName: v})}
                    />
                    <InputField 
                      icon={<User size={20} />} 
                      label="Username" 
                      placeholder="business_admin"
                      required
                      value={formData.username}
                      onChange={(v) => setFormData({...formData, username: v})}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InputField 
                        icon={<Mail size={20} />} 
                        label="Email (Optional)" 
                        placeholder="admin@hotel.com"
                        type="email"
                        value={formData.email}
                        onChange={(v) => setFormData({...formData, email: v})}
                      />
                      <InputField 
                        icon={<Phone size={20} />} 
                        label="Phone Number" 
                        placeholder="+251..."
                        required
                        value={formData.phone}
                        onChange={(v) => setFormData({...formData, phone: v})}
                      />
                    </div>
                    <InputField 
                      icon={<Hash size={20} />} 
                      label="TIN Number (Optional)" 
                      placeholder="1234567890"
                      value={formData.tinNumber}
                      onChange={(v) => setFormData({...formData, tinNumber: v})}
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20} /></>}
                  </button>
                </form>

                <p className="text-center text-sm font-bold text-slate-400">
                  Already have an account? <button className="text-blue-600 hover:underline">Log in</button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ShieldCheck size={40} />
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">Verify Identity</h2>
                  <p className="text-slate-500 font-medium mt-2">
                    Enter the 4-digit code sent to <br />
                    <span className="text-slate-900 font-bold">{formData.phone || formData.email}</span>
                  </p>
                </div>

                <form onSubmit={handleOtpVerify} className="space-y-8">
                  <div className="flex justify-center gap-4">
                    {[0, 1, 2, 3].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        className="w-16 h-20 bg-slate-100 border-2 border-transparent focus:border-blue-600 focus:bg-white rounded-2xl text-center text-3xl font-black transition-all"
                        value={otp[i] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val && otp.length < 4) {
                            setOtp(otp + val);
                          } else if (!val) {
                            setOtp(otp.slice(0, -1));
                          }
                        }}
                      />
                    ))}
                  </div>

                  <div className="space-y-4">
                    <button 
                      type="submit" 
                      disabled={isLoading || otp.length < 4}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? <Loader2 className="animate-spin" /> : <>Verify & Complete <CheckCircle2 size={20} /></>}
                    </button>
                    <button 
                      type="button"
                      onClick={() => setStep('details')}
                      className="w-full py-4 text-slate-400 font-bold hover:text-slate-900 transition-colors"
                    >
                      Change Phone Number
                    </button>
                  </div>
                </form>

                <p className="text-center text-sm font-bold text-slate-400">
                  Didn't receive a code? <button className="text-blue-600 hover:underline">Resend OTP</button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

interface InputFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (val: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({ icon, label, placeholder, type = 'text', required, value, onChange }) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 font-bold placeholder:text-slate-400 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
      />
    </div>
  </div>
);
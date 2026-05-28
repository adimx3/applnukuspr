"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { X, User, Lock, Phone, Shield, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { AppleLogo } from "../ui/AppleLogo";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export function AuthModal() {
  const { isAuthModalOpen, authView, closeAuthModal, openAuthModal, login } = useAuthStore();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parollarni tekshirish (faqat ro'yxatdan o'tishda)
    if (authView === 'register' && password !== confirmPassword) {
      alert("Parollar mos kelmadi!");
      return;
    }

    setStatus('loading');

    // 1.5 soniyalik animatsiya
    setTimeout(() => {
      if (authView === 'login') {
        if (username === process.env.NEXT_PUBLIC_ADMIN_LOGIN && password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
          setStatus('success');
          setTimeout(() => {
            login("admin");
            setStatus('idle');
          }, 1000);
        } else {
          setStatus('error');
          setTimeout(() => {
            setStatus('idle');
            setPassword("");
          }, 2000);
        }
      } else {
        // Ro'yxatdan o'tish
        setStatus('success');
        setTimeout(() => {
          login("user");
          setStatus('idle');
        }, 1000);
      }
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f0f11] border border-[#222] rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Close Button - Faqat kutish/loading bo'lmaganda chiqadi */}
        {status === 'idle' && (
          <button 
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white bg-[#1a1a1a] hover:bg-[#333] rounded-full transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        <AnimatePresence mode="wait">
          {status === 'idle' ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Header */}
              <div className="pt-8 pb-6 flex flex-col items-center border-b border-[#222] relative overflow-hidden">
                <div className="absolute inset-0 bg-[#ffa500]/10 blur-xl rounded-full scale-150 pointer-events-none" />
                <div className="relative w-16 h-16 bg-[#ffa500] rounded-2xl flex items-center justify-center text-black shadow-[0_0_25px_rgba(255,165,0,0.4)] mb-4">
                   <AppleLogo className="w-8 h-8 mb-0.5" />
                </div>
                <h2 className="relative text-2xl font-serif font-bold text-white tracking-wider">APPL NUKUS</h2>
                <p className="relative text-[10px] text-[#ffa500] uppercase tracking-[0.2em] mt-2 flex items-center gap-1.5 font-bold">
                  <Shield className="w-3 h-3" /> Premium Avtorizatsiya
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#222] bg-[#0a0a0a]">
                <button 
                  className={clsx(
                    "flex-1 py-4 text-sm font-semibold transition-all duration-300",
                    authView === 'login' ? "text-[#ffa500] border-b-2 border-[#ffa500] bg-[#111]" : "text-gray-500 hover:text-white"
                  )}
                  onClick={() => openAuthModal('login')}
                  type="button"
                >
                  Kirish
                </button>
                <button 
                  className={clsx(
                    "flex-1 py-4 text-sm font-semibold transition-all duration-300",
                    authView === 'register' ? "text-[#ffa500] border-b-2 border-[#ffa500] bg-[#111]" : "text-gray-500 hover:text-white"
                  )}
                  onClick={() => openAuthModal('register')}
                  type="button"
                >
                  Ro'yxatdan o'tish
                </button>
              </div>

              {/* Form */}
              <div className="p-8">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4" autoComplete="off">
                  {/* Name / Username Field */}
                  <div>
                    <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">
                      Username yoki ism
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-gray-500 group-focus-within:text-[#ffa500] transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        name="random-username"
                        autoComplete="off"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] focus:border-[#ffa500] block pl-11 p-3.5 transition-all outline-none shadow-inner" 
                        placeholder="Username yoki ism"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Field (Faqat Ro'yxatdan o'tishda) */}
                  {authView === 'register' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2 mt-2">
                        Telefon raqami
                      </label>
                      <div className="relative group flex items-center">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                          <Phone className="w-4 h-4 text-gray-500 group-focus-within:text-[#ffa500] transition-colors" />
                        </div>
                        <span className="absolute left-[44px] text-gray-300 text-sm font-medium z-10 pointer-events-none">+998</span>
                        <input 
                          type="tel" 
                          name="random-phone"
                          autoComplete="off"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] focus:border-[#ffa500] block pl-[88px] p-3.5 transition-all outline-none shadow-inner" 
                          placeholder="(90) 123-45-67"
                          required={authView === 'register'}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Password Field */}
                  <div className={authView === 'register' ? "mt-2" : ""}>
                    <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">
                      Parol
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-[#ffa500] transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        name="new-password"
                        autoComplete="new-password"
                        spellCheck={false}
                        autoCapitalize="none"
                        autoCorrect="off"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="security-disc w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] focus:border-[#ffa500] block pl-11 p-3.5 transition-all outline-none shadow-inner" 
                        required
                      />
                    </div>
                  </div>

                  {/* Confirm Password Field (Faqat Ro'yxatdan o'tishda) */}
                  {authView === 'register' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2 mt-2">
                        Parolni tasdiqlash
                      </label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-4 h-4 text-gray-500 group-focus-within:text-[#ffa500] transition-colors" />
                        </div>
                        <input 
                          type="text" 
                          name="new-confirm-password"
                          autoComplete="new-password"
                          spellCheck={false}
                          autoCapitalize="none"
                          autoCorrect="off"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="security-disc w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] focus:border-[#ffa500] block pl-11 p-3.5 transition-all outline-none shadow-inner" 
                          required={authView === 'register'}
                        />
                      </div>
                    </motion.div>
                  )}

                  <button 
                    type="submit"
                    className="mt-6 w-full py-4 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_30px_rgba(255,165,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {authView === 'login' ? 'Tizimga kirish' : "Ro'yxatdan o'tish"}
                  </button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="loading-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center min-h-[450px]"
            >
              {status === 'loading' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <Loader2 className="w-16 h-16 text-[#ffa500] animate-spin mb-6 drop-shadow-[0_0_15px_rgba(255,165,0,0.5)]" />
                  <h3 className="text-xl font-serif font-bold text-white tracking-widest">Kutib turing...</h3>
                  <p className="text-sm text-gray-400 mt-2">Ma'lumotlar tekshirilmoqda</p>
                </motion.div>
              )}
              
              {status === 'success' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-[#ffa500] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,165,0,0.6)] mb-6">
                    <CheckCircle2 className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-white tracking-widest drop-shadow-md">Muvaffaqiyatli!</h3>
                  <p className="text-sm text-[#ffa500] mt-3 font-bold uppercase tracking-[0.2em]">Xush kelibsiz</p>
                </motion.div>
              )}

              {status === 'error' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)] mb-6">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-wider drop-shadow-md">Xatolik!</h3>
                  <p className="text-sm text-red-500 mt-3 font-bold uppercase tracking-wider text-center">Noto'g'ri login yoki parol</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

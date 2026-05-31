"use client";

import { useState } from "react";
import { X, CheckCircle2, CreditCard, Banknote, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useCartStore } from "@/store/useCartStore";
import { useMyOrdersStore } from "@/store/useMyOrdersStore";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: string;
  onConfirm: () => void;
}

export function CheckoutModal({ isOpen, onClose, totalAmount, onConfirm }: CheckoutModalProps) {
  const { cardNumber } = useSettingsStore();
  const { items } = useCartStore();
  const { addOrderId } = useMyOrdersStore();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name,
          customerPhone: phone,
          customerAddress: address,
          paymentMethod,
          totalAmount,
          items: items.map(item => ({
            id: item.id,
            quantity: item.quantity,
            price: item.price
          }))
        })
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      
      // Save order ID to local storage
      if (data && data.id) {
        addOrderId(data.id);
      }

      setStatus('success');
      setTimeout(() => {
        onConfirm();
      }, 1500);
    } catch (error) {
      console.error('Error submitting order:', error);
      setStatus('idle');
      alert('Buyurtmani yuborishda xatolik yuz berdi. Iltimos, qaytadan urinib ko\'ring.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f0f11] border border-[#222] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto scrollbar-hide">
        
        {status === 'idle' && (
          <button 
            onClick={onClose}
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
              className="p-8"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white tracking-wide">Buyurtma berish</h2>
                <p className="text-sm text-gray-500 mt-1">Ma&apos;lumotlaringizni kiriting. Jami summa: <strong className="text-[#ffa500] font-mono">{totalAmount} $</strong></p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Ism-familiya</label>
                  <input type="text" required value={name} onChange={e=>setName(e.target.value)} className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] p-3 outline-none transition-all" placeholder="Masalan: Ali Valiyev" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Telefon raqam</label>
                  <input type="tel" required value={phone} onChange={e=>setPhone(e.target.value)} className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] p-3 outline-none transition-all" placeholder="+998 90 123 45 67" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Manzil (Yetkazib berish)</label>
                  <input type="text" required value={address} onChange={e=>setAddress(e.target.value)} className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] p-3 outline-none transition-all" placeholder="Shahar, ko'cha, uy raqami" />
                </div>

                {/* To'lov usuli */}
                <div className="mt-2">
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">To&apos;lov usuli</label>
                  <div className="flex gap-3">
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('cash')}
                      className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'cash' ? 'bg-[#ffa500]/10 border-[#ffa500] text-[#ffa500]' : 'bg-[#161616] border-[#333] text-gray-500 hover:border-[#555]'}`}
                    >
                      <Banknote className="w-6 h-6" />
                      <span className="text-xs font-bold">Naxt to&apos;lov</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all ${paymentMethod === 'card' ? 'bg-[#ffa500]/10 border-[#ffa500] text-[#ffa500]' : 'bg-[#161616] border-[#333] text-gray-500 hover:border-[#555]'}`}
                    >
                      <CreditCard className="w-6 h-6" />
                      <span className="text-xs font-bold">Karta (O&apos;tkazma)</span>
                    </button>
                  </div>
                </div>

                {/* Karta haqida ma'lumot */}
                {paymentMethod === 'card' && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 mt-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                      <p className="text-xs text-blue-400 mb-2">Quyidagi karta raqamiga to&apos;lov qilib, chekni kuryerga ko&apos;rsatasiz:</p>
                      <div className="bg-[#0f0f11] p-3 rounded-lg border border-[#333] flex items-center justify-between">
                        <span className="font-mono text-white tracking-widest font-bold">
                          {cardNumber || "Karta raqami kiritilmagan!"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                <button 
                  type="submit" 
                  disabled={paymentMethod === 'card' && !cardNumber}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-3.5 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="w-4 h-4" /> Buyurtmani Tasdiqlash
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="loading-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-12 flex flex-col items-center justify-center min-h-[400px]"
            >
              {status === 'loading' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-[#ffa500] animate-spin mb-6" />
                  <h3 className="text-xl font-serif font-bold text-white tracking-widest">Buyurtma rasmiylashtirilmoqda...</h3>
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.6)] mb-6">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-widest">Muvaffaqiyatli!</h3>
                  <p className="text-sm text-gray-400 mt-3 leading-relaxed">
                    Buyurtmangiz qabul qilindi. Tez orada operatorlarimiz siz bilan bog&apos;lanadi.
                  </p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

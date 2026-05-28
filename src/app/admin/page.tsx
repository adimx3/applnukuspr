"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Users, DollarSign, Package, TrendingUp, AlertCircle, CreditCard, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { role, isAuthenticated } = useAuthStore();
  const { cardNumber, setCardNumber } = useSettingsStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [localCardNumber, setLocalCardNumber] = useState("");

  useEffect(() => {
    setIsMounted(true);
    setLocalCardNumber(cardNumber);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardNumber]);

  useEffect(() => {
    if (isMounted && (!isAuthenticated || role !== 'admin')) {
      router.push("/");
    }
  }, [isAuthenticated, role, router, isMounted]);

  if (!isMounted || role !== 'admin') return null;

  const handleSaveCard = () => {
    setCardNumber(localCardNumber);
    alert("Karta raqami saqlandi!");
  };

  const stats = [
    { name: "Jami daromad", value: "$45,231.89", change: "+20.1%", icon: DollarSign },
    { name: "Faol mijozlar", value: "2,350", change: "+180.1%", icon: Users },
    { name: "Sotuvlar soni", value: "12,234", change: "+19%", icon: TrendingUp },
    { name: "Ombordagi qoldiq", value: "573", change: "-13", icon: Package },
  ];

  return (
    <div className="min-h-screen p-8 lg:p-12 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider">Boshqaruv Paneli</h1>
            <span className="px-3 py-1 bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-widest rounded-md border border-red-500/20">
              Admin
            </span>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl">
            Tizimning asosiy ko&apos;rsatkichlari va boshqaruv xulosasi.
          </p>
        </div>
      </div>

      {/* Warning Alert */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-8 flex items-start gap-4 relative z-10">
        <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-yellow-500 font-bold text-sm uppercase tracking-wider mb-1">E&apos;tibor bering</h4>
          <p className="text-gray-400 text-sm">
            Tizimda hozircha faqat vizual interfeys mavjud. Barcha ma&apos;lumotlar statik tarzda kiritilgan. Backend ulangach, ma&apos;lumotlar real vaqt rejimida yangilanadi.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#161616] border border-[#222] rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <stat.icon className="w-16 h-16" />
            </div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-wider mb-2">{stat.name}</p>
            <h3 className="text-3xl font-mono font-bold text-white mb-2">{stat.value}</h3>
            <p className={`text-xs font-bold ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
              {stat.change} o&apos;tgan oydan
            </p>
          </div>
        ))}
      </div>

      {/* Payment Settings */}
      <div className="mt-8 bg-[#161616] border border-[#222] rounded-2xl p-6 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-[#ffa500]/10 rounded-xl flex items-center justify-center border border-[#ffa500]/20">
            <CreditCard className="w-5 h-5 text-[#ffa500]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-wide">To&apos;lov Sozlamalari</h3>
            <p className="text-sm text-gray-500">Mijozlar to&apos;lov qilishi uchun karta raqamingizni kiriting</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 max-w-2xl">
          <input 
            type="text" 
            placeholder="Karta raqami (masalan: 8600 1234 5678 9012)"
            value={localCardNumber}
            onChange={(e) => setLocalCardNumber(e.target.value)}
            className="flex-1 bg-[#0f0f11] border border-[#333] text-white text-sm font-mono rounded-xl focus:ring-1 focus:ring-[#ffa500] focus:border-[#ffa500] p-3.5 outline-none transition-all"
          />
          <button 
            onClick={handleSaveCard}
            className="flex items-center justify-center gap-2 px-6 py-3.5 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.6)] transition-all"
          >
            <Save className="w-4 h-4" /> Saqlash
          </button>
        </div>
      </div>

      {/* Recent Orders Placeholder */}
      <div className="mt-8 bg-[#161616] border border-[#222] rounded-2xl p-6 relative z-10">
        <h3 className="text-lg font-bold text-white mb-6 tracking-wide">So&apos;nggi Buyurtmalar</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#333]">
                <th className="pb-3 font-semibold uppercase tracking-wider">Mijoz</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Mahsulot</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Sana</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Summa</th>
                <th className="pb-3 font-semibold uppercase tracking-wider">Holat</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
              {[
                { name: "Aziz Rahmonov", product: "iPhone 15 Pro Max", date: "26.05.2026", amount: "$1,250", status: "Bajarildi", sColor: "bg-green-500/10 text-green-500 border-green-500/20" },
                { name: "Dilshod Karimov", product: "MacBook Pro M3", date: "25.05.2026", amount: "$3,499", status: "Kutilmoqda", sColor: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
                { name: "Malika Aliyeva", product: "AirPods Pro", date: "24.05.2026", amount: "$249", status: "Bajarildi", sColor: "bg-green-500/10 text-green-500 border-green-500/20" },
              ].map((order, i) => (
                <tr key={i} className="border-b border-[#222] last:border-0 hover:bg-[#1a1a1a] transition-colors">
                  <td className="py-4 font-medium">{order.name}</td>
                  <td className="py-4">{order.product}</td>
                  <td className="py-4 text-gray-500">{order.date}</td>
                  <td className="py-4 font-mono">{order.amount}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${order.sColor}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

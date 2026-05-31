"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AppleLogo } from "../ui/AppleLogo";
import { Home, ShoppingBag, ShoppingCart, MapPin, Phone, Info, LogOut, LayoutDashboard, PackagePlus } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

const baseNavigation = [
  { name: "Bosh Sahifa", href: "/", icon: Home },
  { name: "Katalog / Shop", href: "/shop", icon: ShoppingBag },
  { name: "Savatcha", href: "/cart", icon: ShoppingCart },
  { name: "Filiallar", href: "/filials", icon: MapPin },
  { name: "Biz Haqimizda", href: "/about", icon: Info },
  { name: "Aloqa", href: "/contact", icon: Phone },
];

const adminNavigation = [
  { name: "Boshqaruv Paneli", href: "/admin", icon: LayoutDashboard },
  { name: "Mahsulotlar", href: "/admin/products", icon: PackagePlus },
  { name: "Buyurtmalar", href: "/admin/orders", icon: ShoppingBag },
];

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const { isAuthenticated, login, logout, role } = useAuthStore();
  const { totalItems } = useCartStore();

  const navigation = role === 'admin' ? [...adminNavigation, ...baseNavigation] : baseNavigation;

  return (
    <div className="w-72 h-screen bg-[#111] border-r border-[#222] flex flex-col fixed left-0 top-0 text-gray-300 z-50">
      {/* Brand Logo */}
      <div className="h-28 flex items-center px-6 border-b border-[#222]">
        <Link href="/" className="flex items-center gap-4 group" onClick={onNavigate}>
          <div className="w-12 h-12 bg-[#ffa500] rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(255,165,0,0.3)] group-hover:shadow-[0_0_25px_rgba(255,165,0,0.6)] transition-all duration-300">
            <AppleLogo className="w-7 h-7 mb-0.5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-widest font-serif">APPL NUKUS</h1>
            <p className="text-[10px] text-gray-500 tracking-[0.2em] uppercase mt-1">Premium Store</p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-4 flex flex-col gap-6">
        
        {/* Auth Section - Ro'yxatdan o'tilmagan bo'lsa chiqadi */}
        {!isAuthenticated ? (
          <div className="bg-[#161616] rounded-xl p-4 border border-[#222]">
            <p className="text-[10px] text-[#555] font-bold mb-3 uppercase tracking-widest text-center">Tizimga Kirish</p>
            <div className="flex gap-2">
              <button 
                onClick={() => login('user')}
                className="flex-1 py-2.5 text-xs font-semibold bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white rounded-lg transition-colors"
              >
                Kirish
              </button>
              <button 
                onClick={() => login('user')}
                className="flex-1 py-2.5 text-xs font-semibold bg-transparent border border-[#ffa500]/40 text-[#ffa500] hover:bg-[#ffa500]/10 rounded-lg transition-colors"
              >
                Ro'yxatdan o'tish
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#161616] rounded-xl p-4 border border-[#222] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#ffa500] rounded-lg flex items-center justify-center text-black font-bold text-lg shadow-[0_0_10px_rgba(255,165,0,0.2)]">
                {role === 'admin' ? 'A' : 'M'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{role === 'admin' ? 'Administrator' : 'Mijoz'}</p>
                <p className="text-[10px] text-[#ffa500] uppercase tracking-widest mt-0.5">
                  {role === 'admin' ? 'Boshqaruvchi' : 'Premium a\'zo'}
                </p>
              </div>
            </div>
            <button onClick={logout} className="p-2 hover:bg-[#222] rounded-lg text-gray-400 hover:text-white transition-colors" title="Chiqish">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation - Faqat ro'yxatdan o'tganlarga ko'rinadi */}
        {isAuthenticated && (
          <nav className="flex flex-col gap-2">
            <p className="text-xs text-[#555] font-bold mb-2 px-2 uppercase tracking-widest">Sahifalar Menyusi</p>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onNavigate}
                  className={clsx(
                    "flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-300",
                    isActive 
                      ? "bg-[#ffa500] text-black shadow-[0_4px_20px_rgba(255,165,0,0.25)] font-bold" 
                      : "hover:bg-[#1a1a1a] hover:text-white"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.name}</span>
                  {item.href === "/cart" && totalItems > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {/* Bottom info */}
      <div className="p-6 border-t border-[#222] flex items-center justify-center gap-2">
        <AppleLogo className="w-3 h-3 text-gray-500" />
        <p className="text-[10px] text-gray-500 uppercase tracking-wider">Eng yaxshi tanlov!</p>
      </div>
    </div>
  );
}

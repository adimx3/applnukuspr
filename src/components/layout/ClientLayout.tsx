"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useProductStore } from "@/store/useProductStore";
import { Menu, X, Home, ShoppingBag, ShoppingCart, Package } from "lucide-react";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, openAuthModal, validateSession } = useAuthStore();
  const { items } = useCartStore();
  const { fetchProducts } = useProductStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Run once on mount to check if the login is older than 30 days and fetch products
  useEffect(() => {
    validateSession();
    fetchProducts();
  }, []);

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, []);

  return (
    <>
      {/* Top bar – visible only when not authenticated */}
      {!isAuthenticated && (
        <div className="fixed top-0 right-0 p-4 flex gap-2 z-50 items-center">
          <button
            onClick={() => openAuthModal('login')}
            className="px-3 py-2 text-xs sm:text-sm font-bold uppercase bg-[#1a1a1a] hover:bg-[#222] text-white rounded"
          >
            KIRISH
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-3 py-2 text-xs sm:text-sm font-bold uppercase bg-[#ffa500] hover:bg-[#ffb933] text-black rounded hidden sm:block"
          >
            RO'YXATDAN O'TISH
          </button>
          <Link href="/cart" className="relative ml-1">
            <button className="px-3 py-2 bg-[#333] hover:bg-[#444] text-white rounded">
              🛒
            </button>
            {items.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Mobile top bar – visible only when authenticated */}
      {isAuthenticated && (
        <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#111] border-b border-[#222] flex items-center justify-between px-4 z-50">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="text-white font-serif font-bold tracking-widest text-lg">APPL NUKUS</span>
          <Link href="/cart" className="relative p-2">
            <span className="text-xl">🛒</span>
            {items.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-600 text-[10px] w-4 h-4 flex items-center justify-center rounded-full text-white font-bold">
                {items.reduce((sum, i) => sum + i.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      {isAuthenticated && isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-[60]">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsMobileSidebarOpen(false)} 
          />
          <div className="absolute left-0 top-0 h-full w-72 animate-slide-in">
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className="absolute top-5 right-4 z-10 p-2 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onNavigate={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      <div className="flex min-h-screen">
        {/* Show sidebar only after authentication – hidden on mobile */}
        {isAuthenticated && (
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        )}
        <main className={`flex-1 relative ${isAuthenticated ? "lg:ml-72 mt-16 lg:mt-0" : ""} overflow-y-auto pb-20`}>
          {children}
        </main>
        {/* Mobile Bottom Navigation */}
        {isAuthenticated && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#111] border-t border-[#222] flex justify-between items-center px-4 py-2 z-50">
            <Link href="/" className="flex flex-col items-center text-gray-400 hover:text-[#ffa500]">
              <Home className="w-5 h-5" />
              <span className="text-xs">Bosh</span>
            </Link>
            <Link href="/shop" className="flex flex-col items-center text-gray-400 hover:text-[#ffa500]">
              <ShoppingBag className="w-5 h-5" />
              <span className="text-xs">Shop</span>
            </Link>
            {orderIds.length > 0 && (
              <Link href="/my-orders" className="flex flex-col items-center text-gray-400 hover:text-[#ffa500]">
                <Package className="w-5 h-5" />
                <span className="text-xs">Buyurtmalar</span>
              </Link>
            )}
            <Link href="/cart" className="relative flex flex-col items-center text-gray-400 hover:text-[#ffa500]">
              <ShoppingCart className="w-5 h-5" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-2 bg-red-600 text-xs w-4 h-4 flex items-center justify-center rounded-full text-white font-bold">
                  {items.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
              <span className="text-xs">Savat</span>
            </Link>
          </div>
        )}
      </div>
      <AuthModal />
    </>
  );
}

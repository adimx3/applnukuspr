"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "@/components/auth/AuthModal";
import Link from "next/link";
import { useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useProductStore } from "@/store/useProductStore";
import { useMyOrdersStore } from "@/store/useMyOrdersStore";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, openAuthModal, validateSession } = useAuthStore();
  const { items } = useCartStore();
  const { fetchProducts } = useProductStore();
  const { orderIds } = useMyOrdersStore();

  // Run once on mount to check if the login is older than 30 days and fetch products
  useEffect(() => {
    validateSession();
    fetchProducts();
  }, []);

  return (
    <>
      {/* Top bar – visible only when not authenticated */}
      {!isAuthenticated && (
        <div className="fixed top-0 right-0 p-4 flex gap-2 z-50 items-center">
          <button
            onClick={() => openAuthModal('login')}
            className="px-4 py-2 text-sm font-bold uppercase bg-[#1a1a1a] hover:bg-[#222] text-white rounded"
          >
            KIRISH
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="px-4 py-2 text-sm font-bold uppercase bg-[#ffa500] hover:bg-[#ffb933] text-black rounded"
          >
            RO‘YXATDAN O‘TISH
          </button>
          {orderIds.length > 0 && (
            <Link href="/my-orders" className="relative">
              <button className="px-4 py-2 bg-[#1a1a1a] hover:bg-[#222] text-white rounded font-bold uppercase text-sm border border-[#333] transition-colors">
                Mening Buyurtmalarim
              </button>
            </Link>
          )}
          <Link href="/cart" className="relative ml-2">
            <button className="px-4 py-2 bg-[#333] hover:bg-[#444] text-white rounded">
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
      
      <div className="flex min-h-screen">
        {/* Show sidebar only after authentication */}
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 relative ${isAuthenticated ? "ml-72" : ""}`}>
          {children}
        </main>
      </div>
      <AuthModal />
    </>
  );
}

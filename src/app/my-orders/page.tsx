"use client";

import { useEffect, useState } from "react";
import { useMyOrdersStore } from "@/store/useMyOrdersStore";
import { useProductStore } from "@/store/useProductStore";
import { Package, Clock, CheckCircle2, XCircle, ArrowLeft, Loader2, Calendar } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function MyOrdersPage() {
  const { orderIds } = useMyOrdersStore();
  const { products, fetchProducts } = useProductStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Ensure we have products to show images
    if (products.length === 0) {
      fetchProducts();
    }
  }, [products.length, fetchProducts]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (orderIds.length === 0) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/orders/my', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids: orderIds }),
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (error) {
        console.error("Failed to fetch my orders", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyOrders();
  }, [orderIds]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-500 border-red-500/20';
      default: return 'bg-[#ffa500]/10 text-[#ffa500] border-[#ffa500]/20';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'completed': return 'Bajarildi';
      case 'cancelled': return 'Bekor qilindi';
      default: return 'Kutilmoqda';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('uz-UZ', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen p-8 lg:p-12 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#ffa500]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop" className="p-2 bg-[#161616] border border-[#333] hover:border-[#ffa500] hover:text-[#ffa500] rounded-xl text-gray-400 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wider">Mening buyurtmalarim</h1>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 min-h-[400px]">
            <Loader2 className="w-12 h-12 text-[#ffa500] animate-spin mb-4" />
            <p className="text-gray-400 text-sm tracking-widest uppercase">Ma'lumotlar yuklanmoqda...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#333] rounded-3xl bg-[#0f0f11]">
            <Package className="w-16 h-16 mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Buyurtmalar yo'q</h2>
            <p className="text-gray-500 mb-6 text-center max-w-sm">Siz hali hech qanday buyurtma bermagansiz. Katalogga o'tib xaridni boshlang!</p>
            <Link href="/shop" className="px-6 py-3 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all">
              Katalogga o'tish
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <AnimatePresence>
              {orders.map((order, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={order.id} 
                  className="bg-[#161616] border border-[#222] rounded-2xl p-6 relative group hover:border-[#ffa500]/50 transition-colors"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#333]">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-white font-mono font-bold text-lg">#{order.id.toString().padStart(4, '0')}</span>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {getStatusText(order.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                      <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Jami summa</span>
                      <span className="text-2xl font-mono font-bold text-[#ffa500]">{order.totalAmount} $</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Xarid qilingan mahsulotlar</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {order.items.map((item: any) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <div key={item.id} className="flex items-center gap-4 bg-[#0f0f11] border border-[#333] p-3 rounded-xl">
                            <div className="w-16 h-16 bg-[#1a1a1a] rounded-lg p-1 border border-[#222] shrink-0">
                              <img 
                                src={product?.image || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-card-40-macbook-pro-14-16-202310?wid=1200&hei=1000&fmt=p-jpg&qlt=95"} 
                                alt={product?.name || "Mahsulot"} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="text-white font-bold text-sm leading-tight mb-1">{product?.name || "O'chirilgan mahsulot"}</p>
                              <div className="flex items-center gap-2">
                                <span className="text-[#ffa500] font-mono text-xs">{item.price} $</span>
                                <span className="text-gray-500 text-xs font-bold">x{item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

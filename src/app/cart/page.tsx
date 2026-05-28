"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CheckoutModal } from "@/components/cart/CheckoutModal";

export default function CartPage() {
  const { items, removeFromCart, addToCart, decreaseQuantity, clearCart } = useCartStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Parse price logic
  const parsePrice = (priceStr: string) => Number(priceStr.replace(/[^0-9]/g, ""));
  
  const totalPrice = items.reduce((acc, item) => acc + (parsePrice(item.price) * item.quantity), 0);

  // Format to display like "1 250 $"
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price).replace(',', ' ') + ' $';
  };

  return (
    <div className="min-h-screen p-8 lg:p-12 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#ffa500]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/shop" className="p-2 bg-[#161616] border border-[#333] hover:border-[#ffa500] hover:text-[#ffa500] rounded-xl text-gray-400 transition-all">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white tracking-wider">Savatcha</h1>
        </div>

        {items.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#333] rounded-3xl bg-[#0f0f11]">
            <ShoppingBag className="w-16 h-16 mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-white mb-2">Savatcha bo&apos;sh</h2>
            <p className="text-gray-500 mb-6 text-center max-w-sm">Katalogdan o&apos;zingizga yoqqan mahsulotlarni tanlang va xarid qiling.</p>
            <Link href="/shop" className="px-6 py-3 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all">
              Katalogga o&apos;tish
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1 flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="bg-[#161616] border border-[#222] rounded-2xl p-4 flex gap-4 items-center relative group hover:border-[#ffa500]/50 transition-colors">
                  <div className="w-24 h-24 bg-[#0f0f11] rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-[#333]">
                    <img src={item.image} alt={item.name} className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-[10px] text-[#ffa500] uppercase tracking-widest font-bold mb-1">{item.category}</p>
                    <h3 className="text-white font-bold text-lg leading-tight mb-2">{item.name}</h3>
                    {item.description && (
                      <p className="text-xs text-gray-400 mb-3 line-clamp-2" title={item.description}>
                        {item.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className="text-gray-300 font-mono font-bold">{item.price}</span>
                      
                      <div className="flex items-center gap-3 bg-[#0f0f11] border border-[#333] rounded-lg px-2 py-1">
                        <button onClick={() => decreaseQuantity(item.id)} className="p-1 text-gray-500 hover:text-white transition-colors">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => addToCart(item)} className="p-1 text-gray-500 hover:text-white transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-3 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-xl transition-all h-fit self-start md:self-center"
                    title="O'chirish"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-80 h-fit bg-[#161616] border border-[#222] rounded-2xl p-6 sticky top-24">
              <h3 className="text-xl font-bold text-white mb-6 tracking-wide">Buyurtma xulosasi</h3>
              
              <div className="flex flex-col gap-4 mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Mahsulotlar soni:</span>
                  <span className="text-white font-bold">{items.reduce((a, b) => a + b.quantity, 0)} ta</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Yetkazib berish:</span>
                  <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest mt-1">Bepul</span>
                </div>
                <div className="h-px w-full bg-[#333]" />
                <div className="flex justify-between items-end">
                  <span className="text-gray-300 font-bold">Jami:</span>
                  <span className="text-2xl font-mono font-bold text-[#ffa500]">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <button 
                onClick={() => setIsCheckoutOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all"
              >
                Buyurtma Berish
              </button>
            </div>
          </div>
        )}
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)}
        totalAmount={formatPrice(totalPrice)}
        onConfirm={() => {
          clearCart();
          setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
}

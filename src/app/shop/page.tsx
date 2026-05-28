"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, ShoppingCart, Plus, Minus, Edit2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useProductStore, Product } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { AddProductModal } from "@/components/admin/AddProductModal";
import { EditProductModal } from "@/components/admin/EditProductModal";

export default function ShopPage() {
  const { products } = useProductStore();
  const { role } = useAuthStore();
  const { items, addToCart, decreaseQuantity } = useCartStore();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [activePriceRange, setActivePriceRange] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductForCart, setSelectedProductForCart] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState("");

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setToastMessage(`${product.name} savatga qo'shildi`);
    setTimeout(() => setToastMessage(""), 3000);
  };
  const itemsPerPage = 12;
  // Adjust page if items reduced


  const categories = ["Barchasi", "Smartphones", "Laptops", "Tablets", "Watches", "Accessories", "Monitors", "Boshqa"];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "Barchasi" || p.category === activeCategory;
    const priceNumber = Number(p.price.replace(/[^0-9]/g, ""));
    let matchesPrice = true;
    if (activePriceRange === "<500") matchesPrice = priceNumber < 500;
    else if (activePriceRange === "500-1000") matchesPrice = priceNumber >= 500 && priceNumber <= 1000;
    else if (activePriceRange === ">1000") matchesPrice = priceNumber > 1000;
    return matchesSearch && matchesCategory && matchesPrice;
  });

  

  // Ensure current page is valid after deletions
  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredProducts.length, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen p-8 lg:p-12 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-[#ffa500]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#ffa500]/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider mb-2">Katalog</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl">
            Nukus shahridagi eng zamonaviy Apple qurilmalari ro'yxati.
            Orzuingizdagi gadjetni tanlang va qulay xarid qiling.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64 min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 group-focus-within:text-[#ffa500] transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-[#ffa500] focus:border-[#ffa500] block pl-10 p-3 outline-none transition-all" 
              placeholder="Mahsulot qidirish..."
            />
          </div>
          <button className="p-3 bg-[#161616] border border-[#333] hover:border-[#ffa500] hover:text-[#ffa500] rounded-xl text-gray-400 transition-all flex items-center justify-center shadow-inner">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
          
          {/* Admin faqatgina ko'ra oladigan "Mahsulot qo'shish" tugmasi */}
          {role === 'admin' && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.6)] hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Qo'shish
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide relative z-10">
        {categories.map((cat, idx) => (
          <button 
            key={idx}
            onClick={() => { setActiveCategory(cat); setCurrentPage(1); }}
            className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              activeCategory === cat 
                ? "bg-[#ffa500] text-black shadow-[0_0_15px_rgba(255,165,0,0.3)]" 
                : "bg-[#161616] border border-[#333] text-gray-400 hover:text-white hover:border-[#555]"
            }`}
          >
            {cat}
          </button>
        ))}
        {/* Price range filter */}
        <select
          value={activePriceRange}
          onChange={e => { setActivePriceRange(e.target.value); setCurrentPage(1); }}
          className="ml-4 px-3 py-2 bg-[#161616] border border-[#333] text-gray-300 rounded-xl focus:ring-1 focus:ring-[#ffa500] outline-none"
        >
          <option value="All">Barcha narxlar</option>
          <option value="<500">500 $ dan past</option>
          <option value="500-1000">500 $ - 1000 $</option>
          <option value=">1000">1000 $ dan yuqori</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative z-10">
        {filteredProducts.length > 0 ? filteredProducts
          .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
          .map((product) => (
          <div 
            key={product.id}
            className="group bg-[#0f0f11] border border-[#222] hover:border-[#ffa500]/50 rounded-2xl p-5 transition-all duration-500 hover:shadow-[0_10px_40px_rgba(255,165,0,0.1)] hover:-translate-y-1 relative"
          >
            {product.badge && (
              <div className="absolute top-4 left-4 z-10 px-2.5 py-1 bg-[#ffa500]/10 text-[#ffa500] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[#ffa500]/20 backdrop-blur-md">
                {product.badge}
              </div>
            )}
            
            {/* Edit Button for Admin */}
            {role === 'admin' && (
              <button 
                onClick={() => setEditingProduct(product)}
                className="absolute top-4 right-14 z-10 w-8 h-8 bg-[#ffa500]/90 backdrop-blur-md rounded-full flex items-center justify-center text-black hover:bg-[#ffa500] hover:scale-110 transition-all shadow-[0_0_10px_rgba(255,165,0,0.4)] opacity-0 group-hover:opacity-100"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}



            <div className="relative w-full aspect-square bg-[#161616] rounded-xl mb-6 overflow-hidden flex items-center justify-center p-6">
              <div className="absolute inset-0 bg-gradient-to-tr from-[#ffa500]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.fallback) {
                    target.dataset.fallback = "true";
                    target.src = "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-card-40-macbook-pro-14-16-202310?wid=1200&hei=1000&fmt=p-jpg&qlt=95";
                  }
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">{product.category}</p>
              <h3 className="text-white font-bold text-lg leading-tight">{product.name}</h3>
              {product.description && (
                <p className="text-xs text-gray-400 mt-1 line-clamp-2" title={product.description}>
                  {product.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mt-3">
                <span className="text-[#ffa500] font-mono font-bold text-xl">{product.price}</span>
                <div className="flex items-center gap-1">
                  {product.colors.map((color, i) => (
                    <div 
                      key={i} 
                      className="w-3.5 h-3.5 rounded-full border border-[#333]"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              </div>

              {/* Savatga qo'shish / Soni */}
              <div className="mt-4 border-t border-[#333] pt-4">
                {(() => {
                  const cartItem = items.find(i => i.id === product.id);
                  if (cartItem) {
                    return (
                      <div className="flex items-center justify-between bg-[#161616] border border-[#ffa500]/50 rounded-xl px-4 py-2">
                        <button 
                          onClick={() => decreaseQuantity(product.id)} 
                          className="p-1.5 text-[#ffa500] hover:text-white hover:bg-[#333] rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white font-bold w-8 text-center">{cartItem.quantity} ta</span>
                        <button 
                          onClick={() => addToCart(product)} 
                          className="p-1.5 text-[#ffa500] hover:text-white hover:bg-[#333] rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  }
                  return (
                    <button 
                      onClick={() => setSelectedProductForCart(product)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#161616] hover:bg-[#ffa500]/10 text-gray-300 hover:text-[#ffa500] border border-[#333] hover:border-[#ffa500]/50 rounded-xl transition-all text-sm font-bold"
                    >
                      <ShoppingCart className="w-4 h-4" /> Savatga qo'shish
                    </button>
                  );
                })()}
              </div>

          </div>
        )) : (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-500 border border-dashed border-[#333] rounded-2xl">
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg">Kechirasiz, mahsulot topilmadi.</p>
          </div>
        )}
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditProductModal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        product={editingProduct} 
      />
      {/* Pagination Controls */}
      {filteredProducts.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-[#161616] border border-[#333] text-gray-400 rounded disabled:opacity-50 hover:text-white"
          >
            ◀
          </button>
          {Array.from({ length: Math.ceil(filteredProducts.length / itemsPerPage) }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${page === currentPage ? 'bg-[#ffa500] text-black' : 'bg-[#161616] border border-[#333] text-gray-400 hover:text-white'}`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, Math.ceil(filteredProducts.length / itemsPerPage)))}
            disabled={currentPage === Math.ceil(filteredProducts.length / itemsPerPage)}
            className="px-3 py-1 bg-[#161616] border border-[#333] text-gray-400 rounded disabled:opacity-50 hover:text-white"
          >
            ▶
          </button>
        </div>
      )}

      {/* Cart Confirmation Modal */}
      <AnimatePresence>
        {selectedProductForCart && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0f0f11] border border-[#222] p-6 rounded-2xl shadow-2xl max-w-sm w-full relative"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-[#161616] rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-[#333]">
                  <img src={selectedProductForCart.image} alt={selectedProductForCart.name} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight">{selectedProductForCart.name}</h3>
                  <p className="text-[#ffa500] font-mono font-bold mt-1">{selectedProductForCart.price}</p>
                </div>
              </div>
              
              <div className="mb-6 bg-[#161616] border border-[#333] rounded-xl p-3">
                <p className="text-xs text-gray-400 leading-relaxed">
                  {selectedProductForCart.description || "Ushbu mahsulot uchun hozircha tavsif kiritilmagan."}
                </p>
              </div>

              <h4 className="text-white text-center font-bold mb-4">Ushbu mahsulotni savatga qo'shasizmi?</h4>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setSelectedProductForCart(null)}
                  className="flex-1 py-2.5 bg-[#161616] hover:bg-[#222] text-white border border-[#333] rounded-xl transition-all font-bold text-sm"
                >
                  Yo'q
                </button>
                <button 
                  onClick={() => {
                    handleAddToCart(selectedProductForCart);
                    setSelectedProductForCart(null);
                  }}
                  className="flex-1 py-2.5 bg-[#ffa500] hover:bg-[#e69500] text-black rounded-xl transition-all font-bold text-sm shadow-[0_0_15px_rgba(255,165,0,0.3)]"
                >
                  Ha, qo'shish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className="fixed bottom-8 right-8 z-[200] bg-[#1a1a1a] border border-[#333] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <p className="font-bold text-sm tracking-wide">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

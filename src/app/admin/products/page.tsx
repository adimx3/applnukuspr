"use client";

import { useProductStore, Product } from "@/store/useProductStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, PackagePlus, Search } from "lucide-react";
import { AddProductModal } from "@/components/admin/AddProductModal";
import { EditProductModal } from "@/components/admin/EditProductModal";

export default function AdminProductsPage() {
  const { role, isAuthenticated } = useAuthStore();
  const { products, deleteProduct } = useProductStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | string | null>(null);

  const confirmDelete = async () => {
    if (productToDelete) {
      await deleteProduct(productToDelete);
      setProductToDelete(null);
    }
  };

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated || role !== 'admin') {
      router.push("/");
    }
  }, [isAuthenticated, role, router]);

  if (!isMounted || role !== 'admin') return null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 lg:p-12 pb-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 relative z-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider mb-2">Mahsulotlar</h1>
          <p className="text-gray-400 text-sm md:text-base">Katalogdagi barcha mahsulotlarni boshqarish</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative group flex-1 md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500 block pl-10 p-3 outline-none transition-all" 
              placeholder="Qidirish..."
            />
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)] transition-all"
          >
            <PackagePlus className="w-4 h-4" /> Qo'shish
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-[#222] rounded-2xl p-1 relative z-10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-gray-500 border-b border-[#333] bg-[#0a0a0a]">
                <th className="p-4 font-semibold uppercase tracking-wider rounded-tl-xl">Rasm</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Nom</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Kategoriya</th>
                <th className="p-4 font-semibold uppercase tracking-wider">Narx</th>
                <th className="p-4 font-semibold uppercase tracking-wider text-right rounded-tr-xl">Amal</th>
              </tr>
            </thead>
            <tbody className="text-gray-300">
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-[#222] last:border-0 hover:bg-[#1a1a1a] transition-colors group"
                  >
                    <td className="p-4">
                      <div className="w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center overflow-hidden border border-[#333]">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain p-1" />
                      </div>
                    </td>
                    <td className="p-4 font-bold text-white">{product.name}</td>
                    <td className="p-4 text-gray-400">{product.category}</td>
                    <td className="p-4 font-mono text-blue-400">{product.price}</td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setEditingProduct(product)}
                          className="w-10 h-10 flex items-center justify-center bg-[#222] hover:bg-[#333] rounded-xl text-gray-400 hover:text-white transition-all border border-transparent hover:border-[#444]"
                          title="Tahrirlash"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product.id)}
                          className="w-10 h-10 flex items-center justify-center bg-[#222] hover:bg-red-500/20 hover:text-red-500 rounded-xl text-gray-400 transition-all border border-transparent hover:border-red-500/30"
                          title="O'chirish"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Hech qanday mahsulot topilmadi.</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
      </div>

      <AddProductModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      <EditProductModal 
        isOpen={!!editingProduct} 
        onClose={() => setEditingProduct(null)} 
        product={editingProduct} 
      />

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0f0f11] border border-[#333] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">O&apos;chirishni tasdiqlaysizmi?</h3>
              <p className="text-sm text-gray-400 mb-6">
                Bu mahsulot butunlay o&apos;chiriladi va uni qayta tiklab bo&apos;lmaydi. Barcha mijozlardan ham o&apos;chadi.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-3 bg-[#1a1a1a] hover:bg-[#222] text-white rounded-xl border border-[#333] transition-colors"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors shadow-[0_0_15px_rgba(220,38,38,0.3)]"
                >
                  O&apos;chirish
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

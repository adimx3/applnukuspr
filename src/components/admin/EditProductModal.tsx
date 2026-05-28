"use client";

import { useState, useEffect, useRef } from "react";
import { X, Save, Trash2, Loader2, CheckCircle2, Upload, ImageIcon, XCircle } from "lucide-react";
import { useProductStore, Product } from "@/store/useProductStore";
import { motion, AnimatePresence } from "framer-motion";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

export function EditProductModal({ isOpen, onClose, product }: EditProductModalProps) {
  const { updateProduct, deleteProduct } = useProductStore();
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'deleting' | 'deleted'>('idle');

  useEffect(() => {
    if (product && isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price.replace(" $", ""));
      setImage(product.image);
      setImagePreview(product.image);
      setBadge(product.badge || "");
      setDescription(product.description || "");
      setStatus('idle');
      // Agar rasm data:image bilan boshlansa, fayl rejimida ko'rsatish
      setImageMode(product.image.startsWith('data:') ? 'file' : 'url');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImage(url);
    setImagePreview(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        updateProduct(product.id, {
          name,
          category,
          price: price + " $",
          image,
          badge: badge || undefined,
          description: description || undefined,
        });
        onClose();
      }, 1000);
    }, 1000);
  };

  const handleDelete = () => {
    // Darhol animatsiyali o'chirish (confirm oynasisiz)
    setStatus('deleting');
    setTimeout(() => {
      setStatus('deleted');
      setTimeout(() => {
        deleteProduct(product.id);
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f0f11] border border-[#222] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {(status === 'idle') && (
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                  <img src={imagePreview} alt="" className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide truncate pr-4">{product.name}</h2>
                  <p className="text-xs text-gray-500">Mahsulot ma&apos;lumotlarini tahrirlash</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Mahsulot nomi</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} required className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Kategoriya</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)} required className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none appearance-none">
                      <option value="Smartphones">Smartphones</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Tablets">Tablets</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Watches">Watches</option>
                      <option value="Monitors">Monitors</option>
                      <option value="Boshqa">Boshqa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Narxi ($)</label>
                    <input type="number" value={price} onChange={e=>setPrice(e.target.value)} required className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none" />
                  </div>
                </div>

                {/* Rasm bo'limi — Fayl yoki URL */}
                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">Mahsulot Rasmi</label>
                  
                  <div className="flex gap-2 mb-3">
                    <button 
                      type="button"
                      onClick={() => setImageMode('file')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${imageMode === 'file' ? 'bg-[#ffa500] text-black' : 'bg-[#1a1a1a] text-gray-400 border border-[#333]'}`}
                    >
                      <Upload className="w-3.5 h-3.5" /> Fayldan
                    </button>
                    <button 
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-bold rounded-lg transition-all ${imageMode === 'url' ? 'bg-[#ffa500] text-black' : 'bg-[#1a1a1a] text-gray-400 border border-[#333]'}`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" /> URL
                    </button>
                  </div>

                  {imageMode === 'file' ? (
                    <div>
                      <input 
                        ref={fileInputRef}
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden"
                      />
                      <button 
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full h-32 bg-[#161616] border-2 border-dashed border-[#333] hover:border-[#ffa500] rounded-xl flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer overflow-hidden"
                      >
                        {imagePreview ? (
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-contain p-2 rounded-xl" />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 text-gray-500 group-hover:text-[#ffa500] transition-colors" />
                            <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors">Rasm tanlash uchun bosing</span>
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    <div>
                      <input type="url" value={image} onChange={e=>handleUrlChange(e.target.value)} className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none" />
                      {imagePreview && (
                        <div className="mt-2 w-full h-24 bg-[#161616] border border-[#333] rounded-xl flex items-center justify-center overflow-hidden">
                          <img src={imagePreview} alt="Preview" className="h-full object-contain p-2" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Belgi (Badge) - ixtiyoriy</label>
                  <input type="text" value={badge} onChange={e=>setBadge(e.target.value)} placeholder="Yangi, Chegirma..." className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Qisqacha tavsif (ixtiyoriy)</label>
                  <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Mahsulot haqida ma'lumot..." rows={3} className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none resize-none" />
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button 
                    type="button" 
                    onClick={handleDelete}
                    className="p-3 bg-red-500/10 text-red-500 border border-red-500/30 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                    title="O'chirish"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button type="submit" className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all">
                    <Save className="w-4 h-4" /> Saqlash
                  </button>
                </div>
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
                  <h3 className="text-xl font-serif font-bold text-white tracking-widest">Saqlanmoqda...</h3>
                  <p className="text-sm text-gray-400 mt-2">Ma&apos;lumotlar yangilanmoqda</p>
                </motion.div>
              )}
              {status === 'deleting' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-red-500 animate-spin mb-6" />
                  <h3 className="text-xl font-serif font-bold text-white tracking-widest">O&apos;chirilmoqda...</h3>
                  <p className="text-sm text-red-400 mt-2">Mahsulot katalogdan olib tashlanmoqda</p>
                </motion.div>
              )}
              {status === 'deleted' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.6)] mb-6">
                    <XCircle className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-widest">O&apos;chirildi!</h3>
                  <p className="text-sm text-red-400 mt-3 font-bold uppercase tracking-[0.2em]">Mahsulot olib tashlandi</p>
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.6)] mb-6">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-widest">Saqlandi!</h3>
                  <p className="text-sm text-blue-400 mt-3 font-bold uppercase tracking-[0.2em]">Ma&apos;lumotlar yangilandi</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { X, PackagePlus, Loader2, CheckCircle2, Upload, ImageIcon } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { motion, AnimatePresence } from "framer-motion";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const { addProduct } = useProductStore();
  
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [badge, setBadge] = useState("");
  const [description, setDescription] = useState("");
  const [imageMode, setImageMode] = useState<'url' | 'file'>('file');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  if (!isOpen) return null;

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
        addProduct({
          name,
          category: category || "Boshqa",
          price: price + " $",
          image: image || "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mac-card-40-macbook-pro-14-16-202310?wid=1200&hei=1000&fmt=p-jpg&qlt=95&.v=1699584620023",
          colors: ["#222", "#ccc"],
          badge: badge || undefined,
          description: description || undefined,
        });
        
        setStatus('idle');
        setName("");
        setCategory("");
        setPrice("");
        setImage("");
        setImagePreview("");
        setBadge("");
        setDescription("");
        onClose();
      }, 1000);
      
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#0f0f11] border border-[#222] rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        
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
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-[#ffa500]/20 text-[#ffa500] rounded-xl flex items-center justify-center">
                  <PackagePlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-wide">Yangi Mahsulot</h2>
                  <p className="text-xs text-gray-500">Katalogga qo&apos;shish uchun ma&apos;lumotlarni kiriting</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Mahsulot nomi</label>
                  <input type="text" value={name} onChange={e=>setName(e.target.value)} required placeholder="MacBook Pro M3" className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Kategoriya</label>
                    <select value={category} onChange={e=>setCategory(e.target.value)} required className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none appearance-none">
                      <option value="">Tanlang...</option>
                      <option value="Smartphones">Smartphones</option>
                      <option value="Laptops">Laptops</option>
                      <option value="Tablets">Tablets</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Watches">Watches</option>
                      <option value="Monitors">Monitors</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-1.5">Narxi ($)</label>
                    <input type="number" value={price} onChange={e=>setPrice(e.target.value)} required placeholder="1250" className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none" />
                  </div>
                </div>

                {/* Image Section with Tabs */}
                <div>
                  <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">Mahsulot Rasmi</label>
                  
                  {/* Toggle buttons */}
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
                        className="w-full h-32 bg-[#161616] border-2 border-dashed border-[#333] hover:border-[#ffa500] rounded-xl flex flex-col items-center justify-center gap-2 transition-all group cursor-pointer"
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
                      <input type="url" value={imageMode === 'url' ? image : ''} onChange={e=>handleUrlChange(e.target.value)} placeholder="https://..." className="w-full bg-[#161616] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3 outline-none" />
                      {imagePreview && imageMode === 'url' && (
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
                
                <button type="submit" className="mt-4 w-full py-3.5 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all">
                  Qo&apos;shish
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
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                  <Loader2 className="w-16 h-16 text-[#ffa500] animate-spin mb-6" />
                  <h3 className="text-xl font-serif font-bold text-white tracking-widest">Qo&apos;shilmoqda...</h3>
                  <p className="text-sm text-gray-400 mt-2">Katalog yangilanmoqda</p>
                </motion.div>
              )}
              {status === 'success' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="flex flex-col items-center">
                  <div className="w-24 h-24 bg-[#ffa500] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,165,0,0.6)] mb-6">
                    <CheckCircle2 className="w-12 h-12 text-black" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-white tracking-widest">Tayyor!</h3>
                  <p className="text-sm text-[#ffa500] mt-3 font-bold uppercase tracking-[0.2em]">Mahsulot saqlandi</p>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

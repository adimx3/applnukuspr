import { Send, Phone, Mail, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffa500]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider mb-2">Aloqa</h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl">
          Savollaringiz yoki takliflaringiz bormi? Biz bilan bog'laning!
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 relative z-10">
        {/* Contact Info */}
        <div className="flex-1 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#161616] border border-[#333] rounded-xl flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#ffa500]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Telefon raqamlar</h4>
              <p className="text-gray-400">+998 90 123 45 67</p>
              <p className="text-gray-400">+998 93 987 65 43</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#161616] border border-[#333] rounded-xl flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-[#ffa500]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Email manzili</h4>
              <p className="text-gray-400">info@applnukus.uz</p>
              <p className="text-gray-400">support@applnukus.uz</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#161616] border border-[#333] rounded-xl flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#ffa500]" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg mb-1">Manzil</h4>
              <p className="text-gray-400 max-w-[250px]">Nukus shahri, Qoraqalpog'iston ko'chasi 1-uy. Mo'ljal: Markaziy bozor.</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="flex-[1.5] bg-[#161616] border border-[#222] rounded-3xl p-8 shadow-2xl">
          <h3 className="text-2xl font-bold text-white mb-6">Xabar yuborish</h3>
          <form className="flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">Ismingiz</label>
                <input type="text" placeholder="Aziz Rahmonov" className="w-full bg-[#0f0f11] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3.5 outline-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">Telefon</label>
                <input type="tel" placeholder="+998 90 123 45 67" className="w-full bg-[#0f0f11] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3.5 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-[#777] uppercase tracking-widest mb-2">Xabar</label>
              <textarea rows={4} placeholder="Savolingizni bu yerga yozing..." className="w-full bg-[#0f0f11] border border-[#333] text-white text-sm rounded-xl focus:ring-[#ffa500] p-3.5 outline-none resize-none"></textarea>
            </div>
            <button type="button" className="mt-2 flex items-center justify-center gap-2 w-full py-4 bg-[#ffa500] text-black font-bold text-sm rounded-xl shadow-[0_0_15px_rgba(255,165,0,0.3)] hover:shadow-[0_0_25px_rgba(255,165,0,0.5)] transition-all">
              Yuborish <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

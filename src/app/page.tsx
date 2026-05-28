import { AppleLogo } from "@/components/ui/AppleLogo";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-8">
      
      {/* Glowing background effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffa500]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#ffa500]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Crest / Logo glowing area */}
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-[#ffa500]/20 blur-3xl rounded-full scale-[1.5] animate-pulse" />
        <div className="relative w-56 h-56 border border-[#ffa500]/30 rounded-full flex items-center justify-center bg-[#111] shadow-[0_0_60px_rgba(255,165,0,0.2)]">
          <div className="w-48 h-48 border border-[#ffa500]/20 rounded-full flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#050505]">
             <AppleLogo className="w-24 h-24 text-[#ffa500] drop-shadow-[0_0_20px_rgba(255,165,0,0.7)]" />
          </div>
        </div>
      </div>

      {/* Main Typography matching the barbershop style */}
      <div className="text-center z-10 max-w-4xl">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 font-serif tracking-tight text-white drop-shadow-lg leading-tight">
          Sizning orzuingizdagi <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#fbbf24] via-[#ffa500] to-[#f59e0b] drop-shadow-[0_0_30px_rgba(255,165,0,0.5)]">
            Haqiqiy Apple
          </span> qurilmalari
        </h1>
        <p className="text-xl text-gray-400 mt-8 max-w-2xl mx-auto font-light leading-relaxed">
          Nukus shahridagi eng ishonchli, zamonaviy va premium sifatdagi texnikalar do'koni. Yangi va ideal modellarni bizdan xarid qiling.
        </p>

        <div className="mt-14 flex items-center justify-center gap-6">
          <button className="px-10 py-4 bg-[#ffa500] text-black text-lg font-bold rounded-xl shadow-[0_0_25px_rgba(255,165,0,0.3)] hover:shadow-[0_0_40px_rgba(255,165,0,0.6)] hover:scale-105 transition-all duration-300">
            Katalogga o'tish
          </button>
          <button className="px-10 py-4 bg-transparent border border-[#ffa500]/50 text-white text-lg font-medium rounded-xl hover:bg-[#ffa500]/10 transition-all duration-300">
            Biz bilan bog'lanish
          </button>
        </div>
      </div>
    </div>
  );
}

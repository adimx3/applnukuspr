import { ShieldCheck, Zap, Award } from "lucide-react";
import { AppleLogo } from "@/components/ui/AppleLogo";

export default function AboutPage() {
  return (
    <div className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ffa500]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 text-center mb-16">
        <div className="w-20 h-20 bg-[#ffa500] rounded-2xl flex items-center justify-center text-black mx-auto mb-6 shadow-[0_0_30px_rgba(255,165,0,0.4)]">
          <AppleLogo className="w-10 h-10 mb-1" />
        </div>
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider mb-6">Biz Haqimizda</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Nukus shahridagi &quot;Appl Nukus&quot; premium do&apos;koni 2026-yildan buyon aholiga eng so&apos;nggi 
          Apple texnologiyalarini yetkazib bermoqda. Bizning maqsadimiz — xaridorlarga yuqori 
          sifat, qulaylik va xavfsizlikni kafolatlash.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10">
        {[
          {
            icon: ShieldCheck,
            title: "100% Asl Mahsulotlar",
            desc: "Bizdagi barcha qurilmalar rasmiy kafolatga ega va to'liq original."
          },
          {
            icon: Zap,
            title: "Tezkor Yetkazib Berish",
            desc: "Qoraqalpog'iston bo'ylab eng tezkor va xavfsiz yetkazib berish xizmati."
          },
          {
            icon: Award,
            title: "Premium Xizmat",
            desc: "Mijozlarimiz uchun maxsus chegirmalar, bepul maslahat va yordam."
          }
        ].map((feature, i) => (
          <div key={i} className="bg-[#161616] border border-[#222] rounded-2xl p-8 text-center hover:-translate-y-2 transition-transform duration-300">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#333]">
              <feature.icon className="w-8 h-8 text-[#ffa500]" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
            <p className="text-gray-500 text-sm">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

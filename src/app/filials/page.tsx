import { MapPin, Phone, Clock } from "lucide-react";

export default function FilialsPage() {
  const filials = [
    {
      name: "Asosiy Do'kon - Nukus",
      address: "Nukus shahri, Qoraqalpog'iston ko'chasi 1-uy",
      phone: "+998 90 123 45 67",
      workingHours: "09:00 - 21:00 (Har kuni)",
      mapPlaceholder: "bg-[#ffa500]/10",
    },
    {
      name: "Xo'jayli Filiali",
      address: "Xo'jayli tumani, Markaziy bozor yonida",
      phone: "+998 90 987 65 43",
      workingHours: "09:00 - 20:00 (Yakshanba dam olish)",
      mapPlaceholder: "bg-blue-500/10",
    },
    {
      name: "To'rtko'l Filiali",
      address: "To'rtko'l tumani, Mustaqillik ko'chasi 15-uy",
      phone: "+998 93 111 22 33",
      workingHours: "09:00 - 19:00 (Har kuni)",
      mapPlaceholder: "bg-green-500/10",
    }
  ];

  return (
    <div className="min-h-screen p-8 lg:p-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ffa500]/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="mb-12 relative z-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white tracking-wider mb-2">Filiallarimiz</h1>
        <p className="text-gray-400 text-sm md:text-base max-w-xl">
          Qoraqalpog&apos;iston bo&apos;ylab joylashgan barcha do&apos;konlarimiz ro&apos;yxati va ishlash vaqtlari.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
        {filials.map((filial, i) => (
          <div key={i} className="bg-[#161616] border border-[#222] rounded-2xl p-6 group hover:border-[#ffa500]/50 transition-colors">
            <div className={`w-full h-48 rounded-xl mb-6 flex items-center justify-center border border-[#333] ${filial.mapPlaceholder}`}>
              <MapPin className="w-10 h-10 text-gray-500 group-hover:text-[#ffa500] transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">{filial.name}</h3>
            
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ffa500] shrink-0" />
                <p>{filial.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#ffa500] shrink-0" />
                <p>{filial.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#ffa500] shrink-0" />
                <p>{filial.workingHours}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

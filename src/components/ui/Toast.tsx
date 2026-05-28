"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-[#111] border border-[#ffa500] text-[#ffa500] px-4 py-2 rounded-lg shadow-lg flex items-center">
      <span className="text-sm font-medium mr-3">{message}</span>
      <button onClick={() => { setVisible(false); onClose(); }} className="p-1 hover:bg-[#222] rounded-full transition-colors">
        <X className="w-4 h-4 text-[#ffa500]" />
      </button>
    </div>
  );
}

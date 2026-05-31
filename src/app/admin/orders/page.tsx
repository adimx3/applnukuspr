"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Loader2, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: string;
}

interface Order {
  id: number;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  paymentMethod: string;
  totalAmount: string;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

export default function AdminOrdersPage() {
  const { role, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    if (!isAuthenticated || role !== 'admin') {
      router.push("/");
    } else {
      fetchOrders();
    }
  }, [isAuthenticated, role, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const deleteOrder = async (id: number) => {
    if (!confirm("Haqiqatan ham bu buyurtmani o'chirmoqchimisiz?")) return;
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1 text-green-500 bg-green-500/10 px-2 py-1 rounded-md text-xs font-bold"><CheckCircle className="w-3 h-3" /> Bajarildi</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded-md text-xs font-bold"><XCircle className="w-3 h-3" /> Bekor qilindi</span>;
      default:
        return <span className="flex items-center gap-1 text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded-md text-xs font-bold"><Clock className="w-3 h-3" /> Kutilmoqda</span>;
    }
  };

  if (!isMounted || role !== 'admin') return null;

  return (
    <div className="min-h-screen p-8 lg:p-12 pl-80">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-white tracking-wider">Buyurtmalar</h1>
            <p className="text-gray-400 mt-2 text-sm">Barcha tushgan buyurtmalarni boshqarish</p>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 text-[#ffa500] animate-spin" />
          </div>
        ) : (
          <div className="bg-[#161616] border border-[#222] rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#111] border-b border-[#222]">
                <tr>
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">ID / Sana</th>
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Mijoz</th>
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">To'lov / Summa</th>
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-[10px]">Holat</th>
                  <th className="p-4 font-bold text-gray-400 uppercase tracking-wider text-[10px] text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-[#222] last:border-0 hover:bg-[#1a1a1a] transition-colors group">
                    <td className="p-4">
                      <div className="font-mono text-[#ffa500] font-bold">#{order.id}</div>
                      <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleString('ru-RU')}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-white">{order.customerName}</div>
                      <div className="text-xs text-gray-400">{order.customerPhone}</div>
                      <div className="text-xs text-gray-500 max-w-[200px] break-all" >{order.customerAddress}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-mono font-bold text-blue-400">{order.totalAmount}</div>
                      <div className="text-xs text-gray-500 uppercase">{order.paymentMethod === 'card' ? 'Karta' : 'Naxt'}</div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => updateStatus(order.id, 'completed')}
                              className="w-8 h-8 flex items-center justify-center bg-green-500/10 hover:bg-green-500/20 text-green-500 rounded-lg transition-colors"
                              title="Bajarildi"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => updateStatus(order.id, 'cancelled')}
                              className="w-8 h-8 flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"
                              title="Bekor qilish"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="w-8 h-8 flex items-center justify-center bg-[#222] hover:bg-red-500/20 hover:text-red-500 rounded-lg text-gray-400 transition-colors ml-2"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">Hech qanday buyurtma topilmadi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

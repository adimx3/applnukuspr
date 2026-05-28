import { create } from 'zustand';

export interface Product {
  id: number | string;
  name: string;
  category: string;
  price: string;
  image: string;
  colors: string[];
  badge?: string;
  description?: string;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number | string, updatedProduct: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number | string) => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  
  fetchProducts: async () => {
    set({ isLoading: true });
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set({ products: data, isLoading: false });
    } catch (error) {
      console.error(error);
      set({ isLoading: false });
    }
  },
  
  addProduct: async (product) => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set((state) => ({ products: [data, ...state.products] }));
    } catch (error) {
      console.error(error);
    }
  },
  
  updateProduct: async (id, updatedProduct) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      set((state) => ({
        products: state.products.map(p => p.id === id ? data : p)
      }));
    } catch (error) {
      console.error(error);
    }
  },
  
  deleteProduct: async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      set((state) => ({
        products: state.products.filter(p => p.id !== id)
      }));
    } catch (error) {
      console.error(error);
    }
  },
}));

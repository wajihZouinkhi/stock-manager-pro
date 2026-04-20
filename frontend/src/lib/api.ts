const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface Category { id: number; name: string; description?: string; color: string; icon?: string; _count?: { products: number }; }
export interface Product { id: number; name: string; sku: string; description?: string; price: number; costPrice: number; quantity: number; minQuantity: number; unit: string; isActive: boolean; categoryId?: number; category?: Category; createdAt: string; updatedAt: string; }
export interface StockMovement { id: number; type: 'IN' | 'OUT' | 'ADJUSTMENT'; quantity: number; reason?: string; productId: number; product?: Product; createdAt: string; }
export interface DashboardStats { totalProducts: number; lowStockCount: number; outOfStockCount: number; totalValue: number; totalCategories: number; recentMovements: StockMovement[]; lowStockProducts: Product[]; weeklyMovements: Array<{ date: string; in: number; out: number }>; }

export const productsApi = {
  getAll: (params?: { search?: string; status?: string; categoryId?: number }) => {
    const qs = new URLSearchParams();
    if (params?.search) qs.set('search', params.search);
    if (params?.status) qs.set('status', params.status);
    if (params?.categoryId) qs.set('categoryId', params.categoryId.toString());
    return apiRequest<Product[]>(`/products?${qs.toString()}`);
  },
  getOne: (id: number) => apiRequest<Product>(`/products/${id}`),
  create: (data: Partial<Product>) => apiRequest<Product>('/products', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Product>) => apiRequest<Product>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/products/${id}`, { method: 'DELETE' }),
  updateStock: (id: number, data: { type: string; quantity: number; reason?: string }) => apiRequest(`/products/${id}/stock`, { method: 'PATCH', body: JSON.stringify(data) }),
  getMovements: (id: number) => apiRequest<StockMovement[]>(`/products/${id}/movements`),
};

export const categoriesApi = {
  getAll: () => apiRequest<Category[]>('/categories'),
  getOne: (id: number) => apiRequest<Category>(`/categories/${id}`),
  create: (data: Partial<Category>) => apiRequest<Category>('/categories', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: number, data: Partial<Category>) => apiRequest<Category>(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: number) => apiRequest(`/categories/${id}`, { method: 'DELETE' }),
};

export const dashboardApi = { getStats: () => apiRequest<DashboardStats>('/dashboard/stats') };

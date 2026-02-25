const API_BASE = '/api';

// Generic fetch wrapper
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'An error occurred' }));
    throw new Error(error.error || 'An error occurred');
  }

  return response.json();
}

// Stock API
export const stockApi = {
  getAll: () => fetchAPI<any[]>('/stock'),
  create: (data: any) => fetchAPI<{ id: string }>('/stock', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/stock?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  }),
  delete: (id: string) => fetchAPI<any>(`/stock?id=${id}`, {
    method: 'DELETE',
  }),
};

// Agent API
export const agentApi = {
  getAll: () => fetchAPI<any[]>('/agents'),
  create: (data: any) => fetchAPI<{ id: string }>('/agents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: string, data: any) => fetchAPI<any>(`/agents?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  }),
  delete: (id: string) => fetchAPI<any>(`/agents?id=${id}`, {
    method: 'DELETE',
  }),
};

// Purchase API
export const purchaseApi = {
  getAll: () => fetchAPI<any[]>('/purchases'),
  create: (data: any) => fetchAPI<{ id: string }>('/purchases', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};

// Sale API
export const saleApi = {
  getAll: () => fetchAPI<any[]>('/sales'),
  create: (data: any) => fetchAPI<{ id: string }>('/sales', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getLatestPurchaseRate: async (stockId: string): Promise<number> => {
    const purchases = await fetchAPI<any[]>('/purchases');
    const stockPurchases = purchases.filter(p => p.stockId === stockId);
    if (stockPurchases.length === 0) return 0;
    // Sort by date descending and get the first one
    const sorted = stockPurchases.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0].rate || 0;
  },
};

// Analysis API
export const analysisApi = {
  getSalesAnalysis: () => fetchAPI<any>('/analysis'),
};

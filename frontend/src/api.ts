import { Product, Category, AISummary, AnalyticsData } from './types';

const API_BASE = 'http://127.0.0.1:8000/api/v1';

export async function fetchProducts(params: {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params.skip !== undefined) query.append('skip', params.skip.toString());
    if (params.limit !== undefined) query.append('limit', params.limit.toString());
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.min_price !== undefined) query.append('min_price', params.min_price.toString());
    if (params.max_price !== undefined) query.append('max_price', params.max_price.toString());
    if (params.sort) query.append('sort', params.sort);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return await res.json();
  } catch (err) {
    console.warn('API connection failed, returning fallback mock data:', err);
    return { products: [], total: 0 };
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchHybridRecommendations(viewedIds: number[], limit = 8): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/recommendations/hybrid`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_viewed_ids: viewedIds, limit })
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchSimilarProducts(productId: number, limit = 6): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/similar?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function fetchAISummary(productId: number): Promise<AISummary | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/ai-summary`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function sendAIChat(message: string, context: { cart?: any[]; browsing_history?: any[]; wishlist?: any[] }) {
  try {
    const res = await fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, ...context })
    });
    if (!res.ok) throw new Error('Chat failed');
    const data = await res.json();
    return data.reply;
  } catch {
    return "I'm having trouble connecting to the AI brain right now. But I recommend checking out our top deals!";
  }
}

export async function fetchAnalytics(): Promise<AnalyticsData | null> {
  try {
    const res = await fetch(`${API_BASE}/analytics/dashboard`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

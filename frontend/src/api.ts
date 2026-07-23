import { Product, Category, AISummary, AnalyticsData } from './types';
import { staticProducts, staticCategories } from './staticData';

// Use VITE_API_URL environment variable, defaulting to local backend for development
let envUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';
if (envUrl && !envUrl.startsWith('http')) {
  envUrl = `https://${envUrl}/api/v1`;
}
const API_BASE = envUrl;

// ─── Static Data Helpers ────────────────────────────────────────────────────
function filterAndSortStatic(params: {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort?: string;
}) {
  let filtered = [...staticProducts];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      (p.brand || '').toLowerCase().includes(q) ||
      (p.category?.name || '').toLowerCase().includes(q)
    );
  }

  if (params.category && params.category !== 'all') {
    filtered = filtered.filter(p =>
      p.category?.slug === params.category || p.category?.name?.toLowerCase() === params.category?.toLowerCase()
    );
  }

  if (params.min_price !== undefined) {
    filtered = filtered.filter(p => p.price >= params.min_price!);
  }
  if (params.max_price !== undefined) {
    filtered = filtered.filter(p => p.price <= params.max_price!);
  }

  if (params.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (params.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  else if (params.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (params.sort === 'discount') filtered.sort((a, b) => b.discountPercentage - a.discountPercentage);

  const total = filtered.length;
  const skip = params.skip || 0;
  const limit = params.limit || 20;
  return { products: filtered.slice(skip, skip + limit), total };
}

// ─── API Functions ──────────────────────────────────────────────────────────

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
    console.warn('API unavailable, using static product data:', err);
    return filterAndSortStatic(params);
  }
}

export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return staticProducts.find(p => p.id === id) || null;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) return staticCategories;
    return await res.json();
  } catch {
    return staticCategories;
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
    // Fallback: return top rated static products
    return [...staticProducts].sort((a, b) => b.rating - a.rating).slice(0, limit);
  }
}

export async function fetchSimilarProducts(productId: number, limit = 6): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/similar?limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    // Fallback: return products in same category
    const product = staticProducts.find(p => p.id === productId);
    return staticProducts
      .filter(p => p.id !== productId && p.categoryId === product?.categoryId)
      .slice(0, limit);
  }
}

export async function fetchAISummary(productId: number): Promise<AISummary | null> {
  try {
    const res = await fetch(`${API_BASE}/products/${productId}/ai-summary`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    const p = staticProducts.find(prod => prod.id === productId);
    return {
      summary: `${p?.title || 'This product'} has received highly positive feedback from customers for its quality and value.`,
      sentiment: 'Positive',
      key_highlights: ['Great build quality', 'Excellent value for money', 'Fast delivery and good packaging']
    };
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
    return `Great question about "${message}"! Based on our catalog, I recommend checking out our top-rated products with up to 55% off today. Would you like me to help you find something specific?`;
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

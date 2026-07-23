export interface ProductImage {
  id: number;
  url: string;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerEmail: string;
  date: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand?: string;
  sku?: string;
  weight?: number;
  thumbnail: string;
  category?: Category;
  images?: ProductImage[];
  reviews?: Review[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type Role = 'customer' | 'seller' | 'admin';

export interface AISummary {
  summary: string;
  sentiment: 'Positive' | 'Neutral' | 'Negative';
  key_highlights: string[];
}

export interface AnalyticsData {
  metrics: {
    total_products: number;
    total_categories: number;
    total_reviews: number;
    avg_rating: number;
    recommendation_ctr: string;
    ai_conversion_rate: string;
    revenue: number;
  };
  category_distribution: { category: string; count: number }[];
  sales_trend: { month: string; sales: number; recommendations_revenue: number }[];
}

import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { CartDrawer } from './components/CartDrawer';
import { SellerDashboard } from './components/SellerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { Product, Category, CartItem, Role } from './types';
import { fetchProducts, fetchCategories, fetchHybridRecommendations } from './api';
import { Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export function App() {
  const [role, setRole] = useState<Role>('customer');
  const [darkMode, setDarkMode] = useState(true);
  
  // Data state
  const [products, setProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<string>('');

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [browsingHistory, setBrowsingHistory] = useState<Product[]>([]);

  // Modals & Drawers state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toggle Dark mode class on html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Fetch initial data
  useEffect(() => {
    loadData();
  }, [selectedCategory, searchQuery, sortOption]);

  const loadData = async () => {
    setLoading(true);
    const [prodData, catData] = await Promise.all([
      fetchProducts({
        search: searchQuery || undefined,
        category: selectedCategory || undefined,
        sort: sortOption || undefined,
        limit: 200
      }),
      fetchCategories()
    ]);

    setProducts(prodData.products || []);
    setCategories(catData || []);
    setLoading(false);
  };

  // Fetch AI Hybrid recommendations based on browsing history
  useEffect(() => {
    const viewedIds = browsingHistory.map(p => p.id);
    fetchHybridRecommendations(viewedIds, 8).then(setRecommendedProducts);
  }, [browsingHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleQuickView = (product: Product) => {
    setSelectedProduct(product);
    // Add to browsing history
    if (!browsingHistory.find(p => p.id === product.id)) {
      setBrowsingHistory(prev => [product, ...prev].slice(0, 10));
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`Added "${product.title}" to cart!`);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        showToast(`Removed "${product.title}" from wishlist.`);
        return prev.filter(p => p.id !== product.id);
      }
      showToast(`Added "${product.title}" to wishlist!`);
      return [...prev, product];
    });
  };

  const handleUpdateQuantity = (productId: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => item.product.id === productId ? { ...item, quantity: qty } : item));
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    setCart([]);
    setIsCartOpen(false);
    showToast("🎉 Order placed successfully! Thank you for shopping.");
  };

  const handleAddSellerProduct = (newProd: Partial<Product>) => {
    const created: Product = {
      id: Date.now(),
      title: newProd.title || 'Custom Item',
      description: newProd.description || '',
      price: newProd.price || 99,
      discountPercentage: 10,
      rating: 4.8,
      stock: newProd.stock || 50,
      thumbnail: newProd.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    };
    setProducts(prev => [created, ...prev]);
    showToast("Product added to seller catalog!");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* Navbar */}
      <Navbar
        role={role}
        setRole={setRole}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchSubmit={loadData}
      />

      {/* Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Customer View */}
        {role === 'customer' && (
          <div>
            {/* Hero Section */}
            <HeroBanner
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            {/* AI Hybrid "Recommended For You" Section */}
            {recommendedProducts.length > 0 && !searchQuery && !selectedCategory && (
              <section className="mb-12">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-heading text-xl font-extrabold text-slate-900 dark:text-white">
                        Recommended For You
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Neural Collaborative Filtering & FAISS Vector Matches
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {recommendedProducts.slice(0, 4).map((product) => (
                    <ProductCard
                      key={`rec-${product.id}`}
                      product={product}
                      onQuickView={handleQuickView}
                      onAddToCart={handleAddToCart}
                      isWishlisted={!!wishlist.find(w => w.id === product.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* All Products Header & Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h2 className="font-heading text-xl font-bold text-slate-900 dark:text-white">
                  {selectedCategory ? `Category: ${selectedCategory}` : 'All Products Catalog'}
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Showing {products.length} products
                </span>
              </div>

              {/* Sort Filter Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none"
                >
                  <option value="">Featured Sort</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="discount">Biggest Discount</option>
                </select>
              </div>
            </div>

            {/* Products Grid / Skeleton Loading */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                  <div key={n} className="aspect-[3/4] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse"></div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center text-slate-400 space-y-3">
                <p className="text-base font-medium">No products match your search query.</p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedCategory(null); }}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                    onAddToCart={handleAddToCart}
                    isWishlisted={!!wishlist.find(w => w.id === product.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Seller View */}
        {role === 'seller' && (
          <SellerDashboard
            products={products}
            onAddProduct={handleAddSellerProduct}
          />
        )}

        {/* Admin View */}
        {role === 'admin' && (
          <AdminDashboard />
        )}

      </main>

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={!!selectedProduct && !!wishlist.find(w => w.id === selectedProduct.id)}
        onSelectProduct={handleQuickView}
      />

      {/* AI Assistant Drawer */}
      <AIAssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        cart={cart}
        wishlist={wishlist}
        browsingHistory={browsingHistory}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl border border-slate-800 animate-in fade-in slide-in-from-bottom duration-300">
          {toastMessage}
        </div>
      )}

    </div>
  );
}

export default App;

import React, { useEffect, useState } from 'react';
import { X, Star, ShoppingCart, Heart, Sparkles, CheckCircle2, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { Product, AISummary } from '../types';
import { fetchAISummary, fetchSimilarProducts } from '../api';
import { formatINR } from '../utils';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (p: Product) => void;
  onToggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  onSelectProduct: (p: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onSelectProduct,
}) => {
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);
  const [activeImage, setActiveImage] = useState<string>('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.thumbnail);
      setLoadingAI(true);
      
      Promise.all([
        fetchAISummary(product.id),
        fetchSimilarProducts(product.id)
      ]).then(([summary, similar]) => {
        setAiSummary(summary);
        setSimilarProducts(similar);
        setLoadingAI(false);
      });
    }
  }, [product]);

  if (!product) return null;

  const originalPrice = product.price / (1 - (product.discountPercentage / 100));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white dark:bg-darkbg-card border border-slate-200 dark:border-darkbg-border rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[95vh] animate-in slide-in-from-bottom">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-100 dark:bg-darkbg text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-4 sm:p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Image Gallery (Amazon Style) */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row gap-4">
              {/* Thumbnails */}
              {product.images && product.images.length > 0 && (
                <div className="order-2 sm:order-1 flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:max-h-[500px]">
                  <button
                    onMouseEnter={() => setActiveImage(product.thumbnail)}
                    onClick={() => setActiveImage(product.thumbnail)}
                    className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                      activeImage === product.thumbnail ? 'border-primary' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-primary/50'
                    }`}
                  >
                    <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                  </button>
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      onMouseEnter={() => setActiveImage(img.url)}
                      onClick={() => setActiveImage(img.url)}
                      className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImage === img.url ? 'border-primary' : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100 hover:border-primary/50'
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image */}
              <div className="order-1 sm:order-2 flex-1 relative aspect-square rounded-xl overflow-hidden bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 group cursor-zoom-in">
                <img src={activeImage} alt={product.title} className="w-full h-full object-contain p-4 mix-blend-multiply dark:mix-blend-normal" />
                {product.discountPercentage > 15 && (
                  <div className="absolute top-4 left-4 w-12 h-12 bg-primary rounded-full flex flex-col items-center justify-center text-white shadow-lg transform -rotate-12">
                    <span className="text-[10px] font-bold leading-none">{Math.round(product.discountPercentage)}%</span>
                    <span className="text-[9px] font-bold uppercase leading-none">Off</span>
                  </div>
                )}
              </div>
            </div>

            {/* Middle & Right: Product Info & Buy Box */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Product Info */}
              <div className="md:col-span-7 flex flex-col space-y-4">
                <div>
                  <a href="#" className="text-sm font-semibold text-primary hover:underline hover:text-primary-hover transition-colors">
                    Visit the {product.brand || product.category?.name || 'AuraStore'} Store
                  </a>
                  <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mt-1 leading-tight">
                    {product.title}
                  </h1>
                </div>

                {/* Ratings */}
                <div className="flex items-center gap-4 text-sm pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-1">
                    <div className="flex text-gold">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`w-4 h-4 ${star <= Math.round(product.rating) ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                      ))}
                    </div>
                    <span className="text-primary hover:underline cursor-pointer ml-1 font-medium">{product.rating} ratings</span>
                  </div>
                  <span className="text-slate-400">|</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> In Stock
                  </span>
                </div>

                {/* Pricing (Amazon style) */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">- {Math.round(product.discountPercentage)}%</span>
                    <span className="font-heading text-4xl font-semibold text-slate-900 dark:text-white flex items-start">
                      <span className="text-sm mt-1.5 mr-0.5">₹</span>{formatINR(product.price).replace('₹', '')}
                    </span>
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    M.R.P.: <span className="line-through">{formatINR(originalPrice)}</span>
                  </div>
                  <div className="text-sm font-medium">
                    Inclusive of all taxes
                  </div>
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-300 space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                  <p className="font-bold">About this item:</p>
                  <ul className="list-disc pl-5 space-y-1.5 marker:text-slate-400">
                    {product.description.split('. ').map((point, idx) => point && (
                      <li key={idx} className="leading-relaxed">{point.trim()}{point.endsWith('.') ? '' : '.'}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Buy Box (Amazon style) */}
              <div className="md:col-span-5">
                <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-5 bg-slate-50/50 dark:bg-[#130A0D] shadow-sm flex flex-col space-y-4 sticky top-4">
                  <div className="font-heading text-2xl font-bold text-slate-900 dark:text-white">
                    {formatINR(product.price)}
                  </div>
                  
                  <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold">
                    In Stock
                  </div>
                  
                  <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-slate-400" /> Free delivery <span className="font-bold text-slate-800 dark:text-slate-200">Tomorrow</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-slate-400" /> Secure transaction
                    </div>
                    <div className="flex items-center gap-2">
                      <RotateCcw className="w-4 h-4 text-slate-400" /> 10 days Replacement
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col gap-3">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full py-3 rounded-full bg-gold hover:bg-gold-light active:bg-gold-dark text-slate-900 font-bold shadow-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => { onAddToCart(product); onClose(); }}
                      className="w-full py-3 rounded-full bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-bold shadow-sm transition-colors"
                    >
                      Buy Now
                    </button>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button
                      onClick={() => onToggleWishlist(product)}
                      className="text-sm font-medium flex items-center gap-1.5 text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-primary transition-colors"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-primary text-primary' : ''}`} />
                      {isWishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Section: AI Review & Similar Products */}
          <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* AI Review Intelligence Section */}
            <div className="lg:col-span-1 p-5 rounded-xl bg-gradient-to-br from-slate-50 to-amber-50 dark:from-[#1A0D10] dark:to-[#180C0F] border border-amber-500/20 shadow-inner">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <h3 className="font-heading text-base font-bold text-slate-900 dark:text-white">AI Review Consensus</h3>
              </div>

              {loadingAI ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2"></div>
                </div>
              ) : aiSummary ? (
                <div className="space-y-4 text-sm">
                  <span className={`inline-block px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                    aiSummary.sentiment === 'Positive' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-500/20' :
                    aiSummary.sentiment === 'Neutral' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-500/20' :
                    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-500/20'
                  }`}>
                    {aiSummary.sentiment} Sentiment
                  </span>

                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                    {aiSummary.summary}
                  </p>

                  {aiSummary.key_highlights && aiSummary.key_highlights.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Highlights</p>
                      {aiSummary.key_highlights.map((highlight, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600 dark:text-slate-300 text-xs">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No review insights available.</p>
              )}
            </div>

            {/* Similar Products */}
            <div className="lg:col-span-2">
              <h3 className="font-heading font-bold text-lg text-slate-900 dark:text-white mb-4">
                Customers who viewed this item also viewed
              </h3>
              
              {similarProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {similarProducts.slice(0, 4).map((sim) => (
                    <div
                      key={sim.id}
                      onClick={() => onSelectProduct(sim)}
                      className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-darkbg hover:border-gold/50 transition-all cursor-pointer group flex flex-col"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-slate-50 dark:bg-white/5 relative">
                        <img src={sim.thumbnail} alt={sim.title} className="w-full h-full object-contain p-2 mix-blend-multiply dark:mix-blend-normal group-hover:scale-105 transition-transform" />
                      </div>
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="w-3 h-3 fill-gold text-gold" />
                        <span className="text-[10px] text-primary">{sim.rating}</span>
                      </div>
                      <h4 className="font-medium text-xs text-slate-700 dark:text-slate-300 line-clamp-2 group-hover:text-primary mb-2 flex-grow">{sim.title}</h4>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{formatINR(sim.price)}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} className="flex-1 aspect-[3/4] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '../types';
import { formatINR } from '../utils';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onQuickView,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const originalPrice = product.discountPercentage > 0 
    ? formatINR(product.price / (1 - product.discountPercentage / 100))
    : null;
  const displayPrice = formatINR(product.price);

  return (
    <div className="group relative bg-white dark:bg-[#180C0F] border border-slate-200/80 dark:border-amber-500/20 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-500/60 transition-all duration-300 flex flex-col justify-between">
      
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-[#1F0F12]">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Discount Badge */}
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            -{Math.round(product.discountPercentage)}% OFF
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
            isWishlisted 
              ? 'bg-red-600 text-white shadow-md' 
              : 'bg-white/70 dark:bg-[#180C0F]/70 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-white'
          }`}
        >
          <Heart className="w-4 h-4 fill-current" />
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 backdrop-blur-[2px] transition-opacity flex items-center justify-center gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:brightness-110 transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick AI View
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="capitalize font-semibold text-amber-500">{product.category?.name || 'General'}</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>

          <h3 
            onClick={() => onQuickView(product)}
            className="font-heading font-bold text-slate-900 dark:text-white text-sm line-clamp-1 hover:text-amber-400 cursor-pointer transition-colors mb-2"
          >
            {product.title}
          </h3>

          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 font-normal leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Price & Cart Trigger */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-amber-500/10">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-heading font-black text-lg text-slate-900 dark:text-white">
                {displayPrice}
              </span>
              {originalPrice && (
                <span className="text-xs text-slate-400 line-through">
                  {originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            className="p-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-700 hover:to-amber-600 active:scale-95 text-white transition-all shadow-md shadow-red-600/20"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

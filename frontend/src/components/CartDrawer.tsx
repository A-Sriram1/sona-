import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { CartItem } from '../types';
import { formatINR, USD_TO_INR } from '../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: number, qty: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const totalDiscount = cart.reduce(
    (acc, item) => acc + (item.product.price * (item.product.discountPercentage / 100)) * item.quantity,
    0
  );
  const finalTotal = subtotal - totalDiscount;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">
              Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 text-slate-400">
              <ShoppingBag className="w-16 h-16 stroke-1 text-slate-300 dark:text-slate-700" />
              <p className="text-sm font-medium">Your shopping cart is empty.</p>
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition-colors"
              >
                Explore Products
              </button>
            </div>
          ) : (
            cart.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex items-center gap-4 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40"
              >
                <img
                  src={product.thumbnail}
                  alt={product.title}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100 dark:bg-slate-800"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="font-heading font-semibold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                    {product.title}
                  </h4>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-bold mt-0.5">
                    {formatINR(product.price)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900">
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity - 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                        className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI Coupon / Summary Section */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
            
            {/* AI Coupon Pill */}
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Tag className="w-4 h-4" />
                <span>AI Auto Coupon: <strong>AURAAI10 (-10%)</strong> Applied</span>
              </div>
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900 dark:text-white">{formatINR(subtotal)}</span>
              </div>
              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Product Savings</span>
                  <span>-{formatINR(totalDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-800 font-heading text-sm font-extrabold text-slate-900 dark:text-white">
                <span>Estimated Total</span>
                <span className="text-blue-600 dark:text-blue-400">{formatINR(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={onCheckout}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              Proceed to Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

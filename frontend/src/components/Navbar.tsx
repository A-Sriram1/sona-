import React, { useState } from 'react';
import { ShoppingBag, Heart, Search, Bot, Moon, Sun, Mic, Sparkles } from 'lucide-react';
import { Role } from '../types';

interface NavbarProps {
  role: Role;
  setRole: (role: Role) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSearchSubmit: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  setRole,
  darkMode,
  setDarkMode,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenAssistant,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
}) => {
  const [isListening, setIsListening] = useState(false);

  const handleVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        setIsListening(false);
        onSearchSubmit();
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } else {
      alert('Voice search is not supported in your browser.');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-amber-500/20 dark:border-amber-500/20 bg-white/90 dark:bg-[#0F0709]/90 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 p-[2px] shadow-lg shadow-red-600/20">
            <div className="w-full h-full bg-white dark:bg-[#180C0F] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-heading font-black text-xl tracking-tight bg-gradient-to-r from-red-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">
              AuraStore
            </span>
            <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase block -mt-1">
              AI Recommendation
            </span>
          </div>
        </div>

        {/* Search Bar with Voice Input */}
        {role === 'customer' && (
          <div className="flex-1 max-w-md lg:max-w-xl relative">
            <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI or search products, brands, categories..."
                className="w-full pl-10 pr-20 py-2 rounded-full border border-slate-200 dark:border-amber-500/30 bg-slate-100/80 dark:bg-[#180C0F] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-3 p-1 rounded-full transition-all ${
                  isListening ? 'bg-red-600 text-white animate-pulse' : 'text-slate-400 hover:text-amber-400'
                }`}
                title="Voice Search"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          
          {/* Role Switcher */}
          <div className="hidden lg:flex items-center p-1 rounded-xl bg-slate-100 dark:bg-[#180C0F] border border-slate-200 dark:border-amber-500/20 text-xs font-medium">
            <button
              onClick={() => setRole('customer')}
              className={`px-3 py-1 rounded-lg transition-all ${
                role === 'customer' ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Customer
            </button>
            <button
              onClick={() => setRole('seller')}
              className={`px-3 py-1 rounded-lg transition-all ${
                role === 'seller' ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Seller
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1 rounded-lg transition-all ${
                role === 'admin' ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>

          {/* AI Assistant Floating Trigger */}
          {role === 'customer' && (
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 border border-amber-400/30 hover:scale-105 transition-all whitespace-nowrap flex-shrink-0"
            >
              <Bot className="w-4 h-4 animate-bounce text-amber-300" />
              <span className="inline">AI Shopping Agent</span>
            </button>
          )}

          {/* Wishlist */}
          {role === 'customer' && (
            <button className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-[#1F0F12] hover:text-red-500 transition-colors">
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>
          )}

          {/* Cart */}
          {role === 'customer' && (
            <button
              onClick={onOpenCart}
              className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-[#1F0F12] hover:text-red-500 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1F0F12] transition-colors"
            title="Toggle Dark/Light Mode"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>

        </div>
      </div>
    </header>
  );
};

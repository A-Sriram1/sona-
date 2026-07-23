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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 p-[2px] shadow-lg shadow-red-600/20">
            <div className="w-full h-full bg-white dark:bg-[#180C0F] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="font-heading font-black text-lg sm:text-xl tracking-tight bg-gradient-to-r from-red-500 via-amber-400 to-amber-300 bg-clip-text text-transparent">
              AuraStore
            </span>
            <span className="text-[8px] sm:text-[10px] font-bold tracking-wider text-amber-400 uppercase block -mt-1">
              AI Recommendation
            </span>
          </div>
        </div>

        {/* Desktop Search Bar */}
        {role === 'customer' && (
          <div className="hidden md:flex flex-1 max-w-xl relative mx-4">
            <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }} className="relative flex items-center w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask AI or search products..."
                className="w-full pl-10 pr-12 py-2 rounded-full border border-slate-200 dark:border-amber-500/30 bg-slate-100/80 dark:bg-[#180C0F] text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all dark:text-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <button
                type="button"
                onClick={handleVoiceSearch}
                className={`absolute right-3 p-1 rounded-full transition-all ${
                  isListening ? 'bg-red-600 text-white animate-pulse' : 'text-slate-400 hover:text-amber-400'
                }`}
              >
                <Mic className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* Action Controls & Dark Mode */}
        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          
          {/* AI Assistant Floating Trigger - Hidden on tiny screens, icon only on small screens */}
          {role === 'customer' && (
            <button
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-red-600 via-red-500 to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-600/30 border border-amber-400/30 hover:scale-105 transition-all whitespace-nowrap"
            >
              <Bot className="w-4 h-4 animate-bounce text-amber-300" />
              <span className="hidden sm:inline">AI Shopping</span>
            </button>
          )}

          {/* Wishlist */}
          {role === 'customer' && (
            <button className="relative p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-[#1F0F12] hover:text-red-500 transition-colors">
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
              className="relative p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-[#1F0F12] hover:text-red-500 transition-colors"
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
            className="p-1.5 sm:p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1F0F12] transition-colors"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Search and Role Switcher Row */}
      <div className="md:hidden border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-black/20 px-4 py-2 flex flex-col gap-2">
        {role === 'customer' && (
          <form onSubmit={(e) => { e.preventDefault(); onSearchSubmit(); }} className="relative flex items-center w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-10 py-1.5 rounded-full border border-slate-200 dark:border-amber-500/20 bg-white dark:bg-[#180C0F] text-xs focus:outline-none focus:ring-1 focus:ring-red-500/50 dark:text-white"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3" />
            <button type="button" onClick={handleVoiceSearch} className="absolute right-2 p-1">
              <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400'}`} />
            </button>
          </form>
        )}
        
        {/* Mobile Role Switcher */}
        <div className="flex justify-center items-center gap-1 p-0.5 rounded-lg bg-slate-200/50 dark:bg-white/5 text-[10px] font-medium overflow-x-auto no-scrollbar">
          {(['customer', 'seller', 'admin'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`px-3 py-1 rounded-md transition-all capitalize flex-1 ${
                role === r ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold shadow-sm' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { X, Send, Bot, User, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { sendAIChat } from '../api';
import { CartItem, Product } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  wishlist: Product[];
  browsingHistory: Product[];
}

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  wishlist,
  browsingHistory,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: "Hello! I'm your AI Shopping Agent. I have full context of your cart, wishlist, and browsing history. How can I assist you today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    const context = {
      cart: cart.map(i => ({ title: i.product.title, price: i.product.price })),
      wishlist: wishlist.map(w => ({ title: w.title, price: w.price })),
      browsing_history: browsingHistory.map(b => ({ title: b.title }))
    };

    const replyText = await sendAIChat(query, context);
    setMessages((prev) => [...prev, { sender: 'ai', text: replyText }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-200 dark:border-slate-800 animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                AI Shopping Agent
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <span className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Intent Prediction
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Context Summary Pill */}
        <div className="px-4 py-2 bg-blue-50/60 dark:bg-blue-950/30 border-b border-blue-100 dark:border-blue-900/50 text-[11px] text-blue-700 dark:text-blue-300 flex items-center justify-between">
          <span>Cart: <strong>{cart.length} items</strong></span>
          <span>Wishlist: <strong>{wishlist.length} items</strong></span>
          <span>Viewed: <strong>{browsingHistory.length} items</strong></span>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 text-xs sm:text-sm ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              
              <div
                className={`max-w-[80%] p-3.5 rounded-2xl leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="w-4 h-4 text-blue-500 animate-spin" />
              <span>Agent is processing context and thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800/80 flex gap-2 overflow-x-auto text-[11px]">
          <button
            onClick={() => handleSend("Suggest products based on my browsing history")}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
          >
            💡 Tailored Suggestions
          </button>
          <button
            onClick={() => handleSend("Are there any special discount offers for items in my cart?")}
            className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
          >
            🔥 Cart Offers
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI agent anything..."
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:text-white"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-md shadow-blue-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

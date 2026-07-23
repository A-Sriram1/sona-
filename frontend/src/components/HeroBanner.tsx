import React from 'react';
import { Sparkles, Zap, Award, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Category } from '../types';

interface HeroBannerProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (cat: string | null) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <div className="space-y-12 mb-12">
      {/* Hero Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A090C] via-[#2D0D12] to-[#0F0709] border border-amber-500/30 text-white p-8 sm:p-12 shadow-2xl shadow-red-950/40">
        
        {/* Golden Red Radial Glow background */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-96 h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-400 text-xs font-semibold shadow-inner">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Next-Gen Golden Red AI Discovery Platform</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Unlock Your Ultimate <br />
              <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-red-500 bg-clip-text text-transparent drop-shadow-sm">
                AI Shopping Matrix.
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
              Experience ultra-personalized product discovery powered by Neural Collaborative Filtering, OpenAI GPT-4o-Mini, and FAISS Vector similarity.
            </p>

            {/* Stat Counters from UI mockup */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-red-900/40 max-w-md">
              <div>
                <div className="font-heading text-2xl sm:text-3xl font-black text-amber-400">5K+</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">AI Recommendations</div>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-3xl font-black text-red-500">98%</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Match Precision</div>
              </div>
              <div>
                <div className="font-heading text-2xl sm:text-3xl font-black text-amber-400">52+</div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Brand Partners</div>
              </div>
            </div>
          </div>

          {/* Right Isometric Product Illustration (From generated image) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full aspect-video sm:aspect-square rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-red-600/30 group">
              <img
                src="/golden_red_hero.jpg"
                alt="AI Platform Matrix"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F0709] via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-[#1A090C]/80 backdrop-blur-md border border-amber-500/30 text-xs flex items-center justify-between">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" /> Real-time Vector Index
                </span>
                <span className="px-2 py-0.5 rounded-full bg-red-600/80 text-white font-bold text-[10px]">
                  FAISS Active
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Benefits Grid (from UI mockup design) */}
      <div className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">Why Choose AuraStore?</span>
          <h2 className="font-heading text-2xl font-black text-slate-900 dark:text-white">Benefits of AI Personalized Discovery</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#180C0F] border border-slate-200 dark:border-amber-500/20 shadow-sm hover:border-amber-500/60 transition-all space-y-2">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Instant Intent Match</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">98% accuracy in predicting your preferred styles and products.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#180C0F] border border-slate-200 dark:border-amber-500/20 shadow-sm hover:border-amber-500/60 transition-all space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
              </div>
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Dynamic Auto Coupons</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">AI automatically applies targeted offers at checkout.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#180C0F] border border-slate-200 dark:border-amber-500/20 shadow-sm hover:border-amber-500/60 transition-all space-y-2">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Verified AI Summaries</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Instant sentiment consensus synthesized from hundreds of reviews.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#180C0F] border border-slate-200 dark:border-amber-500/20 shadow-sm hover:border-amber-500/60 transition-all space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-sm text-slate-900 dark:text-white">Agentic Shopping Assistant</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Conversational AI aware of your active cart & browsing history.</p>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        <button
          onClick={() => onSelectCategory(null)}
          className={`px-5 py-2 rounded-full text-xs font-semibold transition-all ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-slate-200 dark:bg-[#1F0F12] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-amber-500/20 hover:border-amber-500'
          }`}
        >
          All Categories
        </button>
        {categories.slice(0, 10).map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.name)}
            className={`px-5 py-2 rounded-full text-xs font-semibold capitalize transition-all ${
              selectedCategory === cat.name
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30'
                : 'bg-slate-200 dark:bg-[#1F0F12] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-amber-500/20 hover:border-amber-500'
            }`}
          >
            {cat.name.replace('-', ' ')}
          </button>
        ))}
      </div>

    </div>
  );
};

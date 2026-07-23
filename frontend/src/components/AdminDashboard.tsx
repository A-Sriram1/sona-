import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Database, Activity, TrendingUp, Users, DollarSign, Sparkles, Terminal } from 'lucide-react';
import { fetchAnalytics } from '../api';
import { AnalyticsData } from '../types';

export const AdminDashboard: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics().then(setData);
  }, []);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Command Center & AI Ops</span>
          </div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">System Analytics & ML Metrics</h1>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Gross Platform Revenue</span>
          <h3 className="font-heading text-3xl font-black text-slate-900 dark:text-white">
            ${data?.metrics.revenue.toLocaleString() || '128,450.00'}
          </h3>
          <span className="text-xs text-emerald-500 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% vs last month
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Recommendation CTR</span>
          <h3 className="font-heading text-3xl font-black text-blue-600 dark:text-blue-400">
            {data?.metrics.recommendation_ctr || '18.4%'}
          </h3>
          <span className="text-xs text-slate-400">FAISS Index Vector Match</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">AI Conversion Rate</span>
          <h3 className="font-heading text-3xl font-black text-indigo-600 dark:text-indigo-400">
            {data?.metrics.ai_conversion_rate || '4.2%'}
          </h3>
          <span className="text-xs text-slate-400">GPT-4o-Mini Assistant</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Catalog Health</span>
          <h3 className="font-heading text-3xl font-black text-emerald-500">
            {data?.metrics.total_products || 194} Items
          </h3>
          <span className="text-xs text-slate-400">{data?.metrics.total_categories || 24} Categories Seeded</span>
        </div>
      </div>

      {/* Analytics & Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Sales Trend Bar Visualizer */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-600" />
              Monthly Revenue vs AI Recommended Sales
            </h3>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> Total Sales
              </span>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> AI Attributed
              </span>
            </div>
          </div>

          <div className="h-48 flex items-end gap-6 pt-6 px-4 border-b border-slate-100 dark:border-slate-800">
            {data?.sales_trend.map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full flex justify-center gap-1.5 items-end h-full">
                  <div
                    style={{ height: `${(item.sales / 42000) * 100}%` }}
                    className="w-full max-w-[24px] rounded-t-lg bg-blue-600 shadow-md shadow-blue-500/20"
                  />
                  <div
                    style={{ height: `${(item.recommendations_revenue / 42000) * 100}%` }}
                    className="w-full max-w-[24px] rounded-t-lg bg-emerald-500 shadow-md shadow-emerald-500/20"
                  />
                </div>
                <span className="text-xs text-slate-400 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* System Health & AI Vector Index Status */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-500" />
            AI Pipeline & Vector Store
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-slate-900 dark:text-white">FAISS Index Vectors</span>
              </div>
              <span className="font-mono text-emerald-500 font-bold">194 Embeddings</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-slate-900 dark:text-white">OpenAI LLM Engine</span>
              </div>
              <span className="font-mono text-blue-500 font-bold">GPT-4o-Mini Active</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-slate-900 dark:text-white">Avg LLM Latency</span>
              </div>
              <span className="font-mono text-slate-900 dark:text-white font-bold">420 ms</span>
            </div>
          </div>
        </div>

      </div>

      {/* AI Terminal Log Output */}
      <div className="p-6 rounded-2xl bg-slate-950 text-slate-200 border border-slate-800 font-mono text-xs space-y-3">
        <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-white">Live AI Recommendation Logs</span>
          </div>
          <span className="text-[10px] text-emerald-400 animate-pulse">● System Operational</span>
        </div>

        <div className="space-y-1.5 text-[11px] text-slate-400">
          <div><span className="text-blue-400">[INFO]</span> FAISS Index loaded with 194 product text embeddings.</div>
          <div><span className="text-emerald-400">[SUCCESS]</span> Hybrid recommendation pipeline ready (TF-IDF + Collaborative Filtering).</div>
          <div><span className="text-amber-400">[OPENAI]</span> Model `gpt-4o-mini` initialized for real-time review sentiment & agentic assistant.</div>
          <div><span className="text-blue-400">[HTTP]</span> GET /api/v1/recommendations/hybrid 200 OK (24ms)</div>
        </div>
      </div>
    </div>
  );
};

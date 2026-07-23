import React, { useState } from 'react';
import { Package, Plus, IndianRupee, TrendingUp, AlertTriangle, Search, Trash2, Edit3 } from 'lucide-react';
import { Product } from '../types';
import { formatINR, USD_TO_INR } from '../utils';

interface SellerDashboardProps {
  products: Product[];
  onAddProduct: (newProd: Partial<Product>) => void;
}

export const SellerDashboard: React.FC<SellerDashboardProps> = ({ products, onAddProduct }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newCategory, setNewCategory] = useState('beauty');
  const [newStock, setNewStock] = useState('50');
  const [newDescription, setNewDescription] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      title: newTitle,
      price: parseFloat(newPrice) || 0,
      stock: parseInt(newStock) || 0,
      description: newDescription,
      thumbnail: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    });
    setShowAddModal(false);
    setNewTitle('');
    setNewPrice('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">Seller Portal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your product catalog, monitor inventory health, and track revenue.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-orange-500/20 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          Add New Product
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Inventory</span>
            <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white">{products.length} Products</h3>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Estimated Revenue</span>
            <h3 className="font-heading text-2xl font-black text-slate-900 dark:text-white">₹35,61,530</h3>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Low Stock Warnings</span>
            <h3 className="font-heading text-2xl font-black text-amber-500">3 Items</h3>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-slate-900 dark:text-white">Product Catalog Management</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 border-b border-slate-200 dark:border-slate-800 font-semibold uppercase text-[11px] tracking-wider">
                <th className="p-4">Product</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Rating</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {products.slice(0, 10).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.thumbnail} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800" />
                    <div>
                      <div className="font-semibold text-slate-900 dark:text-white line-clamp-1">{p.title}</div>
                      <div className="text-[11px] text-slate-400">SKU-{p.id}</div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 capitalize">{p.category?.name || 'General'}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{formatINR(p.price)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.stock > 10 ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600'
                    }`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-amber-500">★ {p.rating}</td>
                  <td className="p-4 text-right space-x-2">
                    <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="font-heading font-extrabold text-xl text-slate-900 dark:text-white">Add Product to Inventory</h3>
            <form onSubmit={handleCreate} className="space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-500 mb-1">Product Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 mb-1">Price (₹ in thousands, e.g. 1299 = ₹1,299)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-500 mb-1">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white h-20"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/20"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../api/endpoints';

const CATEGORIES = ['planner', 'diary', 'notebook', 'poster'];

export function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', description: '', category: 'planner', price: 0, inStock: true });
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    getProducts().then((data) => {
      setProducts(data.products || []);
    }).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateProduct(editing._id, form);
      } else {
        await createProduct(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ name: '', description: '', category: 'planner', price: 0, inStock: true });
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (product: any) => {
    setForm({ name: product.name, description: product.description, category: product.category, price: product.price, inStock: product.inStock });
    setEditing(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Products</h1>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', description: '', category: 'planner', price: 0, inStock: true }); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" rows={3} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none">
                    {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price (₹)</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 outline-none" min={0} required />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="inStock" checked={form.inStock}
                  onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                  className="rounded border-slate-300" />
                <label htmlFor="inStock" className="text-sm text-slate-700">In Stock</label>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="px-6 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditing(null); }}
                  className="px-6 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading...</div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No products yet. Add your first product.</p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4 p-6">
            {products.map((product: any) => (
              <div key={product._id} className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition">
                <div className="w-full h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg mb-3 flex items-center justify-center">
                  <Package className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-medium text-sm text-slate-900">{product.name}</h3>
                <p className="text-xs text-slate-500 mt-1 capitalize">{product.category}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-bold text-indigo-600">₹{product.price}</span>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(product)} className="p-1.5 rounded hover:bg-slate-100">
                      <Edit2 className="w-4 h-4 text-slate-400" />
                    </button>
                    <button onClick={() => handleDelete(product._id)} className="p-1.5 rounded hover:bg-red-50">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import { getOrders } from '../api/endpoints';

const STATUS_FILTERS = ['all', 'placed', 'processing', 'printed', 'shipped', 'delivered'];

export function Orders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getOrders(statusFilter, page).then((data) => {
      setOrders(data.orders || []);
      setTotalPages(data.pagination?.pages || 1);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [statusFilter, page]);

  const filtered = search
    ? orders.filter((o) => o.orderId?.toLowerCase().includes(search.toLowerCase()))
    : orders;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search order ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition capitalize ${
              statusFilter === s
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">No orders found</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Items</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order: any) => (
                <tr key={order._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-medium text-slate-900">{order.orderId}</td>
                  <td className="p-4 text-sm text-slate-600">{(order.userId as any)?.name || 'N/A'}</td>
                  <td className="p-4 text-sm text-slate-600">{order.items?.length || 0}</td>
                  <td className="p-4 text-sm font-medium">₹{order.total?.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' :
                      order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`status-badge status-${order.orderStatus}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="p-4">
                    <Link
                      to={`/orders/${order._id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 rounded border border-slate-200 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1 rounded border border-slate-200 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

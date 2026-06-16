import { useEffect, useState } from 'react';
import { ShoppingBag, Users, DollarSign, FileText } from 'lucide-react';
import { getOrders } from '../api/endpoints';

const STATS = [
  { label: 'Total Orders', icon: ShoppingBag, color: 'bg-indigo-500', value: '0' },
  { label: 'Revenue', icon: DollarSign, color: 'bg-green-500', value: '₹0' },
  { label: 'Active Users', icon: Users, color: 'bg-blue-500', value: '0' },
  { label: 'Pages Printed', icon: FileText, color: 'bg-purple-500', value: '0' },
];

export function Dashboard() {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    getOrders('all', 1).then((data) => {
      setRecentOrders(data.orders?.slice(0, 5) || []);
      STATS[0].value = data.pagination?.total?.toString() || '0';
    }).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-6 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">Recent Orders</h2>
        </div>
        <div className="p-6">
          {recentOrders.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No orders yet. Connect to backend to see data.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-slate-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Items</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order._id} className="border-t border-slate-50">
                    <td className="py-3 text-sm font-medium text-slate-900">{order.orderId}</td>
                    <td className="py-3 text-sm text-slate-600">{(order.userId as any)?.name || 'N/A'}</td>
                    <td className="py-3 text-sm text-slate-600">{order.items?.length || 0}</td>
                    <td className="py-3 text-sm font-medium">₹{order.total?.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`status-badge status-${order.orderStatus}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

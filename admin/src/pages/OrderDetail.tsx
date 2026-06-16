import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import { getOrderById, updateOrderStatus } from '../api/endpoints';

const STATUS_FLOW = ['placed', 'processing', 'printed', 'shipped', 'delivered'];

export function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (!id) return;
    getOrderById(id).then((data) => {
      setOrder(data.order);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!id) return;
    setUpdating(true);
    try {
      await updateOrderStatus(id, newStatus);
      setOrder((prev: any) => ({ ...prev, orderStatus: newStatus }));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-slate-400">Loading...</div>;
  if (!order) return <div className="p-12 text-center text-slate-400">Order not found</div>;

  const currentIndex = STATUS_FLOW.indexOf(order.orderStatus);

  return (
    <div>
      <button
        onClick={() => navigate('/orders')}
        className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-medium">Back to Orders</span>
      </button>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{order.orderId}</h1>
          <p className="text-slate-500 mt-1">
            Placed on {order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}
          </p>
        </div>
        <span className={`status-badge status-${order.orderStatus} text-sm px-4 py-1.5`}>
          {order.orderStatus}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Timeline */}
        <div className="col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-6">Order Progress</h2>
            <div className="space-y-0">
              {STATUS_FLOW.map((status, index) => {
                const isCompleted = index <= currentIndex;
                const isCurrent = index === currentIndex;
                return (
                  <div key={status} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCompleted ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'
                      } ${isCurrent ? 'ring-4 ring-indigo-200' : ''}`}>
                        {index + 1}
                      </div>
                      {index < STATUS_FLOW.length - 1 && (
                        <div className={`w-0.5 h-12 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className={`pb-8 ${isCompleted ? 'text-slate-900' : 'text-slate-400'}`}>
                      <p className="font-medium capitalize">{status}</p>
                      <p className="text-sm mt-0.5">
                        {status === 'placed' && 'Order has been placed'}
                        {status === 'processing' && 'Order is being processed'}
                        {status === 'printed' && 'Documents have been printed'}
                        {status === 'shipped' && 'Package is out for delivery'}
                        {status === 'delivered' && 'Order has been delivered'}
                      </p>
                      {isCurrent && !isCompleted && order.orderStatus !== 'delivered' && (
                        <button
                          onClick={() => handleStatusChange(STATUS_FLOW[index + 1])}
                          disabled={updating}
                          className="mt-2 px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition disabled:opacity-50"
                        >
                          {updating ? 'Updating...' : `Mark as ${STATUS_FLOW[index + 1]}`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            <div className="space-y-3">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="font-medium text-sm text-slate-900">{item.fileName}</p>
                      <p className="text-xs text-slate-500">
                        {item.printType === 'double' ? 'Double-sided' : 'Single-sided'} • {item.colorMode === 'color' ? 'Color' : 'B&W'} • {item.copies} copy{item.copies > 1 ? 'ies' : 'y'} • {item.binding !== 'none' ? item.binding : 'No binding'}
                      </p>
                    </div>
                  </div>
                  <span className="font-medium text-sm">₹{item.subtotal?.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Subtotal</span>
                <span>₹{order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Delivery</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-100">
                <span>Total</span>
                <span>₹{order.total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Delivery Details</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{order.deliveryAddress?.fullName}</p>
                  <p className="text-sm text-slate-500">{order.deliveryAddress?.phone}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {order.deliveryAddress?.address}, {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <CreditCard className="w-5 h-5 text-slate-400" />
                <span className="text-sm capitalize">{order.deliveryMode}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4">Payment</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Method</span>
                <span className="capitalize">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-green-600' :
                  order.paymentStatus === 'failed' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              {order.paymentId && (
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment ID</span>
                  <span className="text-xs">{order.paymentId}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

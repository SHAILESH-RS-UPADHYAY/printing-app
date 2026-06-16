import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  Package,
  LogOut,
  Printer,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/orders', icon: ShoppingBag, label: 'Orders' },
  { path: '/users', icon: Users, label: 'Users' },
  { path: '/products', icon: Package, label: 'Products' },
];

export function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="sidebar">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <Printer className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">PrintClient</h1>
              <p className="text-xs text-white/70">Admin Panel</p>
            </div>
          </div>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 w-full transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

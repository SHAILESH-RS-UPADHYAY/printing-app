import { useEffect, useState } from 'react';
import { Users as UsersIcon, Search } from 'lucide-react';

export function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/auth/users')
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .catch(() => {});
  }, []);

  const filtered = search
    ? users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) || u.phone?.includes(search))
    : users;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Users</h1>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none w-64"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-400">No users found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-slate-500 border-b border-slate-100">
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Phone</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Role</th>
                <th className="p-4 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user: any) => (
                <tr key={user._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 text-sm font-medium text-slate-900">{user.name}</td>
                  <td className="p-4 text-sm text-slate-600">{user.phone}</td>
                  <td className="p-4 text-sm text-slate-600">{user.email || '-'}</td>
                  <td className="p-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

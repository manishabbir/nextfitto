"use client";

import { motion } from "framer-motion";
import { Search, Shield, Ban, UserCog } from "lucide-react";
import { useState } from "react";

const users = [
  { id: "1", name: "Admin User", email: "admin@nextfitt.com", role: "Admin", status: "Active", orders: 0, joined: "2024-01-01" },
  { id: "2", name: "Ahmed Khan", email: "user@nextfitt.com", role: "User", status: "Active", orders: 5, joined: "2024-01-05" },
  { id: "3", name: "Sara Ali", email: "sara@example.com", role: "User", status: "Active", orders: 3, joined: "2024-01-10" },
  { id: "4", name: "Usman R.", email: "usman@example.com", role: "User", status: "Active", orders: 8, joined: "2024-01-15" },
  { id: "5", name: "Fatima Z.", email: "fatima@example.com", role: "User", status: "Inactive", orders: 1, joined: "2024-01-20" },
  { id: "6", name: "Bilal M.", email: "bilal@example.com", role: "User", status: "Active", orders: 12, joined: "2024-02-01" },
];

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground">Manage registered users</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Total Users", value: "3,789", change: "+18.7%" },
          { label: "Active", value: "3,245", change: "85.6%" },
          { label: "New This Month", value: "234", change: "+12.3%" },
          { label: "With Orders", value: "1,876", change: "49.5%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="relative max-w-md mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users..." className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-gold-500 focus:outline-none" />
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">User</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Role</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Orders</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Joined</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20 text-gold-500 font-semibold text-sm">{user.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${user.role === "Admin" ? "bg-gold-500/20 text-gold-500" : "bg-blue-500/20 text-blue-500"}`}>{user.role}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${user.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"}`}>{user.status}</span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm">{user.orders}</td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground">{user.joined}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><UserCog className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"><Ban className="h-4 w-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
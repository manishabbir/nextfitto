"use client";

import { motion } from "framer-motion";
import { Search, Eye, Download } from "lucide-react";
import { useState } from "react";

const orders = [
  { id: "NF-001", customer: "Ahmed Khan", email: "ahmed@example.com", status: "Delivered", payment: "Paid", total: 18500, items: 2, date: "2024-01-15" },
  { id: "NF-002", customer: "Sara Ali", email: "sara@example.com", status: "Processing", payment: "Paid", total: 32000, items: 1, date: "2024-01-14" },
  { id: "NF-003", customer: "Usman R.", email: "usman@example.com", status: "Shipped", payment: "Paid", total: 12500, items: 3, date: "2024-01-13" },
  { id: "NF-004", customer: "Fatima Z.", email: "fatima@example.com", status: "Pending", payment: "Pending", total: 28000, items: 2, date: "2024-01-12" },
  { id: "NF-005", customer: "Bilal M.", email: "bilal@example.com", status: "Delivered", payment: "Paid", total: 22500, items: 1, date: "2024-01-11" },
  { id: "NF-006", customer: "Hira S.", email: "hira@example.com", status: "Cancelled", payment: "Refunded", total: 15800, items: 1, date: "2024-01-10" },
  { id: "NF-007", customer: "Ali Raza", email: "ali@example.com", status: "Processing", payment: "Paid", total: 45000, items: 3, date: "2024-01-09" },
  { id: "NF-008", customer: "Zainab K.", email: "zainab@example.com", status: "Delivered", payment: "Paid", total: 9500, items: 2, date: "2024-01-08" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-500/20 text-green-500",
  Processing: "bg-blue-500/20 text-blue-500",
  Shipped: "bg-gold-500/20 text-gold-500",
  Pending: "bg-yellow-500/20 text-yellow-500",
  Cancelled: "bg-destructive/20 text-destructive",
};

export default function AdminOrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage customer orders</p>
        </div>
        <button className="flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted">
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-5 mb-6">
        {[
          { label: "Total Orders", value: "1,234", change: "+8.2%" },
          { label: "Pending", value: "23", change: "Needs action" },
          { label: "Processing", value: "45", change: "In progress" },
          { label: "Delivered", value: "1,098", change: "89%" },
          { label: "Revenue", value: "₹1.2M", change: "+12.5%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders..." className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:border-gold-500 focus:outline-none" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-gold-500 focus:outline-none">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Order</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Customer</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Payment</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Items</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Total</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Date</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter((o) => statusFilter === "All" || o.status === statusFilter).map((order, i) => (
                <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4 text-sm font-medium">{order.id}</td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status] || ""}`}>{order.status}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.payment === "Paid" ? "bg-green-500/20 text-green-500" : order.payment === "Refunded" ? "bg-destructive/20 text-destructive" : "bg-yellow-500/20 text-yellow-500"}`}>{order.payment}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm">{order.items}</td>
                  <td className="py-3 px-4 text-right text-sm font-medium">₹{order.total.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground">{order.date}</td>
                  <td className="py-3 px-4 text-right">
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"><Eye className="h-4 w-4" /></button>
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
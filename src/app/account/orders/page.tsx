"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";

const orders = [
  { id: "NF-001", date: "Jan 15, 2024", status: "Delivered", total: 18500, items: 2, statusColor: "text-green-500 bg-green-500/20" },
  { id: "NF-003", date: "Jan 13, 2024", status: "Shipped", total: 12500, items: 3, statusColor: "text-gold-500 bg-gold-500/20" },
  { id: "NF-005", date: "Jan 11, 2024", status: "Delivered", total: 22500, items: 1, statusColor: "text-green-500 bg-green-500/20" },
];

export default function OrdersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Package className="h-6 w-6 text-gold-500" />
        <h1 className="font-display text-3xl font-bold">My Orders</h1>
      </div>
      <div className="space-y-4">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-border bg-card p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.statusColor}`}>
                {order.status}
              </span>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">{order.items} item(s)</span>
              <span className="text-lg font-bold">₹{order.total.toLocaleString()}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
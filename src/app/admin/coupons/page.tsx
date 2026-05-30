"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Tag } from "lucide-react";

const coupons = [
  { id: "1", code: "WELCOME20", type: "Percentage", value: "20%", minOrder: "₹5,000", maxDiscount: "₹10,000", used: 45, limit: 100, status: "Active", expires: "2024-12-31" },
  { id: "2", code: "SUMMER15", type: "Percentage", value: "15%", minOrder: "₹3,000", maxDiscount: "₹5,000", used: 128, limit: 200, status: "Active", expires: "2024-09-30" },
  { id: "3", code: "FREESHIP", type: "Fixed", value: "₹500", minOrder: "₹5,000", maxDiscount: "-", used: 312, limit: 500, status: "Active", expires: "2024-12-31" },
  { id: "4", code: "EID20", type: "Percentage", value: "20%", minOrder: "₹3,000", maxDiscount: "₹8,000", used: 500, limit: 500, status: "Expired", expires: "2024-04-30" },
  { id: "5", code: "VIP50", type: "Percentage", value: "50%", minOrder: "₹10,000", maxDiscount: "₹25,000", used: 12, limit: 50, status: "Active", expires: "2024-12-31" },
];

export default function AdminCouponsPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Coupons</h1>
          <p className="text-sm text-muted-foreground">Manage discount coupons and promotions</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-4 mb-6">
        {[
          { label: "Active Coupons", value: "4", change: "Available" },
          { label: "Total Used", value: "997", change: "+23.4%" },
          { label: "Revenue Impact", value: "₹45,230", change: "Discount given" },
          { label: "Avg Discount", value: "18.5%", change: "Per order" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Code</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Value</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Min Order</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Usage</th>
                <th className="text-center py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Status</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Expires</th>
                <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon, i) => (
                <motion.tr key={coupon.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gold-500/10 p-2"><Tag className="h-4 w-4 text-gold-500" /></div>
                      <div>
                        <p className="text-sm font-mono font-bold">{coupon.code}</p>
                        <p className="text-xs text-muted-foreground">{coupon.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold">{coupon.value}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{coupon.minOrder}</td>
                  <td className="py-3 px-4 text-sm">{coupon.used}/{coupon.limit}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${coupon.status === "Active" ? "bg-green-500/20 text-green-500" : "bg-destructive/20 text-destructive"}`}>{coupon.status}</span>
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-muted-foreground">{coupon.expires}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"><Edit className="h-4 w-4" /></button>
                      <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
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
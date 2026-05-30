"use client";

import { motion } from "framer-motion";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";

const addresses = [
  { id: "1", label: "Home", fullName: "Ahmed Khan", street: "123 Main Street, Gulberg", city: "Lahore", state: "Punjab", zip: "54000", phone: "+92 300 1234567", isDefault: true },
  { id: "2", label: "Office", fullName: "Ahmed Khan", street: "456 Business Avenue", city: "Karachi", state: "Sindh", zip: "74000", phone: "+92 300 7654321", isDefault: false },
];

export default function AddressesPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MapPin className="h-6 w-6 text-gold-500" />
          <h1 className="font-display text-3xl font-bold">My Addresses</h1>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> Add New
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((addr, i) => (
          <motion.div key={addr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-6 relative">
            {addr.isDefault && (
              <span className="absolute top-4 right-4 rounded-full bg-gold-500/20 px-3 py-1 text-xs font-medium text-gold-500">Default</span>
            )}
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-4 w-4 text-gold-500" />
              <span className="text-sm font-semibold">{addr.label}</span>
            </div>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{addr.fullName}</p>
              <p>{addr.street}</p>
              <p>{addr.city}, {addr.state} {addr.zip}</p>
              <p>{addr.phone}</p>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"><Edit className="h-3 w-3" /> Edit</button>
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-3 w-3" /> Remove</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center px-4">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Looks like you haven't added anything yet</p>
        <Link href="/men" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          Start Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
        <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive transition-colors">
          Clear Cart
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <motion.div key={item.id} layout className="flex gap-4 rounded-2xl border border-border bg-card p-4 md:p-6">
              <div className="h-24 w-24 md:h-32 md:w-32 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/product/${item.slug}`} className="text-sm font-medium hover:text-gold-500 transition-colors md:text-base">{item.name}</Link>
                  {(item.size || item.color) && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{item.size && `Size: ${item.size}`}{item.size && item.color && " / "}{item.color && `Color: ${item.color}`}</p>
                  )}
                  <p className="mt-2 text-sm font-semibold md:text-base">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-2 rounded-lg border border-border">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-muted-foreground hover:text-foreground"><Minus className="h-3 w-3" /></button>
                    <span className="min-w-[24px] text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-muted-foreground hover:text-foreground"><Plus className="h-3 w-3" /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors p-2">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4 sticky top-24">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span className="font-medium">{formatPrice(getSubtotal())}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span className="font-medium text-gold-500">Free</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span className="font-medium">Calculated at checkout</span></div>
            </div>
            <div className="border-t border-border pt-4">
              <div className="flex justify-between text-base"><span className="font-semibold">Total</span><span className="font-bold">{formatPrice(getSubtotal())}</span></div>
            </div>
            <Link href="/checkout" className="flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-4 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
              Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/men" className="flex w-full items-center justify-center rounded-full border border-border px-6 py-4 text-sm font-medium transition-colors hover:bg-muted">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
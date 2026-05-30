"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore, useUIStore } from "@/store";
import { formatPrice } from "@/lib/utils";

export function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUIStore();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-background shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                <h2 className="text-lg font-semibold">
                  Cart ({items.length})
                </h2>
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
                  <h3 className="mt-4 text-lg font-semibold">
                    Your cart is empty
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add some premium pieces to your collection
                  </p>
                  <button
                    onClick={() => setCartOpen(false)}
                    className="mt-6 rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex gap-4 rounded-xl border border-border bg-card p-4"
                    >
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => setCartOpen(false)}
                            className="text-sm font-medium hover:text-gold-500 transition-colors"
                          >
                            {item.name}
                          </Link>
                          {(item.size || item.color) && (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {item.size && `Size: ${item.size}`}
                              {item.size && item.color && " / "}
                              {item.color && `Color: ${item.color}`}
                            </p>
                          )}
                          <p className="mt-1 text-sm font-semibold">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded-lg border border-border">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-[20px] text-center text-xs font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="p-1.5 text-muted-foreground transition-colors hover:text-foreground"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-border px-6 py-4">
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">
                      {formatPrice(getSubtotal())}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Shipping & taxes calculated at checkout
                  </p>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="flex w-full items-center justify-center rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600"
                >
                  Checkout
                </Link>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-2 flex w-full items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  View Cart
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { useWishlistStore } from "@/store";

const wishlistProducts: Record<string, { name: string; slug: string; price: number; comparePrice: number | null; image: string }> = {
  "1": { name: "Premium Executive Suit", slug: "premium-executive-suit", price: 18500, comparePrice: 25000, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80" },
  "2": { name: "Luxury Cashmere Coat", slug: "luxury-cashmere-blend-coat", price: 32000, comparePrice: 42000, image: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&q=80" },
  "3": { name: "Designer Kurta Shalwar", slug: "designer-kurta-shalwar", price: 12500, comparePrice: null, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80" },
  "5": { name: "Silk Evening Gown", slug: "silk-evening-gown", price: 28000, comparePrice: null, image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80" },
};

export default function WishlistPage() {
  const { items, removeItem } = useWishlistStore();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-6 w-6 text-gold-500" />
        <h1 className="font-display text-3xl font-bold">My Wishlist</h1>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart className="h-16 w-16 text-muted-foreground/50" />
          <h2 className="mt-4 text-xl font-semibold">Your wishlist is empty</h2>
          <p className="mt-2 text-muted-foreground">Save items you love to your wishlist</p>
          <Link href="/men" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
            Browse Products <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((id, i) => {
            const product = wishlistProducts[id];
            if (!product) return null;
            return (
              <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="group">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
                <div className="mt-4 space-y-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/product/${product.slug}`} className="block text-sm font-medium transition-colors hover:text-gold-500">{product.name}</Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold">₹{product.price.toLocaleString()}</span>
                        {product.comparePrice && <span className="text-xs text-muted-foreground line-through">₹{product.comparePrice.toLocaleString()}</span>}
                      </div>
                    </div>
                    <button onClick={() => removeItem(id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
                      <Heart className="h-4 w-4" fill="currentColor" />
                    </button>
                  </div>
                  <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-gold-500 py-2.5 text-xs font-semibold text-black transition-colors hover:bg-gold-600">
                    <ShoppingBag className="h-3.5 w-3.5" /> Add to Cart
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp } from "lucide-react";
import { useUIStore } from "@/store";
import { useRouter } from "next/navigation";

const popularSearches = [
  "Premium Suits",
  "Kurta Collection",
  "Casual Shirts",
  "Formal Wear",
  "Eid Collection",
];

export function SearchModal() {
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!isSearchOpen) {
      setQuery("");
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
    }
  };

  const handlePopularSearch = (term: string) => {
    setQuery(term);
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setSearchOpen(false);
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background shadow-2xl"
          >
            <div className="mx-auto max-w-3xl px-4 py-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products, categories..."
                  className="w-full rounded-full border border-border bg-muted py-4 pl-12 pr-12 text-base placeholder:text-muted-foreground focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <X className="h-5 w-5" />
                </button>
              </form>

              <div className="mt-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>Popular Searches</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handlePopularSearch(term)}
                      className="rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-gold-500 hover:text-gold-500"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-muted-foreground">
                  Press ESC to close
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
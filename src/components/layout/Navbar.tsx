"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Search,
  ShoppingBag,
  Heart,
  User,
  ChevronDown,
  LogOut,
  Package,
  Settings,
  Shield,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { useCartStore, useWishlistStore, useUIStore } from "@/store";
import { cn } from "@/lib/utils";

const categories = [
  { name: "New Arrivals", href: "/new-arrivals" },
  { name: "Men", href: "/men" },
  { name: "Women", href: "/women" },
  { name: "Sale", href: "/sale" },
];

const megaMenuItems = {
  Men: [
    {
      title: "Collections",
      items: [
        { name: "Premium Suits", href: "/men?category=suits" },
        { name: "Casual Wear", href: "/men?category=casual" },
        { name: "Traditional", href: "/men?category=traditional" },
        { name: "Accessories", href: "/men?category=accessories" },
      ],
    },
    {
      title: "Shop by Style",
      items: [
        { name: "Formal", href: "/men?style=formal" },
        { name: "Semi-Formal", href: "/men?style=semi-formal" },
        { name: "Streetwear", href: "/men?style=streetwear" },
        { name: "Luxury", href: "/men?style=luxury" },
      ],
    },
    {
      title: "Featured",
      items: [
        { name: "Best Sellers", href: "/men?sort=best-sellers" },
        { name: "New This Week", href: "/men?sort=newest" },
        { name: "On Sale", href: "/men?sort=sale" },
      ],
    },
  ],
  Women: [
    {
      title: "Collections",
      items: [
        { name: "Designer Wear", href: "/women?category=designer" },
        { name: "Casual Chic", href: "/women?category=casual" },
        { name: "Eastern Wear", href: "/women?category=eastern" },
        { name: "Accessories", href: "/women?category=accessories" },
      ],
    },
    {
      title: "Shop by Style",
      items: [
        { name: "Formal", href: "/women?style=formal" },
        { name: "Party Wear", href: "/women?style=party" },
        { name: "Daily Wear", href: "/women?style=daily" },
        { name: "Luxury Collection", href: "/women?style=luxury" },
      ],
    },
    {
      title: "Featured",
      items: [
        { name: "Best Sellers", href: "/women?sort=best-sellers" },
        { name: "New Arrivals", href: "/women?sort=newest" },
        { name: "Sale", href: "/women?sort=sale" },
      ],
    },
  ],
};

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const cartItemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { isMobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUIStore();

  const isLoggedIn = !!session?.user;
  const isAdmin = session?.user?.role === "ADMIN";

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveMegaMenu(null);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [setMobileMenuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-background/95 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-foreground/80 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 text-foreground"
          >
            <span className="text-2xl font-bold tracking-tighter md:text-3xl">
              NEXT<span className="text-gold-500">FITT</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="relative"
                onMouseEnter={() =>
                  cat.name !== "New Arrivals" && cat.name !== "Sale"
                    ? setActiveMegaMenu(cat.name)
                    : setActiveMegaMenu(null)
                }
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  href={cat.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors rounded-full",
                    activeMegaMenu === cat.name
                      ? "text-gold-500"
                      : "text-foreground/80 hover:text-foreground"
                  )}
                >
                  {cat.name}
                  {(cat.name === "Men" || cat.name === "Women") && (
                    <ChevronDown
                      className={cn(
                        "ml-1 h-3 w-3 transition-transform",
                        activeMegaMenu === cat.name && "rotate-180"
                      )}
                    />
                  )}
                </Link>

                {/* Mega Menu */}
                <AnimatePresence>
                  {activeMegaMenu === cat.name &&
                    megaMenuItems[cat.name as keyof typeof megaMenuItems] && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-[600px] rounded-2xl border border-border bg-card p-6 shadow-2xl"
                      >
                        <div className="grid grid-cols-3 gap-8">
                          {megaMenuItems[
                            cat.name as keyof typeof megaMenuItems
                          ].map((column) => (
                            <div key={column.title}>
                              <h3 className="mb-3 text-xs font-semibold tracking-widest uppercase text-muted-foreground">
                                {column.title}
                              </h3>
                              <ul className="space-y-2">
                                {column.items.map((item) => (
                                  <li key={item.name}>
                                    <Link
                                      href={item.href}
                                      className="text-sm text-foreground/70 transition-colors hover:text-gold-500"
                                    >
                                      {item.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-1 md:space-x-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-foreground/80 transition-colors hover:text-foreground rounded-full hover:bg-muted"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              href="/wishlist"
              className="relative p-2 text-foreground/80 transition-colors hover:text-foreground rounded-full hover:bg-muted"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {mounted && wishlistCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* User Menu / Login */}
            <div className="relative hidden md:block">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 text-foreground/80 transition-colors hover:text-foreground rounded-full hover:bg-muted"
                    aria-label="User menu"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/20">
                      <span className="text-xs font-bold text-gold-500">
                        {session?.user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50"
                      >
                        <div className="px-3 py-2 border-b border-border mb-1">
                          <p className="text-sm font-medium">{session?.user?.name}</p>
                          <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                        </div>
                        <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
                          <User className="h-4 w-4" /> My Account
                        </Link>
                        <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-foreground/80 hover:bg-muted hover:text-foreground transition-colors">
                          <Package className="h-4 w-4" /> My Orders
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gold-500 hover:bg-gold-500/10 transition-colors">
                            <Shield className="h-4 w-4" /> Admin Dashboard
                          </Link>
                        )}
                        <div className="border-t border-border mt-1 pt-1">
                          <button
                            onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                          >
                            <LogOut className="h-4 w-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/auth/login"
                  className="rounded-full bg-gold-500 px-5 py-2 text-sm font-semibold text-black transition-colors hover:bg-gold-600"
                >
                  Sign In
                </Link>
              )}
            </div>

            <button
              onClick={() => useUIStore.getState().setCartOpen(true)}
              className="relative p-2 text-foreground/80 transition-colors hover:text-foreground rounded-full hover:bg-muted"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && cartItemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold-500 text-[10px] font-bold text-white">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-border bg-background lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {categories.map((cat) => (
                <Link
                  key={cat.name}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-border pt-4 mt-4">
                {isLoggedIn ? (
                  <>
                    <div className="flex items-center gap-3 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/20">
                        <span className="text-xs font-bold text-gold-500">{session?.user?.name?.charAt(0) || "U"}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{session?.user?.name}</p>
                        <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                      </div>
                    </div>
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                      <User className="h-5 w-5" /> My Account
                    </Link>
                    <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                      <Package className="h-5 w-5" /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gold-500 transition-colors hover:bg-gold-500/10">
                        <Shield className="h-5 w-5" /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={() => { setMobileMenuOpen(false); signOut({ callbackUrl: "/" }); }} className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10">
                      <LogOut className="h-5 w-5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground">
                      <User className="h-5 w-5" /> My Account
                    </Link>
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center justify-center gap-2 rounded-lg bg-gold-500 px-4 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
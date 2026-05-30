"use client";

import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const menuItems = [
  { name: "My Orders", href: "/account/orders", icon: Package, count: "5" },
  { name: "Wishlist", href: "/wishlist", icon: Heart, count: "3" },
  { name: "Addresses", href: "/account/addresses", icon: MapPin },
  { name: "Account Settings", href: "/account/settings", icon: Settings },
];

export default function AccountPage() {
  const { data: session } = useSession();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gold-500/20">
            <User className="h-8 w-8 text-gold-500" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold md:text-3xl">
              {session?.user?.name || "My Account"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {session?.user?.email || "Welcome to NEXTFITT"}
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center justify-between rounded-2xl border border-border bg-card p-6 transition-colors hover:bg-muted"
            >
              <div className="flex items-center gap-4">
                <div className="rounded-xl bg-gold-500/10 p-3">
                  <item.icon className="h-5 w-5 text-gold-500" />
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  {item.count && (
                    <p className="text-sm text-muted-foreground">{item.count} items</p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {!session && (
          <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">Sign in to your account</h2>
            <p className="mt-2 text-muted-foreground">Access your orders, wishlist, and more</p>
            <Link
              href="/api/auth/signin"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600"
            >
              Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
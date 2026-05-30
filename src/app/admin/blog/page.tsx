"use client";

import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, FileText } from "lucide-react";
import Link from "next/link";

const posts = [
  { id: "1", title: "The Ultimate Guide to Men's Formal Wear", author: "NEXTFITT Style Team", status: "Published", date: "Jan 15, 2024", views: 1245, image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80" },
  { id: "2", title: "Summer Fashion Trends 2024: What's Hot", author: "NEXTFITT Style Team", status: "Published", date: "Jan 10, 2024", views: 987, image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200&q=80" },
  { id: "3", title: "How to Style Your Kurta for Any Occasion", author: "NEXTFITT Style Team", status: "Draft", date: "-", views: 0, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80" },
];

export default function AdminBlogPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Blog / Journal</h1>
          <p className="text-sm text-muted-foreground">Manage blog posts and articles</p>
        </div>
        <button className="flex items-center gap-2 rounded-full bg-gold-500 px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
          <Plus className="h-4 w-4" /> New Post
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        {[
          { label: "Total Posts", value: "12", change: "+3 this month" },
          { label: "Published", value: "9", change: "75%" },
          { label: "Total Views", value: "4,567", change: "+23.4%" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold mt-1">{stat.value}</p>
            <p className="text-xs text-gold-500 mt-0.5">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {posts.map((post, i) => (
          <motion.div key={post.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex flex-col sm:flex-row">
              <div className="h-32 w-full sm:w-48 flex-shrink-0">
                <img src={post.image} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="flex-1 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{post.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">By {post.author}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${post.status === "Published" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}`}>{post.status}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  <span>{post.date}</span>
                  <span>{post.views} views</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Eye className="h-4 w-4" /></button>
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"><Edit className="h-4 w-4" /></button>
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
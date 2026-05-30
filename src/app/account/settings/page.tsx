"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User, Mail, Phone, Save, Lock, Eye, EyeOff } from "lucide-react";

export default function AccountSettingsPage() {
  const [name, setName] = useState("Ahmed Khan");
  const [email, setEmail] = useState("user@nextfitt.com");
  const [phone, setPhone] = useState("+92 300 1234567");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="h-6 w-6 text-gold-500" />
        <h1 className="font-display text-3xl font-bold">Account Settings</h1>
      </div>

      {/* Profile Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-border bg-card p-6 md:p-8 mb-6">
        <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2"><User className="h-4 w-4 text-gold-500" /> Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2"><Mail className="h-4 w-4 text-gold-500" /> Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 flex items-center gap-2"><Phone className="h-4 w-4 text-gold-500" /> Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500" />
            </div>
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
            <Save className="h-4 w-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-border bg-card p-6 md:p-8">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2"><Lock className="h-5 w-5 text-gold-500" /> Change Password</h2>
        <form onSubmit={handleSave} className="space-y-6 max-w-md">
          <div>
            <label className="text-sm font-medium mb-1.5">Current Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5">New Password</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:border-gold-500 focus:outline-none focus:ring-1 focus:ring-gold-500" />
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-6 py-3 text-sm font-semibold text-black transition-colors hover:bg-gold-600">
            <Lock className="h-4 w-4" /> Update Password
          </button>
        </form>
      </motion.div>
    </div>
  );
}
# NEXTFITT - Premium Fashion E-Commerce Platform

A production-grade premium fashion e-commerce website built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. Inspired by Breakout, Outfitters, and Yumni.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn UI
- **Animations:** Framer Motion
- **Database:** PostgreSQL + Prisma ORM
- **Authentication:** NextAuth.js
- **Payments:** Stripe-ready architecture
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Email:** Resend
- **File Uploads:** UploadThing

## 📁 Project Structure

```
nextfitt/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed data
├── public/
│   └── images/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── globals.css        # Global styles
│   │   ├── (shop)/            # Shop routes (men, women, cart, etc.)
│   │   │   ├── men/
│   │   │   ├── women/
│   │   │   ├── new-arrivals/
│   │   │   ├── sale/
│   │   │   ├── product/[slug]/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   └── wishlist/
│   │   ├── account/           # User account pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── contact/           # Contact page
│   │   ├── about/             # About brand page
│   │   ├── blog/              # Blog/Journal
│   │   └── api/               # API routes
│   ├── components/
│   │   ├── layout/            # Navbar, Footer, AnnouncementBar
│   │   ├── home/              # HeroSection, sections
│   │   ├── product/           # ProductCard, ProductGrid
│   │   ├── cart/              # CartDrawer
│   │   ├── search/            # SearchModal
│   │   ├── filters/           # Filter components
│   │   └── ui/                # Shadcn UI components
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   ├── prisma.ts          # Prisma client
│   │   ├── auth.ts            # NextAuth config
│   │   └── stripe.ts          # Stripe config
│   ├── store/
│   │   └── index.ts           # Zustand stores (cart, wishlist, UI)
│   ├── hooks/                 # Custom hooks
│   ├── types/                 # TypeScript types
│   └── providers/             # React providers
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── next.config.mjs
├── .env.example
└── README.md
```

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nextfitt
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit `.env` with your database URL and other credentials.

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚢 Deployment on Vercel

1. Push the repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Configure environment variables in Vercel dashboard.
4. Set the Postgres database (Vercel Postgres or external).
5. Deploy!

### Environment Variables Required

```
DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
RESEND_API_KEY=
NEXT_PUBLIC_APP_URL=
```

## ✨ Features

### Frontend
- ✅ Responsive mobile-first design
- ✅ Dark minimal premium UI
- ✅ Smooth Framer Motion animations
- ✅ Product image zoom & gallery
- ✅ Mega menu navigation
- ✅ Quick view & add to cart
- ✅ Search modal with popular searches
- ✅ Cart drawer with quantity controls
- ✅ Wishlist functionality
- ✅ Product filtering & sorting
- ✅ Size & color variant selection
- ✅ Customer reviews & ratings
- ✅ Newsletter signup
- ✅ SEO optimized
- ✅ Font optimization (Google Fonts)

### Backend
- ✅ Full Prisma schema with all models
- ✅ NextAuth authentication (Credentials + OAuth)
- ✅ Product CRUD API
- ✅ Order management
- ✅ User management
- ✅ Banner management
- ✅ Coupon system
- ✅ Contact form
- ✅ Blog/Journal

### Admin Dashboard
- ✅ Sales analytics with charts
- ✅ Revenue overview
- ✅ Order management table
- ✅ Quick menu navigation
- ✅ Product management
- ✅ User management
- ✅ Inventory tracking

## 🎨 Design

- **Color Palette:** Dark theme with gold accents (#d4941a)
- **Typography:** Inter (body) + Playfair Display (headings)
- **Rounded corners:** Consistent border-radius system
- **Animations:** Page transitions, scroll-triggered, hover effects
- **Layout:** Max-width container with responsive grid

## 📊 Performance

- Server-side rendering (SSR) for key pages
- Lazy-loaded images with blur placeholders
- Code splitting via Next.js dynamic imports
- Optimized fonts with `next/font`
- Image optimization with `next/image` ready
- Skeleton loaders for better UX

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by Breakout, Outfitters, and Yumni
- Images from Unsplash
- UI components inspired by Shadcn UI
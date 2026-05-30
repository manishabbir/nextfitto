import type { User } from "@prisma/client";

export type SafeUser = Omit<
  User,
  "password" | "createdAt" | "updatedAt"
> & {
  createdAt: string;
  updatedAt: string;
};

export type ProductCardData = {
  id: string;
  name: string;
  slug: string;
  price: number;
  comparePrice: number | null;
  images: { url: string; alt: string | null; isPrimary: boolean }[];
  rating: number;
  reviewCount: number;
  isNewArrival: boolean;
  isOnSale: boolean;
  quantity: number;
};

export type CartItemData = {
  id: string;
  productId: string;
  variantId: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string; alt: string | null }[];
    quantity: number;
  };
  variant?: {
    id: string;
    name: string;
    price: number | null;
    size?: { size: string } | null;
    color?: { color: string; hexCode: string | null } | null;
  } | null;
};

export type BannerData = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  imageUrl: string;
  mobileImageUrl: string | null;
  linkUrl: string | null;
  linkText: string | null;
  isHero: boolean;
};

export type OrderData = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  currency: string;
  createdAt: string;
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string | null;
    size: string | null;
    color: string | null;
  }[];
  shippingAddress: Record<string, unknown> | null;
  trackingNumber: string | null;
};

export type ReviewData = {
  id: string;
  rating: number;
  title: string | null;
  comment: string;
  createdAt: string;
  user: {
    name: string | null;
    image: string | null;
  };
};

export type FilterOptions = {
  categories: string[];
  sizes: string[];
  colors: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  sortBy: string;
};

export type SearchResult = {
  products: ProductCardData[];
  totalCount: number;
  query: string;
};
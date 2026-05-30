"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Share2, ChevronRight, Star, Minus, Plus, Truck, Shield, RotateCcw } from "lucide-react";
import { useWishlistStore, useCartStore, useUIStore } from "@/store";
import { formatPrice, calculateDiscount } from "@/lib/utils";
import { toast } from "sonner";

const products = [
  {
    id: "1",
    name: "Premium Executive Suit",
    slug: "premium-executive-suit",
    price: 18500,
    comparePrice: 25000,
    description: "Crafted from premium Italian wool blend, this executive suit embodies sophistication and power. Features a tailored fit with notch lapels, two-button closure, and interior pockets. Perfect for boardroom meetings and formal occasions.",
    brand: "NEXTFITT Signature",
    sku: "NF-SUIT-001",
    material: "Italian Wool Blend (80% Wool, 20% Polyester)",
    careInstructions: "Dry clean only. Store on padded hanger.",
    rating: 4.8,
    reviewCount: 124,
    quantity: 15,
    images: [
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", alt: "Front View" },
      { url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80", alt: "Side View" },
      { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", alt: "Detail View" },
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy Blue", hex: "#1a2744" },
      { name: "Charcoal", hex: "#36454F" },
      { name: "Black", hex: "#000000" },
    ],
    category: "Suits",
    reviews: [
      { id: 1, user: "Ahmed K.", rating: 5, date: "2 weeks ago", comment: "Exceptional quality! The fabric is premium and the fit is perfect. Worth every penny." },
      { id: 2, user: "Usman R.", rating: 4, date: "1 month ago", comment: "Great suit for formal events. The tailoring is excellent. Runs slightly slim." },
      { id: 3, user: "Bilal M.", rating: 5, date: "2 months ago", comment: "My go-to for business meetings. Always get compliments." },
    ],
  },
  {
    id: "2",
    name: "Luxury Cashmere Blend Coat",
    slug: "luxury-cashmere-blend-coat",
    price: 32000,
    comparePrice: 42000,
    description: "Wrap yourself in luxury with this premium cashmere blend coat. Perfect for formal occasions and cold weather elegance. Features a tailored fit with notch lapels.",
    brand: "NEXTFITT Signature",
    sku: "NF-COAT-001",
    material: "Cashmere Blend (70% Cashmere, 30% Wool)",
    careInstructions: "Dry clean only.",
    rating: 4.9,
    reviewCount: 89,
    quantity: 8,
    images: [
      { url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80", alt: "Front View" },
      { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", alt: "Side View" },
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#36454F" },
      { name: "Camel", hex: "#C19A6B" },
      { name: "Black", hex: "#000000" },
    ],
    category: "Coats",
    reviews: [
      { id: 1, user: "Bilal M.", rating: 5, date: "1 week ago", comment: "Absolutely love this coat! Premium quality." },
      { id: 2, user: "Ahmed K.", rating: 5, date: "2 weeks ago", comment: "Best purchase this season." },
    ],
  },
  {
    id: "3",
    name: "Designer Kurta Shalwar",
    slug: "designer-kurta-shalwar",
    price: 12500,
    comparePrice: null,
    description: "Exquisite hand-embroidered kurta shalwar for festive occasions. Made from premium fabric with intricate thread work.",
    brand: "NEXTFITT Eastern",
    sku: "NF-KURTA-001",
    material: "Premium Cotton Blend",
    careInstructions: "Dry clean recommended.",
    rating: 4.7,
    reviewCount: 256,
    quantity: 25,
    images: [
      { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", alt: "Front View" },
      { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", alt: "Detail View" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1a2744" },
    ],
    category: "Traditional",
    reviews: [
      { id: 1, user: "Usman R.", rating: 5, date: "3 weeks ago", comment: "Beautiful design and amazing fabric!" },
    ],
  },
  {
    id: "4",
    name: "Italian Leather Loafers",
    slug: "italian-leather-loafers",
    price: 15800,
    comparePrice: 19500,
    description: "Handcrafted Italian leather loafers for the discerning gentleman. Premium craftsmanship with lasting comfort.",
    brand: "NEXTFITT Accessories",
    sku: "NF-SHOE-001",
    material: "Italian Calf Leather",
    careInstructions: "Wipe clean with damp cloth.",
    rating: 4.6,
    reviewCount: 67,
    quantity: 12,
    images: [
      { url: "https://images.unsplash.com/photo-1531310197839-ccf546a09c7f?w=800&q=80", alt: "Top View" },
      { url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", alt: "Side View" },
    ],
    sizes: ["40", "41", "42", "43", "44"],
    colors: [
      { name: "Brown", hex: "#8B4513" },
      { name: "Black", hex: "#000000" },
    ],
    category: "Accessories",
    reviews: [
      { id: 1, user: "Ahmed K.", rating: 4, date: "1 month ago", comment: "Premium quality leather. Very comfortable." },
    ],
  },
  {
    id: "5",
    name: "Silk Evening Gown",
    slug: "silk-evening-gown",
    price: 28000,
    comparePrice: null,
    description: "A stunning silk evening gown with elegant draping. Perfect for galas and special occasions.",
    brand: "NEXTFITT Luxe",
    sku: "NF-GOWN-001",
    material: "Pure Silk",
    careInstructions: "Dry clean only.",
    rating: 4.9,
    reviewCount: 43,
    quantity: 5,
    images: [
      { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80", alt: "Front View" },
      { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", alt: "Back View" },
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Red", hex: "#8B0000" },
      { name: "Black", hex: "#000000" },
      { name: "Emerald", hex: "#046307" },
    ],
    category: "Designer",
    reviews: [
      { id: 1, user: "Bilal M.", rating: 5, date: "2 weeks ago", comment: "Stunning gown! The silk is incredible." },
    ],
  },
  {
    id: "6",
    name: "Handcrafted Leather Bag",
    slug: "handcrafted-leather-bag",
    price: 22500,
    comparePrice: 28000,
    description: "Artisan-crafted leather bag with gold-tone hardware. Spacious interior with multiple compartments.",
    brand: "NEXTFITT Accessories",
    sku: "NF-BAG-001",
    material: "Full-Grain Leather",
    careInstructions: "Clean with leather conditioner.",
    rating: 4.7,
    reviewCount: 91,
    quantity: 10,
    images: [
      { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", alt: "Front View" },
      { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", alt: "Side View" },
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Tan", hex: "#D2B48C" },
      { name: "Black", hex: "#000000" },
    ],
    category: "Accessories",
    reviews: [
      { id: 1, user: "Usman R.", rating: 5, date: "1 week ago", comment: "Exquisite craftsmanship. The leather is top quality." },
      { id: 2, user: "Ahmed K.", rating: 4, date: "2 weeks ago", comment: "Beautiful bag, lots of space." },
    ],
  },
  {
    id: "8",
    name: "Classic Oxford Shirt",
    slug: "classic-oxford-shirt",
    price: 8500,
    comparePrice: 11000,
    description: "Timeless classic Oxford shirt crafted from premium cotton. Perfect for both casual and formal occasions.",
    brand: "NEXTFITT Signature",
    sku: "NF-SHIRT-001",
    material: "Premium Cotton",
    careInstructions: "Machine washable.",
    rating: 4.5,
    reviewCount: 203,
    quantity: 30,
    images: [
      { url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80", alt: "Front View" },
      { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", alt: "Detail View" },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Light Blue", hex: "#ADD8E6" },
    ],
    category: "Casual",
    reviews: [
      { id: 1, user: "Usman R.", rating: 5, date: "1 month ago", comment: "Perfect fit, great quality!" },
    ],
  },
  {
    id: "10",
    name: "Wool Cashmere Scarf",
    slug: "wool-cashmere-scarf",
    price: 6500,
    comparePrice: 8500,
    description: "Luxuriously soft wool cashmere blend scarf. The perfect accessory for cold weather elegance.",
    brand: "NEXTFITT Accessories",
    sku: "NF-SCARF-001",
    material: "Wool-Cashmere Blend",
    careInstructions: "Hand wash cold.",
    rating: 4.7,
    reviewCount: 42,
    quantity: 20,
    images: [
      { url: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&q=80", alt: "Front View" },
    ],
    sizes: ["One Size"],
    colors: [
      { name: "Gray", hex: "#808080" },
      { name: "Black", hex: "#000000" },
      { name: "Burgundy", hex: "#800020" },
    ],
    category: "Accessories",
    reviews: [],
  },
  {
    id: "11",
    name: "Designer Leather Belt",
    slug: "designer-leather-belt",
    price: 7200,
    comparePrice: null,
    description: "Premium leather belt with minimalist buckle design. A wardrobe essential for the style-conscious.",
    brand: "NEXTFITT Accessories",
    sku: "NF-BELT-001",
    material: "Italian Leather",
    careInstructions: "Wipe clean.",
    rating: 4.3,
    reviewCount: 89,
    quantity: 35,
    images: [
      { url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80", alt: "Front View" },
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    colors: [
      { name: "Brown", hex: "#8B4513" },
      { name: "Black", hex: "#000000" },
    ],
    category: "Accessories",
    reviews: [],
  },
  {
    id: "12",
    name: "Premium Denim Jacket",
    slug: "premium-denim-jacket",
    price: 14500,
    comparePrice: 18000,
    description: "Classic denim jacket with modern tailoring. Crafted from premium Japanese selvedge denim.",
    brand: "NEXTFITT Signature",
    sku: "NF-JACKET-001",
    material: "Japanese Selvedge Denim",
    careInstructions: "Machine wash inside out.",
    rating: 4.6,
    reviewCount: 134,
    quantity: 18,
    images: [
      { url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&q=80", alt: "Front View" },
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Indigo", hex: "#3F51B5" },
      { name: "Black", hex: "#000000" },
    ],
    category: "Casual",
    reviews: [],
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = products.find((p) => p.slug === slug) || products[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || "");
  const [quantity, setQuantity] = useState(1);
  const { toggleItem, hasItem } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const { setCartOpen } = useUIStore();

  const discount = product.comparePrice ? calculateDiscount(product.price, product.comparePrice) : 0;

  if (!product) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Link href="/" className="mt-4 inline-block text-gold-500">Go Home</Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      productId: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      comparePrice: product.comparePrice,
      image: product.images[0]?.url || "",
      quantity: quantity,
      size: selectedSize || null,
      color: selectedColor || null,
      variantId: null,
      maxQuantity: product.quantity,
    };
    addItem(cartItem);
    setCartOpen(true);
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-gold-500 transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/${product.category.toLowerCase()}`} className="hover:text-gold-500 transition-colors">{product.category}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-muted"
            >
              <img
                src={product.images[selectedImage]?.url || product.images[0]?.url}
                alt={product.images[selectedImage]?.alt || product.name}
                className="h-full w-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-gold-500 px-4 py-2 text-sm font-bold text-black">-{discount}% OFF</span>
              )}
            </motion.div>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                    i === selectedImage ? "border-gold-500" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <img src={img.url} alt={img.alt} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-gold-500">{product.brand}</p>
              <h1 className="mt-2 font-display text-3xl font-bold md:text-4xl">{product.name}</h1>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < Math.round(product.rating) ? "fill-gold-500 text-gold-500" : "text-muted-foreground/30"}`} />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-muted-foreground line-through">{formatPrice(product.comparePrice)}</span>
                  <span className="rounded-full bg-gold-500/20 px-3 py-1 text-xs font-semibold text-gold-500">Save {discount}%</span>
                </>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold">Size</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`rounded-lg border px-5 py-3 text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-gold-500 bg-gold-500/10 text-gold-500"
                        : "border-border hover:border-foreground"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Color: {selectedColor}</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`h-10 w-10 rounded-full border-2 transition-all ${
                      selectedColor === color.name ? "border-gold-500 scale-110 ring-2 ring-gold-500/30" : "border-border"
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3 rounded-xl border border-border w-fit">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-[40px] text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))} className="p-3 text-muted-foreground hover:text-foreground transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">{product.quantity} in stock</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gold-600 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Add to Cart - {formatPrice(product.price * quantity)}
              </button>
              <button
                onClick={() => toggleItem(product.id)}
                className={`rounded-full border p-4 transition-all ${
                  hasItem(product.id) ? "border-gold-500 text-gold-500 bg-gold-500/10" : "border-border hover:border-foreground"
                }`}
              >
                <Heart className="h-5 w-5" fill={hasItem(product.id) ? "currentColor" : "none"} />
              </button>
              <button className="rounded-full border border-border p-4 transition-all hover:border-foreground">
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border bg-card p-6">
              <div className="text-center">
                <Truck className="h-5 w-5 mx-auto text-gold-500" />
                <p className="mt-2 text-xs font-medium">Free Shipping</p>
                <p className="text-[10px] text-muted-foreground">On orders over ₹5,000</p>
              </div>
              <div className="text-center">
                <Shield className="h-5 w-5 mx-auto text-gold-500" />
                <p className="mt-2 text-xs font-medium">Secure</p>
                <p className="text-[10px] text-muted-foreground">100% Protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-5 w-5 mx-auto text-gold-500" />
                <p className="mt-2 text-xs font-medium">Returns</p>
                <p className="text-[10px] text-muted-foreground">30-day policy</p>
              </div>
            </div>

            {/* Material & Care */}
            <div className="space-y-3 rounded-2xl border border-border bg-card p-6">
              <div>
                <h3 className="text-sm font-semibold">Material</h3>
                <p className="text-sm text-muted-foreground">{product.material}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold">Care Instructions</h3>
                <p className="text-sm text-muted-foreground">{product.careInstructions}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold">SKU</h3>
                <p className="text-sm text-muted-foreground">{product.sku}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16">
          <h2 className="font-display text-2xl font-bold mb-8">Customer Reviews</h2>
          <div className="space-y-6">
            {product.reviews.length === 0 && (
              <p className="text-muted-foreground">No reviews yet for this product.</p>
            )}
            {product.reviews.map((review) => (
              <div key={review.id} className="rounded-2xl border border-border bg-card p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500/20 text-gold-500 font-semibold text-sm">
                      {review.user.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{review.user}</p>
                      <p className="text-xs text-muted-foreground">{review.date}</p>
                    </div>
                  </div>
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
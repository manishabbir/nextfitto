import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.variantSize.deleteMany();
  await prisma.variantColor.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.userCoupon.deleteMany();
  await prisma.address.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.newsletterSubscriber.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@nextfitt.com",
      password: adminPassword,
      role: "ADMIN",
      isActive: true,
    },
  });
  console.log("✅ Admin user created: admin@nextfitt.com / admin123");

  // Create test user
  const userPassword = await bcrypt.hash("user123", 12);
  const user = await prisma.user.create({
    data: {
      name: "Ahmed Khan",
      email: "user@nextfitt.com",
      password: userPassword,
      role: "USER",
      isActive: true,
    },
  });
  console.log("✅ Test user created: user@nextfitt.com / user123");

  // Create additional users for reviews
  const userAhmed = await prisma.user.create({
    data: { name: "Ahmed K.", email: "ahmed.k@example.com", role: "USER", isActive: true },
  });
  const userUsman = await prisma.user.create({
    data: { name: "Usman R.", email: "usman.r@example.com", role: "USER", isActive: true },
  });
  const userBilal = await prisma.user.create({
    data: { name: "Bilal M.", email: "bilal.m@example.com", role: "USER", isActive: true },
  });

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: "Suits", slug: "suits", description: "Premium suits and blazers" } }),
    prisma.category.create({ data: { name: "Casual", slug: "casual", description: "Casual everyday wear" } }),
    prisma.category.create({ data: { name: "Formal", slug: "formal", description: "Formal occasion wear" } }),
    prisma.category.create({ data: { name: "Traditional", slug: "traditional", description: "Traditional eastern wear" } }),
    prisma.category.create({ data: { name: "Accessories", slug: "accessories", description: "Fashion accessories" } }),
    prisma.category.create({ data: { name: "Designer", slug: "designer", description: "Designer collection" } }),
    prisma.category.create({ data: { name: "Eastern", slug: "eastern", description: "Eastern wear collection" } }),
  ]);
  console.log("✅ Categories created");

  // Create collection
  const collection = await prisma.collection.create({
    data: {
      name: "Summer Collection 2024",
      slug: "summer-2024",
      description: "Our premium summer collection",
      isActive: true,
    },
  });

  // Create products
  const products = [
    {
      name: "Premium Executive Suit",
      slug: "premium-executive-suit",
      description: "Crafted from premium Italian wool blend, this executive suit embodies sophistication and power. Features a tailored fit with notch lapels, two-button closure, and interior pockets.",
      price: 18500,
      comparePrice: 25000,
      sku: "NF-SUIT-001",
      brand: "NEXTFITT Signature",
      material: "Italian Wool Blend (80% Wool, 20% Polyester)",
      isFeatured: true,
      isOnSale: true,
      quantity: 15,
      rating: 4.8,
      reviewCount: 124,
      images: [
        { url: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80", alt: "Premium Executive Suit", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=800&q=80", alt: "Suit side view", isPrimary: false },
      ],
      categoryIds: [categories[0].id, categories[2].id],
      reviews: [
        { userId: userAhmed.id, rating: 5, comment: "Exceptional quality! The fabric is premium and the fit is perfect. Worth every penny." },
        { userId: userUsman.id, rating: 4, comment: "Great suit for formal events. The tailoring is excellent. Runs slightly slim." },
      ],
    },
    {
      name: "Luxury Cashmere Blend Coat",
      slug: "luxury-cashmere-blend-coat",
      description: "Wrap yourself in luxury with this premium cashmere blend coat. Perfect for formal occasions and cold weather elegance.",
      price: 32000,
      comparePrice: 42000,
      sku: "NF-COAT-001",
      brand: "NEXTFITT Signature",
      material: "Cashmere Blend (70% Cashmere, 30% Wool)",
      isFeatured: true,
      isNewArrival: true,
      isOnSale: true,
      quantity: 8,
      rating: 4.9,
      reviewCount: 89,
      images: [
        { url: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&q=80", alt: "Luxury Cashmere Coat", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&q=80", alt: "Coat detail", isPrimary: false },
      ],
      categoryIds: [categories[0].id, categories[2].id],
      reviews: [
        { userId: userBilal.id, rating: 5, comment: "Absolutely love this coat! Premium quality and looks fantastic." },
        { userId: userAhmed.id, rating: 5, comment: "Best purchase this season. The cashmere blend is incredibly soft." },
      ],
    },
    {
      name: "Designer Kurta Shalwar",
      slug: "designer-kurta-shalwar",
      description: "Exquisite hand-embroidered kurta shalwar for festive occasions. Made from premium fabric with intricate thread work.",
      price: 12500,
      comparePrice: null,
      sku: "NF-KURTA-001",
      brand: "NEXTFITT Eastern",
      material: "Premium Cotton Blend",
      isFeatured: true,
      isNewArrival: true,
      quantity: 25,
      rating: 4.7,
      reviewCount: 256,
      images: [
        { url: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80", alt: "Designer Kurta", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&q=80", alt: "Kurta detail", isPrimary: false },
      ],
      categoryIds: [categories[3].id, categories[5].id],
      reviews: [
        { userId: userUsman.id, rating: 5, comment: "Beautiful design and amazing fabric. Perfect for Eid!" },
      ],
    },
    {
      name: "Italian Leather Loafers",
      slug: "italian-leather-loafers",
      description: "Handcrafted Italian leather loafers for the discerning gentleman. Premium craftsmanship with lasting comfort.",
      price: 15800,
      comparePrice: 19500,
      sku: "NF-SHOE-001",
      brand: "NEXTFITT Accessories",
      material: "Italian Calf Leather",
      isFeatured: true,
      isOnSale: true,
      quantity: 12,
      rating: 4.6,
      reviewCount: 67,
      images: [
        { url: "https://images.unsplash.com/photo-1531310197839-ccf546a09c7f?w=800&q=80", alt: "Italian Loafers", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&q=80", alt: "Loafers side", isPrimary: false },
      ],
      categoryIds: [categories[4].id],
      reviews: [
        { userId: userAhmed.id, rating: 4, comment: "Premium quality leather. Very comfortable after breaking in." },
      ],
    },
    {
      name: "Silk Evening Gown",
      slug: "silk-evening-gown",
      description: "A stunning silk evening gown with elegant draping. Perfect for galas and special occasions.",
      price: 28000,
      comparePrice: null,
      sku: "NF-GOWN-001",
      brand: "NEXTFITT Luxe",
      material: "Pure Silk",
      isFeatured: true,
      isNewArrival: true,
      quantity: 5,
      rating: 4.9,
      reviewCount: 43,
      images: [
        { url: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&q=80", alt: "Silk Gown", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&q=80", alt: "Gown back", isPrimary: false },
      ],
      categoryIds: [categories[5].id, categories[6].id],
      reviews: [
        { userId: userBilal.id, rating: 5, comment: "Stunning gown! The silk is incredible and the fit is perfect." },
      ],
    },
    {
      name: "Handcrafted Leather Bag",
      slug: "handcrafted-leather-bag",
      description: "Artisan-crafted leather bag with gold-tone hardware. Spacious interior with multiple compartments.",
      price: 22500,
      comparePrice: 28000,
      sku: "NF-BAG-001",
      brand: "NEXTFITT Accessories",
      material: "Full-Grain Leather",
      isFeatured: true,
      isOnSale: true,
      quantity: 10,
      rating: 4.7,
      reviewCount: 91,
      images: [
        { url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80", alt: "Leather Bag", isPrimary: true },
        { url: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&q=80", alt: "Bag detail", isPrimary: false },
      ],
      categoryIds: [categories[4].id, categories[5].id],
      reviews: [
        { userId: userUsman.id, rating: 5, comment: "Exquisite craftsmanship. The leather is top quality." },
        { userId: userAhmed.id, rating: 4, comment: "Beautiful bag, lots of space. The gold hardware is a nice touch." },
      ],
    },
  ];

  for (const productData of products) {
    const { images, categoryIds, reviews, ...data } = productData;
    const product = await prisma.product.create({
      data: {
        ...data,
        collectionId: collection.id,
        categories: {
          create: categoryIds.map((categoryId) => ({ categoryId })),
        },
        images: {
          create: images,
        },
      },
    });

    // Create size variants for each product
    if (product.slug !== "italian-leather-loafers" && product.slug !== "handcrafted-leather-bag") {
      const sizes = ["S", "M", "L", "XL"];
      for (const size of sizes) {
        const variant = await prisma.productVariant.create({
          data: {
            productId: product.id,
            name: `Size ${size}`,
            sku: `${product.sku}-${size}`,
            quantity: Math.floor(Math.random() * 10) + 1,
          },
        });
        await prisma.variantSize.create({
          data: { variantId: variant.id, size },
        });
      }
    }

    // Create reviews
    for (const review of reviews) {
      await prisma.review.create({
        data: {
          productId: product.id,
          userId: review.userId,
          rating: review.rating,
          comment: review.comment,
          isVerified: true,
        },
      });
    }
  }
  console.log("✅ Products created with variants and reviews");

  // Create banners
  await prisma.banner.createMany({
    data: [
      {
        title: "Elevate Your Everyday Style",
        subtitle: "Premium Collection 2024",
        imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80",
        linkUrl: "/men",
        linkText: "Shop Men's Collection",
        order: 1,
        isHero: true,
        isActive: true,
      },
      {
        title: "Redefining Feminine Elegance",
        subtitle: "Women's Collection",
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=80",
        linkUrl: "/women",
        linkText: "Shop Women's Collection",
        order: 2,
        isHero: true,
        isActive: true,
      },
      {
        title: "New Season Now Arriving",
        subtitle: "Summer 2024",
        imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80",
        linkUrl: "/new-arrivals",
        linkText: "View New Arrivals",
        order: 3,
        isHero: true,
        isActive: true,
      },
    ],
  });
  console.log("✅ Banners created");

  // Create coupons
  await prisma.coupon.createMany({
    data: [
      { code: "WELCOME20", description: "20% off for new customers", type: "percentage", value: 20, minOrderAmount: 5000, maxDiscount: 10000, usageLimit: 100, isActive: true },
      { code: "SUMMER15", description: "15% off summer collection", type: "percentage", value: 15, minOrderAmount: 3000, maxDiscount: 5000, usageLimit: 200, isActive: true },
      { code: "FREESHIP", description: "Free shipping on all orders", type: "fixed", value: 500, minOrderAmount: 5000, usageLimit: 500, isActive: true },
    ],
  });
  console.log("✅ Coupons created");

  // Create blog posts
  await prisma.blogPost.createMany({
    data: [
      {
        title: "The Ultimate Guide to Men's Formal Wear",
        slug: "ultimate-guide-mens-formal-wear",
        excerpt: "Everything you need to know about dressing sharp for formal occasions in 2024.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        author: "NEXTFITT Style Team",
        tags: ["men", "formal", "style-guide"],
        isPublished: true,
        publishedAt: new Date(),
        imageUrl: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=1200&q=80",
      },
      {
        title: "Summer Fashion Trends 2024: What's Hot",
        slug: "summer-fashion-trends-2024",
        excerpt: "Discover the hottest trends shaping summer fashion this year.",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        author: "NEXTFITT Style Team",
        tags: ["trends", "summer", "fashion"],
        isPublished: true,
        publishedAt: new Date(),
        imageUrl: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&q=80",
      },
    ],
  });
  console.log("✅ Blog posts created");

  console.log("\n🎉 Seeding complete!");
  console.log("📧 Admin: admin@nextfitt.com / admin123");
  console.log("📧 User: user@nextfitt.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
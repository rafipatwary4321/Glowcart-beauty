/**
 * Database seed script — populates MongoDB with GlowCart Beauty starter data.
 *
 * Usage:
 *   npm run seed
 *   npm run seed:fresh
 *
 * Requires MONGODB_URI in .env.local (loaded automatically).
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { env } from "@/config/env";
import { connectDB, DbConnectionError } from "@/lib/db";
import { ensureAdminSeedUser } from "@/lib/auth/user-service";
import {
  Banner,
  Brand,
  Category,
  Coupon,
  Order,
  Product,
  Review,
  User,
} from "@/models";
import { topBrands } from "@/data/brands";
import { featuredCategories } from "@/data/categories";
import { products } from "@/data/products";
import { featuredPromotion } from "@/data/promotions";
import { heroContent } from "@/data/hero";

const shouldFreshSeed = process.argv.includes("--fresh");

function logSuccess(message: string) {
  console.log(`[seed] OK  ${message}`);
}

function logInfo(message: string) {
  console.log(`[seed]     ${message}`);
}

function logError(message: string) {
  console.error(`[seed] FAIL ${message}`);
}

async function clearCollections() {
  await Promise.all([
    User.deleteMany({}),
    Category.deleteMany({}),
    Brand.deleteMany({}),
    Product.deleteMany({}),
    Order.deleteMany({}),
    Review.deleteMany({}),
    Coupon.deleteMany({}),
    Banner.deleteMany({}),
  ]);
}

async function seedUsers() {
  await ensureAdminSeedUser();

  const demoEmail = "demo@glowcart.com";
  const existingDemo = await User.findOne({ email: demoEmail });

  if (!existingDemo) {
    await User.create({
      name: "Ayesha Rahman",
      email: demoEmail,
      password: "demo1234",
      role: "customer",
    });
  }

  const users = await User.find({
    email: { $in: [demoEmail, env.adminEmail.toLowerCase()] },
  });

  logSuccess(`Seeded ${users.length} users (admin + demo customer).`);
  logInfo(`Admin login: ${env.adminEmail} / ${env.adminPassword}`);
  logInfo("Demo customer: demo@glowcart.com / demo1234");
  return users;
}

async function seedCategories() {
  const categories = await Category.insertMany(
    featuredCategories.map((category, index) => ({
      name: category.name,
      slug: category.slug,
      description: category.description,
      imageGradient: category.imageGradient,
      productCount: category.productCount,
      sortOrder: index,
    }))
  );

  logSuccess(`Seeded ${categories.length} categories.`);
  return categories;
}

async function seedBrands() {
  const brands = await Brand.insertMany(
    topBrands.map((brand, index) => ({
      name: brand.name,
      slug: brand.slug,
      tagline: brand.tagline,
      imageGradient: brand.imageGradient,
      productCount: brand.productCount,
      sortOrder: index,
    }))
  );

  logSuccess(`Seeded ${brands.length} brands.`);
  return brands;
}

async function seedProducts(
  categoryMap: Map<string, string>,
  brandMap: Map<string, string>
) {
  const productDocs = products.map((product) => {
    const categoryId = categoryMap.get(product.categorySlug);
    const brandId = brandMap.get(product.brandSlug);

    if (!categoryId || !brandId) {
      throw new Error(
        `Missing category or brand mapping for product "${product.slug}".`
      );
    }

    return {
      name: product.name,
      slug: product.slug,
      price: product.price,
      originalPrice: product.originalPrice,
      category: categoryId,
      brand: brandId,
      skinConcerns: product.skinConcerns,
      rating: product.rating,
      reviewCount: product.reviewCount,
      badge: product.badge,
      imageGradient: product.imageGradient,
      images: product.images,
      inStock: product.inStock,
      stockCount: product.stockCount,
      description: product.description,
      ingredients: product.ingredients,
      howToUse: product.howToUse,
      createdAt: new Date(product.createdAt),
    };
  });

  const inserted = await Product.insertMany(productDocs);
  logSuccess(`Seeded ${inserted.length} products.`);
  return inserted;
}

async function seedCoupons() {
  const coupons = await Coupon.insertMany([
    {
      code: "GLOW10",
      description: "10% off your first order",
      discountType: "percentage",
      discountValue: 10,
      minOrderAmount: 1500,
      maxDiscountAmount: 500,
      usageLimit: 1000,
    },
    {
      code: "FREESHIP",
      description: "Flat ৳120 delivery discount",
      discountType: "fixed",
      discountValue: 120,
      minOrderAmount: 1000,
    },
  ]);

  logSuccess(`Seeded ${coupons.length} coupons.`);
  return coupons;
}

async function seedBanners() {
  const banners = await Banner.insertMany([
    {
      title: heroContent.title,
      subtitle: heroContent.titleAccent,
      description: heroContent.description,
      type: "hero",
      badge: heroContent.badge,
      imageGradient: "from-rose-100 via-pink-50 to-beige-100",
      ctaLabel: heroContent.primaryCta.label,
      ctaHref: heroContent.primaryCta.href,
      sortOrder: 0,
    },
    {
      title: featuredPromotion.title,
      subtitle: featuredPromotion.eyebrow,
      description: featuredPromotion.description,
      type: "promo",
      imageGradient: "from-rose-200 via-pink-100 to-beige-100",
      ctaLabel: featuredPromotion.ctaLabel,
      ctaHref: featuredPromotion.ctaHref,
      sortOrder: 1,
    },
  ]);

  logSuccess(`Seeded ${banners.length} homepage banners.`);
  return banners;
}

async function seedSampleOrder(userId: string, productId: string) {
  const product = await Product.findById(productId);
  if (!product) return;

  await Order.create({
    orderNumber: "GC-10482",
    user: userId,
    customerName: "Ayesha Rahman",
    customerEmail: "demo@glowcart.com",
    customerPhone: "+880 1712 345678",
    items: [
      {
        product: product._id,
        name: product.name,
        slug: product.slug,
        quantity: 1,
        price: product.price,
        imageGradient: product.imageGradient,
      },
    ],
    subtotal: product.price,
    deliveryFee: 0,
    total: product.price,
    status: "delivered",
    deliveryMethod: "standard",
    paymentMethod: "cod",
    paymentStatus: "paid",
    trackingCode: "GC-TRK-10482",
    shippingAddress: {
      name: "Ayesha Rahman",
      phone: "+880 1712 345678",
      line1: "House 12, Road 5, Block C",
      line2: "Banani",
      city: "Dhaka",
      postalCode: "1213",
    },
  });

  logSuccess("Seeded 1 sample order.");
}

async function seedSampleReview(userId: string, productId: string) {
  await Review.create({
    product: productId,
    user: userId,
    authorName: "Ayesha Rahman",
    rating: 5,
    comment: "Absolutely love this product. My skin feels hydrated all day!",
    verified: true,
  });

  logSuccess("Seeded 1 sample review.");
}

async function main() {
  console.log("");
  console.log("[seed] GlowCart Beauty — database seed");
  console.log("[seed] --------------------------------");

  if (!process.env.MONGODB_URI?.trim()) {
    throw new DbConnectionError(
      "MONGODB_URI is not set. Add it to .env.local before seeding."
    );
  }

  await connectDB();
  logSuccess("Connected to MongoDB.");

  const existingProducts = await Product.countDocuments();

  if (existingProducts > 0 && !shouldFreshSeed) {
    logInfo("Database already contains data. Run `npm run seed:fresh` to reseed.");
    console.log("");
    process.exit(0);
  }

  if (shouldFreshSeed && existingProducts > 0) {
    logInfo("Clearing existing collections...");
    await clearCollections();
    logSuccess("Collections cleared.");
  }

  const users = await seedUsers();
  const categories = await seedCategories();
  const brands = await seedBrands();

  const categoryMap = new Map(categories.map((c) => [c.slug, c._id.toString()]));
  const brandMap = new Map(brands.map((b) => [b.slug, b._id.toString()]));

  const seededProducts = await seedProducts(categoryMap, brandMap);
  await seedCoupons();
  await seedBanners();

  const demoUser = users.find((user) => user.email === "demo@glowcart.com");
  const firstProduct = seededProducts[0];

  if (demoUser && firstProduct) {
    await seedSampleOrder(demoUser._id.toString(), firstProduct._id.toString());
    await seedSampleReview(demoUser._id.toString(), firstProduct._id.toString());
  }

  console.log("");
  console.log("[seed] --------------------------------");
  logSuccess("Seed completed successfully.");
  console.log("");
  process.exit(0);
}

main().catch((error) => {
  console.log("");
  console.log("[seed] --------------------------------");

  if (error instanceof DbConnectionError) {
    logError(error.message);
  } else if (error instanceof Error) {
    logError(error.message);
  } else {
    logError("An unexpected error occurred.");
  }

  console.log("");
  process.exit(1);
});

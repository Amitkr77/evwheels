import mongoose from "mongoose";
import dotenv from "dotenv";
import slugify from "slugify";
import path from "path";
import { fileURLToPath } from "url";
import XLSX from "xlsx";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import models
import Category from "../models/Category.js";
import Subcategory from "../models/Subcategory.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import InventoryLog from "../models/InventoryLog.js";

// ─── Read Excel catalogue ──────────────────────────────────
const EXCEL_PATH = "./uploads/d170eef5-853c-4f07-b02f-cc6866ae8ddf.xlsx";

function readCatalogue() {
  const wb = XLSX.readFile(EXCEL_PATH);
  const ws = wb.Sheets["Master Catalogue"];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

  const products = [];
  // Data starts at row index 3 (after title, empty, header rows)
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length < 7) continue;

    const sno = row[0];
    const name = row[1];
    const description = row[2];
    const categoryName = row[3];
    const subcategoryName = row[4];
    const moq = row[5];
    const boxQty = row[6];
    const rate = row[7];
    const priceRange = row[8];

    if (!name || !categoryName || !subcategoryName) continue;

    products.push({
      sno,
      name: String(name).trim(),
      description: String(description || "").trim(),
      categoryName: String(categoryName).trim(),
      subcategoryName: String(subcategoryName).trim(),
      moq: Number(moq) || 1,
      boxQty: Number(boxQty) || 1,
      rate: Number(rate) || 0,
      priceRange: String(priceRange || "").trim(),
    });
  }

  return products;
}

// ─── Build category → subcategory map ─────────────────────
function buildHierarchy(products) {
  const map = {};
  for (const p of products) {
    if (!map[p.categoryName]) map[p.categoryName] = new Set();
    map[p.categoryName].add(p.subcategoryName);
  }
  return map;
}

// ─── Main seed ─────────────────────────────────────────────
async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("❌ MONGODB_URI not set in .env");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  // ── Clean existing data ──
  console.log("\n🧹 Cleaning existing data...");
  await Product.deleteMany({});
  await Subcategory.deleteMany({});
  await Category.deleteMany({});
  await InventoryLog.deleteMany({});
  console.log("  ✅ Cleaned products, subcategories, categories, inventory logs");

  const products = readCatalogue();
  console.log(`📦 Read ${products.length} products from Excel`);

  const hierarchy = buildHierarchy(products);
  const categoryNames = Object.keys(hierarchy);

  // ── 1. Seed Categories ──
  console.log("\n📁 Seeding categories...");
  const categoryMap = {};

  for (let i = 0; i < categoryNames.length; i++) {
    const name = categoryNames[i];
    const slug = slugify(name, { lower: true, strict: true });

    const cat = await Category.findOneAndUpdate(
      { name },
      {
        $setOnInsert: {
          name,
          slug,
          sortOrder: i + 1,
          isActive: true,
          description: `${name} for bicycles and EVs`,
        },
      },
      { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
    );

    categoryMap[name] = cat._id;
    console.log(`  → ${name} (${cat._id})`);
  }

  // ── 2. Seed Subcategories ──
  console.log("\n📂 Seeding subcategories...");
  const subcategoryMap = {};

  for (const [catName, subs] of Object.entries(hierarchy)) {
    const categoryId = categoryMap[catName];
    let sortIdx = 1;

    for (const subName of subs) {
      const key = `${catName}::${subName}`;
      const slug = slugify(subName, { lower: true, strict: true });

      const sub = await Subcategory.findOneAndUpdate(
        { category: categoryId, name: subName },
        {
          $setOnInsert: {
            category: categoryId,
            name: subName,
            slug,
            sortOrder: sortIdx,
            isActive: true,
            description: `${subName} under ${catName}`,
          },
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );

      subcategoryMap[key] = sub._id;
      sortIdx++;
    }

    console.log(`  → ${catName}: ${subs.size} subcategories`);
  }

  // ── 3. Seed Products ──
  console.log("\n🛍️ Seeding products...");
  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const p of products) {
    const key = `${p.categoryName}::${p.subcategoryName}`;
    const categoryId = categoryMap[p.categoryName];
    const subcategoryId = subcategoryMap[key];

    if (!categoryId || !subcategoryId) {
      console.warn(`  ⚠ Skipping "${p.name}" — missing category/subcategory ref`);
      skipped++;
      continue;
    }

    // Generate SKU from serial number
    const sku = `SE-${String(p.sno).padStart(4, "0")}`;

    const existing = await Product.findOne({ sku });

    if (existing) {
      // Update existing product with any new fields
      await Product.findByIdAndUpdate(existing._id, {
        $set: {
          priceRange: p.priceRange || existing.priceRange,
          "inventory.moq": p.moq,
          "inventory.boxQty": p.boxQty,
        },
      });
      updated++;
      continue;
    }

    try {
      await Product.create({
        name: p.name,
        category: categoryId,
        subcategory: subcategoryId,
        shortDescription: p.description,
        description: `${p.name} — ${p.description}. High quality bicycle/EV component from Shri Enterprises.`,
        price: {
          base: p.rate,
          gstPercent: 18,
          currency: "INR",
          discount: { type: "none", value: 0 },
        },
        priceRange: p.priceRange,
        inventory: {
          stock: Math.floor(Math.random() * 200) + 10,
          moq: p.moq,
          boxQty: p.boxQty,
        },
        brand: "",
        tags: [p.subcategoryName, p.categoryName, p.priceRange].filter(Boolean),
        specs: {
          "Min Order Qty": String(p.moq),
          "Full Box Qty": String(p.boxQty),
          "Rate (INR)": String(p.rate),
          "Price Range": p.priceRange,
        },
        filterAttributes: [
          { name: "Category", value: p.categoryName },
          { name: "Subcategory", value: p.subcategoryName },
          ...(p.priceRange ? [{ name: "Price Range", value: p.priceRange }] : []),
        ],
        sku,
        isActive: true,
        isFeatured: false,
        isArchived: false,
      });
      created++;
    } catch (err) {
      console.warn(`  ⚠ Error creating "${p.name}": ${err.message}`);
      skipped++;
    }
  }

  console.log(`\n  ✅ Created: ${created}`);
  console.log(`  🔄 Updated: ${updated}`);
  console.log(`  ⚠ Skipped: ${skipped}`);

  // ── 4. Create admin user if not exists ──
  console.log("\n👤 Checking admin user...");
  const bcrypt = (await import("bcryptjs")).default;
  const existingAdmin = await User.findOne({ role: "admin" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 12);
    await User.create({
      name: "Admin",
      email: "admin@evwheels.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "admin",
    });
    console.log("  ✅ Admin user created (admin@evwheels.com / admin123)");
  } else {
    console.log("  ℹ Admin user already exists");
  }

  // ── 5. Summary ──
  const totalCategories = await Category.countDocuments();
  const totalSubcategories = await Subcategory.countDocuments();
  const totalProducts = await Product.countDocuments();

  console.log("\n" + "=".repeat(50));
  console.log("📊 DATABASE SUMMARY");
  console.log("=".repeat(50));
  console.log(`  Categories:    ${totalCategories}`);
  console.log(`  Subcategories: ${totalSubcategories}`);
  console.log(`  Products:      ${totalProducts}`);
  console.log(`  Admin Login:   admin@evwheels.com / admin123`);
  console.log("=".repeat(50));

  await mongoose.disconnect();
  console.log("\n✅ Seed complete. Disconnected from MongoDB.");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});

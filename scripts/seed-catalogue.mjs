/**
 * Seed Product Catalogue
 * ──────────────────────
 * Reads catalogue_products.json and upserts categories, subcategories,
 * and products into MongoDB. Safe to re-run — uses upsert throughout.
 *
 * Usage:
 *   node --env-file=.env scripts/seed-catalogue.mjs
 *
 * Or add to package.json scripts:
 *   "seed:catalogue": "node --env-file=.env scripts/seed-catalogue.mjs"
 */

import mongoose from "mongoose";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dir = dirname(fileURLToPath(import.meta.url));
const CATALOGUE_PATH = join(__dir, "catalogue_products.json");

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Connect ───────────────────────────────────────────────────────────────────

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("\n❌  MONGODB_URI is not set. Run with: node --env-file=.env scripts/seed-catalogue.mjs\n");
  process.exit(1);
}

await mongoose.connect(uri, { bufferCommands: false });
console.log("✓  Connected to MongoDB\n");

// ── Inline schemas ────────────────────────────────────────────────────────────

const CategorySchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true, unique: true },
    slug:      { type: String, unique: true, index: true },
    image:     { type: String, default: "" },
    description: { type: String, default: "" },
    isActive:  { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    specificationFields: [{ type: [String], default: [] }],
  },
  { timestamps: true }
);
CategorySchema.pre("validate", function () {
  if (!this.slug && this.name) this.slug = slugify(this.name);
});

const SubcategorySchema = new mongoose.Schema(
  {
    category:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, index: true },
    image:       { type: String, default: "" },
    description: { type: String, default: "" },
    isActive:    { type: Boolean, default: true, index: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);
SubcategorySchema.pre("validate", function () {
  if (!this.slug && this.name) this.slug = slugify(this.name);
});
SubcategorySchema.index({ category: 1, name: 1 }, { unique: true });

const ProductSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true, trim: true },
    slug:             { type: String, unique: true, lowercase: true, trim: true, index: true },
    description:      { type: String, required: true },
    shortDescription: { type: String, trim: true, default: "" },
    price:            { type: Number, required: true, min: 0 },
    images:           [{ type: String }],
    isActive:         { type: Boolean, default: true },
    featured:         { type: Boolean, default: false },
    stock:            { type: Number, required: true, min: 0 },
    brand:            { type: String, required: true, trim: true },
    category:         { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory:      { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    colors:           [{ type: String, trim: true }],
    warranty:         { type: Number, default: 0 },
    specifications:   { type: Array, default: [] },
  },
  { timestamps: true }
);

const Category    = mongoose.models.Category    || mongoose.model("Category",    CategorySchema);
const Subcategory = mongoose.models.Subcategory || mongoose.model("Subcategory", SubcategorySchema);
const Product     = mongoose.models.Product     || mongoose.model("Product",     ProductSchema);

// ── Load data ─────────────────────────────────────────────────────────────────

let catalogue;
try {
  catalogue = JSON.parse(readFileSync(CATALOGUE_PATH, "utf-8"));
} catch {
  console.error(`\n❌  Could not read catalogue file at: ${CATALOGUE_PATH}\n`);
  process.exit(1);
}

console.log(`📦  Loaded ${catalogue.length} products from catalogue\n`);

// ── Step 1: Upsert categories ─────────────────────────────────────────────────

const categoryNames = [...new Set(catalogue.map((p) => p.category))].sort();
console.log(`📂  Seeding ${categoryNames.length} categories…`);

const categoryMap = {}; // name → ObjectId

for (let i = 0; i < categoryNames.length; i++) {
  const name = categoryNames[i];
  const slug = slugify(name);
  const doc = await Category.findOneAndUpdate(
    { name },
    { $setOnInsert: { name, slug, isActive: true, sortOrder: i } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  categoryMap[name] = doc._id;
  console.log(`  ✓  ${name}`);
}

console.log();

// ── Step 2: Upsert subcategories ──────────────────────────────────────────────

const subcategoryKeys = [
  ...new Set(catalogue.map((p) => `${p.category}||${p.subcategory}`)),
].sort();

console.log(`📁  Seeding ${subcategoryKeys.length} subcategories…`);

const subcategoryMap = {}; // "category||subcategory" → ObjectId

for (const key of subcategoryKeys) {
  const [catName, subName] = key.split("||");
  const categoryId = categoryMap[catName];
  const slug = slugify(subName);
  const doc = await Subcategory.findOneAndUpdate(
    { category: categoryId, name: subName },
    { $setOnInsert: { category: categoryId, name: subName, slug, isActive: true, sortOrder: 0 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  subcategoryMap[key] = doc._id;
  console.log(`  ✓  ${catName} → ${subName}`);
}

console.log();

// ── Step 3: Upsert products ───────────────────────────────────────────────────

console.log(`🛒  Seeding ${catalogue.length} products…`);

let created = 0;
let updated = 0;

for (const item of catalogue) {
  const catKey = `${item.category}||${item.subcategory}`;
  const categoryId    = categoryMap[item.category];
  const subcategoryId = subcategoryMap[catKey];

  // Unique slug: name-sno (guarantees no collisions even for duplicate names)
  const productSlug = `${slugify(item.name)}-${item.sno}`;

  const productData = {
    title:            item.name,
    slug:             productSlug,
    description:      item.shortDescription || item.name,
    shortDescription: item.shortDescription || "",
    price:            item.price,
    brand:            "EVWheels",
    stock:            100,
    category:         categoryId,
    subcategory:      subcategoryId,
    isActive:         true,
    featured:         false,
    images:           [],
    colors:           [],
    warranty:         0,
    specifications:   [],
  };

  const result = await Product.updateOne(
    { slug: productSlug },
    { $set: productData },
    { upsert: true }
  );

  if (result.upsertedCount > 0) {
    created++;
  } else {
    updated++;
  }
}

console.log(`\n✅  Done!`);
console.log(`   Created : ${created} new products`);
console.log(`   Updated : ${updated} existing products`);
console.log(`   Total   : ${catalogue.length} products in catalogue\n`);

await mongoose.disconnect();
console.log("✓  Disconnected");

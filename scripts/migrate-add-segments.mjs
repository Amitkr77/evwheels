/**
 * Migrate: Add Segment hierarchy
 * ───────────────────────────────
 * Introduces the new top-level Segment model above Category, and backfills
 * `segment` on every existing Category/Subcategory/Product.
 *
 * Also drops the old globally-unique indexes on categories.name/slug and
 * replaces them with compound {segment,name}/{segment,slug} unique indexes,
 * since category name/slug uniqueness is now scoped per segment.
 *
 * Safe to re-run — every step is idempotent (upserts, skip-if-already-set
 * updates, try/catch around index drops).
 *
 * Usage:
 *   node --env-file=.env scripts/migrate-add-segments.mjs
 *
 * Or add to package.json scripts:
 *   "migrate:segments": "node --env-file=.env scripts/migrate-add-segments.mjs"
 */

import mongoose from "mongoose";

// ── Segment mapping knobs ────────────────────────────────────────────────────
// Adjust these to change how existing categories are grouped into segments.
// Any category name NOT in EV_CATEGORY_NAMES falls back to DEFAULT_SEGMENT_NAME.

const EV_SEGMENT_NAME = "Electric Vehicles";
const EV_CATEGORY_NAMES = [
  "Electric Cycles",
  "EV Batteries & Chargers",
  "EV Motors & Controllers",
  "EV Accessories",
];

const DEFAULT_SEGMENT_NAME = "Cycle Parts & Accessories";

// ── Helpers ──────────────────────────────────────────────────────────────────

function slugify(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ── Connect ──────────────────────────────────────────────────────────────────

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("\n❌  MONGODB_URI is not set. Run with: node --env-file=.env scripts/migrate-add-segments.mjs\n");
  process.exit(1);
}

await mongoose.connect(uri, { bufferCommands: false });
console.log("✓  Connected to MongoDB\n");

// ── Inline schemas (mirrors src/models/*.js, includes the new segment field) ─

const SegmentSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true, unique: true },
    slug:        { type: String, unique: true, index: true },
    image:       { type: String, default: "" },
    description: { type: String, default: "" },
    isActive:    { type: Boolean, default: true, index: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CategorySchema = new mongoose.Schema(
  {
    segment:     { type: mongoose.Schema.Types.ObjectId, ref: "Segment", index: true },
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, index: true },
    image:       { type: String, default: "" },
    description: { type: String, default: "" },
    isActive:    { type: Boolean, default: true, index: true },
    sortOrder:   { type: Number, default: 0 },
    specificationFields: [{ type: [String], default: [] }],
  },
  { timestamps: true }
);

const SubcategorySchema = new mongoose.Schema(
  {
    category:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    segment:     { type: mongoose.Schema.Types.ObjectId, ref: "Segment", index: true },
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, index: true },
    image:       { type: String, default: "" },
    description: { type: String, default: "" },
    isActive:    { type: Boolean, default: true, index: true },
    sortOrder:   { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true, lowercase: true, trim: true, index: true },
    category:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory" },
    segment:     { type: mongoose.Schema.Types.ObjectId, ref: "Segment", index: true },
  },
  { timestamps: true, strict: false }
);

const Segment     = mongoose.models.Segment     || mongoose.model("Segment",     SegmentSchema);
const Category    = mongoose.models.Category    || mongoose.model("Category",    CategorySchema);
const Subcategory = mongoose.models.Subcategory || mongoose.model("Subcategory", SubcategorySchema);
const Product     = mongoose.models.Product     || mongoose.model("Product",     ProductSchema);

// ── Step 1: Upsert segments ──────────────────────────────────────────────────

console.log("🧩  Upserting segments…");

const evSegment = await Segment.findOneAndUpdate(
  { name: EV_SEGMENT_NAME },
  { $setOnInsert: { name: EV_SEGMENT_NAME, slug: slugify(EV_SEGMENT_NAME), isActive: true, sortOrder: 1 } },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`  ✓  ${EV_SEGMENT_NAME}`);

const defaultSegment = await Segment.findOneAndUpdate(
  { name: DEFAULT_SEGMENT_NAME },
  { $setOnInsert: { name: DEFAULT_SEGMENT_NAME, slug: slugify(DEFAULT_SEGMENT_NAME), isActive: true, sortOrder: 0 } },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`  ✓  ${DEFAULT_SEGMENT_NAME}\n`);

// ── Step 2: Drop stale global-unique indexes on categories ──────────────────

console.log("🗑️   Checking categories indexes…");
const existingIndexes = await Category.collection.indexes();
console.log(`  Current indexes: ${existingIndexes.map((i) => i.name).join(", ")}`);

for (const indexName of ["name_1", "slug_1"]) {
  try {
    await Category.collection.dropIndex(indexName);
    console.log(`  ✓  Dropped stale index "${indexName}"`);
  } catch (err) {
    if (err.codeName === "IndexNotFound" || err.code === 27) {
      console.log(`  •  Index "${indexName}" already absent, skipping`);
    } else {
      throw err;
    }
  }
}
console.log();

// ── Step 3: Assign segment to each existing category ─────────────────────────

console.log("📂  Backfilling category.segment…");

const categories = await Category.find({}).lean();
let categoriesUpdated = 0;

const categorySegmentMap = {}; // categoryId (string) → segmentId

for (const cat of categories) {
  const targetSegmentId = EV_CATEGORY_NAMES.includes(cat.name)
    ? evSegment._id
    : defaultSegment._id;

  categorySegmentMap[String(cat._id)] = targetSegmentId;

  if (!cat.segment || String(cat.segment) !== String(targetSegmentId)) {
    await Category.updateOne({ _id: cat._id }, { $set: { segment: targetSegmentId } });
    categoriesUpdated++;
    console.log(`  ✓  ${cat.name} → ${String(targetSegmentId) === String(evSegment._id) ? EV_SEGMENT_NAME : DEFAULT_SEGMENT_NAME}`);
  }
}
console.log(`  ${categoriesUpdated} of ${categories.length} categories updated\n`);

// ── Step 4: Dry-run duplicate check before creating compound unique indexes ─

console.log("🔍  Checking for {segment,name}/{segment,slug} duplicates…");

const dupByName = await Category.aggregate([
  { $group: { _id: { segment: "$segment", name: "$name" }, count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } },
]);
const dupBySlug = await Category.aggregate([
  { $group: { _id: { segment: "$segment", slug: "$slug" }, count: { $sum: 1 } } },
  { $match: { count: { $gt: 1 } } },
]);

if (dupByName.length || dupBySlug.length) {
  console.error("\n❌  Duplicate {segment,name} or {segment,slug} pairs found — resolve before continuing:");
  console.error(JSON.stringify({ dupByName, dupBySlug }, null, 2));
  await mongoose.disconnect();
  process.exit(1);
}
console.log("  ✓  No duplicates found\n");

// ── Step 5: Create the new compound unique indexes ───────────────────────────

console.log("🔧  Creating compound unique indexes on categories…");
await Category.collection.createIndex({ segment: 1, name: 1 }, { unique: true });
await Category.collection.createIndex({ segment: 1, slug: 1 }, { unique: true });
console.log("  ✓  Created {segment,name} and {segment,slug} unique indexes\n");

// ── Step 6: Backfill subcategory.segment ─────────────────────────────────────

console.log("📁  Backfilling subcategory.segment…");

const subcategories = await Subcategory.find({}).lean();
const subcategoryOps = [];

for (const sub of subcategories) {
  const targetSegmentId = categorySegmentMap[String(sub.category)];
  if (!targetSegmentId) continue; // orphaned subcategory, shouldn't happen

  if (!sub.segment || String(sub.segment) !== String(targetSegmentId)) {
    subcategoryOps.push({
      updateOne: {
        filter: { _id: sub._id },
        update: { $set: { segment: targetSegmentId } },
      },
    });
  }
}

if (subcategoryOps.length) {
  await Subcategory.bulkWrite(subcategoryOps);
}
console.log(`  ${subcategoryOps.length} of ${subcategories.length} subcategories updated\n`);

// ── Step 7: Backfill product.segment ─────────────────────────────────────────

console.log("🛒  Backfilling product.segment…");

const products = await Product.find({}).select("_id category segment").lean();
const productOps = [];

for (const prod of products) {
  const targetSegmentId = categorySegmentMap[String(prod.category)];
  if (!targetSegmentId) continue; // orphaned product, shouldn't happen

  if (!prod.segment || String(prod.segment) !== String(targetSegmentId)) {
    productOps.push({
      updateOne: {
        filter: { _id: prod._id },
        update: { $set: { segment: targetSegmentId } },
      },
    });
  }
}

if (productOps.length) {
  await Product.bulkWrite(productOps);
}
console.log(`  ${productOps.length} of ${products.length} products updated\n`);

// ── Summary ───────────────────────────────────────────────────────────────────

console.log("✅  Migration complete!");
console.log(`   Segments   : 2 (${EV_SEGMENT_NAME}, ${DEFAULT_SEGMENT_NAME})`);
console.log(`   Categories : ${categoriesUpdated} updated / ${categories.length} total`);
console.log(`   Subcategories : ${subcategoryOps.length} updated / ${subcategories.length} total`);
console.log(`   Products   : ${productOps.length} updated / ${products.length} total\n`);

await mongoose.disconnect();
console.log("✓  Disconnected");

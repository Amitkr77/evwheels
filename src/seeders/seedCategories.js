import mongoose from "mongoose";
import Category from "../models/Category.js";
import Segment from "../models/Segment.js";
import dotenv from "dotenv";
import slugify from "slugify";

dotenv.config();

const EV_SEGMENT_NAME = "Electric Vehicles";
const DEFAULT_SEGMENT_NAME = "Cycle Parts & Accessories";

const CATEGORIES = [
  { name: 'Bells', sortOrder: 1 },
  { name: 'Bottle Holders & Bottles', sortOrder: 2 },
  { name: 'Brakes & Disc Systems', sortOrder: 3 },
  { name: 'Chains, Cranks & Chainwheels', sortOrder: 4 },
  { name: 'Clutch & Cables', sortOrder: 5 },
  { name: 'Forks & Suspension', sortOrder: 6 },
  { name: 'Freewheels & Cassettes', sortOrder: 7 },
  { name: 'Gear & Shifting', sortOrder: 8 },
  { name: 'Grips, Tape & Gloves', sortOrder: 9 },
  { name: 'Handlebars & Stems', sortOrder: 10 },
  { name: 'Helmets & Safety Gear', sortOrder: 11 },
  { name: 'Horns & Sirens', sortOrder: 12 },
  { name: 'Lights & Visibility', sortOrder: 13 },
  { name: 'Locks & Security', sortOrder: 14 },
  { name: 'Mobile Holders & Bags', sortOrder: 15 },
  { name: 'Other Accessories', sortOrder: 16 },
  { name: 'Pedals & Bottom Brackets', sortOrder: 17 },
  { name: 'Pumps & Inflators', sortOrder: 18 },
  { name: 'Seat Covers & Saddles', sortOrder: 19 },
  { name: 'Small Parts & Hardware', sortOrder: 20 },
  { name: 'Stands & Carriers', sortOrder: 21 },
  { name: 'Tools & Maintenance', sortOrder: 22 },
  { name: 'Wheels & Hubs', sortOrder: 23 },
  { name: 'Electric Cycles', sortOrder: 24, isActive: false, segmentName: EV_SEGMENT_NAME },
  { name: 'EV Batteries & Chargers', sortOrder: 25, isActive: false, segmentName: EV_SEGMENT_NAME },
  { name: 'EV Motors & Controllers', sortOrder: 26, isActive: false, segmentName: EV_SEGMENT_NAME },
  { name: 'EV Accessories', sortOrder: 27, isActive: false, segmentName: EV_SEGMENT_NAME },
];

async function seed() {
  const uri = process.env.MONGODB_URI;

  await mongoose.connect(uri);
  console.log("✅ Connected to MongoDB");

  const evSegment = await Segment.findOneAndUpdate(
    { name: EV_SEGMENT_NAME },
    { $setOnInsert: { name: EV_SEGMENT_NAME, slug: slugify(EV_SEGMENT_NAME, { lower: true, strict: true }), isActive: true, sortOrder: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  const defaultSegment = await Segment.findOneAndUpdate(
    { name: DEFAULT_SEGMENT_NAME },
    { $setOnInsert: { name: DEFAULT_SEGMENT_NAME, slug: slugify(DEFAULT_SEGMENT_NAME, { lower: true, strict: true }), isActive: true, sortOrder: 0 } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  for (const cat of CATEGORIES) {
    const { segmentName, ...catFields } = cat;
    const segment = segmentName === EV_SEGMENT_NAME ? evSegment._id : defaultSegment._id;

    const categoryData = {
      ...catFields,
      segment,
      slug: slugify(cat.name, {
        lower: true,
        strict: true,
      }),
    };

    await Category.findOneAndUpdate(
      { name: cat.name, segment },
      { $setOnInsert: categoryData },
      {
        upsert: true,
        returnDocument: "after",
        setDefaultsOnInsert: true,
      }
    );

    console.log(`→ ${cat.name}`);
  }

  const total = await Category.countDocuments();

  console.log(`\n✅ Categories in DB: ${total}`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
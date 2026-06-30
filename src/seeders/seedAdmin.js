import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

// ── Admin credentials ─────────────────────────────────────────────────────────
// Override any field via env vars (ADMIN_NAME, ADMIN_EMAIL, ADMIN_PHONE,
// ADMIN_PASSWORD) or edit the defaults below before running.
const ADMIN = {
  name:     process.env.ADMIN_SEED_NAME     || "Admin",
  email:    process.env.ADMIN_SEED_EMAIL    || "admin@evwheels.in",
  phone:    process.env.ADMIN_SEED_PHONE    || "9000000000",
  password: process.env.ADMIN_SEED_PASSWORD || "Admin@1234",
};
// ─────────────────────────────────────────────────────────────────────────────

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error(
      "\n❌  MONGODB_URI is not set.\n" +
      "    Run via:  npm run seed:admin\n" +
      "    Or:       node --env-file=.env src/seeders/seedAdmin.js\n"
    );
    process.exit(1);
  }

  await mongoose.connect(uri, { bufferCommands: false });
  console.log("✓  Connected to MongoDB\n");

  const existing = await User.findOne({ email: ADMIN.email }).select("+password");

  if (existing) {
    if (existing.role === "admin") {
      console.log("ℹ  Admin already exists — no changes made.");
      console.log(`   Name  : ${existing.name}`);
      console.log(`   Email : ${existing.email}`);
      console.log(`   Phone : ${existing.phone}`);
    } else {
      existing.role = "admin";
      existing.isEmailVerified = true;
      await existing.save();
      console.log("✓  Existing user promoted to admin.");
      console.log(`   Email : ${existing.email}`);
    }
  } else {
    const admin = new User({
      ...ADMIN,
      role: "admin",
      isEmailVerified: true,
    });
    await admin.save();

    console.log("✓  Admin created successfully!\n");
    console.log(`   Name     : ${admin.name}`);
    console.log(`   Email    : ${admin.email}`);
    console.log(`   Phone    : ${admin.phone}`);
    console.log(`   Password : ${ADMIN.password}  ← change after first login`);
    console.log(`   Role     : admin`);
  }

  const adminCount = await User.countDocuments({ role: "admin" });
  console.log(`\n   Total admins in DB: ${adminCount}`);

  console.log();
  await mongoose.disconnect();
  console.log("✓  Done");
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});

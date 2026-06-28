/**
 * Seed Admin User
 * ───────────────
 * Creates an admin account (or promotes an existing user to admin).
 *
 * Usage:
 *   npm run seed:admin
 *
 * Or directly:
 *   node --env-file=.env scripts/seed-admin.mjs
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ── Admin credentials — edit before first run ───────────────────────────────
const ADMIN = {
  name: "Admin",
  email: "admin@evwheels.in",
  phone: "9000000000",
  password: "Admin@1234",
};
// ────────────────────────────────────────────────────────────────────────────

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error(
    "\n❌  MONGODB_URI is not set.\n" +
    "    Run via npm script:  npm run seed:admin\n" +
    "    Or directly:         node --env-file=.env scripts/seed-admin.mjs\n"
  );
  process.exit(1);
}

// ── Connect ──────────────────────────────────────────────────────────────────
await mongoose.connect(uri, { bufferCommands: false });
console.log("✓  Connected to MongoDB\n");

// ── Inline schema (avoids Next.js module-resolution issues in bare Node) ─────
const UserSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true, trim: true },
    email:           { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone:           { type: String, required: true, unique: true, trim: true },
    password:        { type: String, required: true, minlength: 6, select: false },
    role:            { type: String, enum: ["user", "admin"], default: "user" },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin:       { type: Date, default: null },
    avatar:          { type: String, default: "" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

// ── Seed ──────────────────────────────────────────────────────────────────────
const existing = await User.findOne({ email: ADMIN.email });

if (existing) {
  if (existing.role === "admin") {
    console.log(`ℹ  Admin already exists — no changes made.`);
    console.log(`   Name  : ${existing.name}`);
    console.log(`   Email : ${existing.email}`);
    console.log(`   Phone : ${existing.phone}`);
  } else {
    existing.role = "admin";
    existing.isEmailVerified = true;
    await existing.save();
    console.log(`✓  Promoted existing user to admin.`);
    console.log(`   Email : ${existing.email}`);
  }
} else {
  const admin = new User({
    ...ADMIN,
    role: "admin",
    isEmailVerified: true,
  });
  await admin.save();

  console.log(`✓  Admin created successfully!\n`);
  console.log(`   Name     : ${admin.name}`);
  console.log(`   Email    : ${admin.email}`);
  console.log(`   Phone    : ${admin.phone}`);
  console.log(`   Password : ${ADMIN.password}  ← change this after first login`);
  console.log(`   Role     : admin`);
}

console.log();
await mongoose.disconnect();
console.log("✓  Done");

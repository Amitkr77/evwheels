import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"],
    },

    phone: {
      type: String,
      required: [true, "Phone is required"],
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false, // Don't return password by default
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    // ─── Email Verification ───
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String,
      select: false,
    },
    emailVerificationExpires: {
      type: Date,
      select: false,
    },

    // ─── Password Reset ───
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },

    // ─── Activity Tracking ───
    lastCartActivity: {
      type: Date,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },

    // ─── Optional Profile Fields ───
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// ─────────────────────────────────────────────
// Indexes (besides the unique ones above)
// ─────────────────────────────────────────────
userSchema.index({ role: 1 });

// ─────────────────────────────────────────────
// Method: Hash password before save (if modified)
// ─────────────────────────────────────────────
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────
// Method: Compare candidate password with stored hash
// ─────────────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  // Need to fetch password explicitly since it's `select: false`
  const user = await this.constructor.findById(this._id).select("+password");
  return await bcrypt.compare(candidatePassword, user.password);
};

// ─────────────────────────────────────────────
// Method: Generate email verification token
// ─────────────────────────────────────────────
userSchema.methods.generateEmailVerificationToken = function () {
  // Raw token (sent to user via email, hashed in DB)
  const rawToken = crypto.randomBytes(32).toString("hex");

  // Store HASHED version in DB (security best practice)
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  // Token valid for 24 hours
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;

  return rawToken; // return raw token (NOT the hashed one)
};

// ─────────────────────────────────────────────
// Method: Generate password reset token
// ─────────────────────────────────────────────
userSchema.methods.generatePasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return rawToken;
};

// ─────────────────────────────────────────────
// Method: Check if email verification token is valid
// ─────────────────────────────────────────────
userSchema.methods.isEmailVerificationTokenValid = function (rawToken) {
  if (!this.emailVerificationToken || !this.emailVerificationExpires) {
    return false;
  }
  if (Date.now() > this.emailVerificationExpires) {
    return false;
  }
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");
  return hashedToken === this.emailVerificationToken;
};

// ─────────────────────────────────────────────
// Method: Get safe user object (strip sensitive fields)
// ─────────────────────────────────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject({ virtuals: true });
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", userSchema);
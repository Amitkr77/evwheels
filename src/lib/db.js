import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,          // Up to 10 concurrent MongoDB connections per server
        minPoolSize: 2,           // Keep 2 connections warm at all times
        serverSelectionTimeoutMS: 5000,  // Fail fast if Atlas is unreachable
        socketTimeoutMS: 45000,   // Close idle sockets after 45s
      })
      .then((m) => m)
      .catch((err) => {
        // A rejected connect() must not stay cached — otherwise every request on
        // this server instance fails forever after a single transient hiccup.
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}


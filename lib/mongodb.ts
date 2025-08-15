import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/todo-app';

// Don't throw error during build time
if (!MONGODB_URI && process.env.NODE_ENV !== 'production') {
  console.warn('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached: any = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<typeof mongoose | null> {
  // Return early if no MongoDB URI is provided (e.g., during build)
  if (!MONGODB_URI) {
    console.warn('MONGODB_URI not provided, skipping database connection');
    return null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.error('Failed to connect to MongoDB:', e);
    throw e;
  }

  return cached.conn;
}

export default dbConnect;

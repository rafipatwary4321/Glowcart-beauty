import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

export class DbConnectionError extends Error {
  cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "DbConnectionError";
    this.cause = cause;
  }
}

function formatConnectionError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "MongoDB connection failed with an unknown error.";
  }

  const message = error.message.toLowerCase();

  if (message.includes("econnrefused") || message.includes("connect econnrefused")) {
    return "Could not connect to MongoDB. Check that MongoDB is running and MONGODB_URI is correct.";
  }

  if (message.includes("authentication failed") || message.includes("bad auth")) {
    return "MongoDB authentication failed. Verify database username and password in MONGODB_URI.";
  }

  if (message.includes("timed out") || message.includes("server selection")) {
    return "MongoDB connection timed out. Check network access and cluster IP allowlist.";
  }

  return `MongoDB connection failed: ${error.message}`;
}

export function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();

  if (!uri) {
    throw new DbConnectionError(
      "MONGODB_URI is not set. Add it to .env.local before connecting to the database."
    );
  }

  return uri;
}

export function isDbConnected(): boolean {
  return cached.conn?.connection.readyState === 1;
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = getMongoUri();

  if (cached.conn && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.conn && cached.conn.connection.readyState !== 1) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10_000,
        maxPoolSize: 10,
      })
      .then((instance) => {
        if (process.env.NODE_ENV === "development") {
          console.log("[db] MongoDB connected");
        }
        return instance;
      })
      .catch((error) => {
        cached.promise = null;
        throw new DbConnectionError(formatConnectionError(error), error);
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
}

export function isValidObjectId(value: string): boolean {
  return mongoose.Types.ObjectId.isValid(value);
}

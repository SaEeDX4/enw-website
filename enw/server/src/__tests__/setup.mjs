import { jest } from "@jest/globals"; // ⬅️ add this line
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server"; // ⬅️ replset for sessions/transactions

let replset;

// Give async DB tests more time
jest.setTimeout(20000);

// Ensure test env
process.env.NODE_ENV = process.env.NODE_ENV || "test";

global.beforeAll(async () => {
  // Start in-memory Mongo as a single-node replica set (needed for startSession/transactions)
  replset = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });
  const uri = replset.getUri();

  // Make URI visible to app code if it reads from env
  process.env.MONGODB_URI = uri;

  // Connect and ensure connection is fully ready
  await mongoose.connect(uri, { dbName: "test" });
  await mongoose.connection.asPromise();
});

global.afterEach(async () => {
  if (mongoose.connection.readyState !== 1) return;
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    try {
      await c.deleteMany({});
    } catch {}
  }
});

global.afterAll(async () => {
  try {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.dropDatabase().catch(() => {});
      await mongoose.connection.close().catch(() => {});
    }
  } finally {
    if (replset) {
      await replset.stop();
      replset = null;
    }
  }
});

// Keep logs quiet during tests
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(), // comment this out if you want to see real errors while debugging
};

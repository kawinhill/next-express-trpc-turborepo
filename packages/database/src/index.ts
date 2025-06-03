import { PrismaClient } from "@prisma/client";
import * as path from "path";

// Load environment variables from root .env file
try {
  require("dotenv").config({
    path: path.join(__dirname, "..", "..", "..", ".env"),
  });
} catch (error) {
  console.warn("dotenv not available, using process.env directly");
}

// Set default DATABASE_URL for development if not provided
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL not found, using default PostgreSQL connection");
  throw new Error("DATABASE_URL not found");
}

class DatabaseClient {
  private static instance: DatabaseClient;
  private prisma: PrismaClient;
  private initialized = false;

  private constructor() {
    this.prisma = new PrismaClient({
      log: ["error", "warn"],
    });
  }

  public static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.prisma.$connect();
      this.initialized = true;
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Failed to connect to database:", error);
      throw error;
    }
  }

  public getClient(): PrismaClient {
    return this.prisma;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export const db = DatabaseClient.getInstance();
export { PrismaClient } from "@prisma/client";

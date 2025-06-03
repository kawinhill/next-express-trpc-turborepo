const { execSync } = require("child_process");
const path = require("path");

// Load environment variables from root .env file
require("dotenv").config({
  path: path.join(__dirname, "..", "..", "..", ".env"),
});

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Found" : "Not found");
console.log("Starting Prisma Studio...");

try {
  execSync("npx prisma studio", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
    env: process.env,
  });
} catch (error) {
  console.error("Failed to start Prisma Studio:", error.message);
  process.exit(1);
}

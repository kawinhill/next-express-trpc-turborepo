const { execSync } = require("child_process");
const path = require("path");

// Load environment variables from root .env file
require("dotenv").config({
  path: path.join(__dirname, "..", "..", "..", ".env"),
});

console.log("DATABASE_URL:", process.env.DATABASE_URL ? "Found" : "Not found");

try {
  execSync("npx prisma generate", {
    stdio: "inherit",
    cwd: path.join(__dirname, ".."),
    env: process.env,
  });
} catch (error) {
  console.error("Failed to generate Prisma client:", error.message);
  process.exit(1);
}

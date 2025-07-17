import "dotenv/config";

import app from "./app";
import { config } from "./config";

console.log("🔧 Server Configuration:");
console.log(`   NODE_ENV: ${config.NODE_ENV}`);
console.log(`   HOST: ${config.HOST}`);
console.log(`   PORT: ${config.PORT}`);
console.log(`   CORS_ORIGIN: ${config.CORS_ORIGIN}`);
console.log(`   CORS_CREDENTIALS: ${config.CORS_CREDENTIALS}`);
console.log(`   API_VERSION: ${config.API_VERSION}`);
console.log("");

const server = app.listen(config.PORT, config.HOST, () => {
  console.log(`🚀 Server running on http://${config.HOST}:${config.PORT}`);
  console.log(
    `📡 API available at http://${config.HOST}:${config.PORT}${config.API_PREFIX}/${config.API_VERSION}`,
  );
  console.log(
    `🔗 tRPC available at http://${config.HOST}:${config.PORT}/${config.API_VERSION}/trpc`,
  );
  console.log(`💚 Health check at http://${config.HOST}:${config.PORT}/health`);
  console.log("");
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  server.close(() => {
    console.log("Process terminated");
  });
});

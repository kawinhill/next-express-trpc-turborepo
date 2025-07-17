import { createExpressMiddleware } from "@trpc/server/adapters/express";

import { appRouter } from "../trpc";

// Create tRPC Express middleware
export const trpcHandler = createExpressMiddleware({
  createContext: () => ({}), // Empty context for now
  router: appRouter,
});

import { initTRPC } from "@trpc/server";
import { z } from "zod";
import { VisitorService } from "../services/visitor.service";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const appRouter = router({
  hello: publicProcedure
    .input(z.object({ name: z.string().optional() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.name ?? "World"} from tRPC!`,
        timestamp: new Date().toISOString(),
      };
    }),

  testError: publicProcedure
    .input(z.object({ errorType: z.string().optional() }))
    .query(({ input }) => {
      const errorType = input.errorType || "GENERIC_ERROR";

      // Throw different types of errors for testing
      switch (errorType) {
        case "VALIDATION_ERROR":
          throw new Error("VALIDATION_ERROR");
        case "NETWORK_ERROR":
          throw new Error("NETWORK_ERROR");
        case "SERVER_ERROR":
          throw new Error("SERVER_ERROR");
        case "NOT_FOUND":
          throw new Error("NOT_FOUND");
        case "UNAUTHORIZED":
          throw new Error("UNAUTHORIZED");
        case "FORBIDDEN":
          throw new Error("FORBIDDEN");
        case "TOO_MANY_REQUESTS":
          throw new Error("TOO_MANY_REQUESTS");
        case "INTERNAL":
          throw new Error("INTERNAL");
        default:
          throw new Error("GENERIC_ERROR");
      }
    }),

  getVisitorCount: publicProcedure.query(async () => {
    try {
      const count = await VisitorService.getVisitorCount();
      return { count };
    } catch (error) {
      console.error("Failed to get visitor count:", error);
      throw new Error("Failed to get visitor count");
    }
  }),

  incrementVisitorCount: publicProcedure.mutation(async () => {
    try {
      const count = await VisitorService.incrementVisitorCount();
      return { count };
    } catch (error) {
      console.error("Failed to increment visitor count:", error);
      throw new Error("Failed to increment visitor count");
    }
  }),
});

export type AppRouter = typeof appRouter;

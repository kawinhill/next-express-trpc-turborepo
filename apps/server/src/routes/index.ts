import { Router } from "express";

import testRouter from "./test";
import { trpcHandler } from "./trpc";

const router = Router();

router.get("/", function (_req, res) {
  res.send("Express API is running");
});

router.use("/test", testRouter);
router.use("/trpc", trpcHandler);

export default router;

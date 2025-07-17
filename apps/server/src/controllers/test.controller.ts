import { type GetTestResponse } from "@monorepo/types";
import { type Request, type Response } from "express";

export const TestController = {
  /**
   * Health check for test service
   * @route GET /test/health
   */
  async getHealth(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      message: "Test service is healthy",
      success: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  },

  /**
   * Get test message
   * @route GET /test
   */
  async getTest(req: Request, res: Response): Promise<void> {
    const testData: GetTestResponse = {
      message: "Hello from Express API!",
    };

    res.status(200).json({
      data: testData,
      success: true,
      timestamp: new Date().toISOString(),
    });
  },
};

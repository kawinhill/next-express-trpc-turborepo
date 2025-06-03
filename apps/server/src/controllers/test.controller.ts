import { Request, Response } from "express";
import { type GetTestResponse } from "@monorepo/types";

export class TestController {
  /**
   * Get test message
   * @route GET /test
   */
  static async getTest(req: Request, res: Response): Promise<void> {
    const testData: GetTestResponse = {
      message: "Hello from Express API!",
    };

    res.status(200).json({
      success: true,
      data: testData,
      timestamp: new Date().toISOString(),
    });
  }

  /**
   * Health check for test service
   * @route GET /test/health
   */
  static async getHealth(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Test service is healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}

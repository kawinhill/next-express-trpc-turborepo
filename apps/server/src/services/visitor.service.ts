import { db } from "@monorepo/database";

export class VisitorService {
  public static async getVisitorCount(): Promise<number> {
    await db.initialize();
    const prisma = db.getClient();
    return await prisma.visitor.count();
  }

  public static async incrementVisitorCount(): Promise<number> {
    await db.initialize();
    const prisma = db.getClient();

    await prisma.visitor.create({
      data: {},
    });

    return await prisma.visitor.count();
  }

  public static async reset(): Promise<void> {
    await db.initialize();
    const prisma = db.getClient();
    await prisma.visitor.deleteMany({});
    console.log("Visitor data reset successfully");
  }
}

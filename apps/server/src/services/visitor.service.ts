import { db } from "@monorepo/database";

export const VisitorService = {
  async getVisitorCount(): Promise<number> {
    await db.initialize();
    const prisma = db.getClient();
    return await prisma.visitor.count();
  },

  async incrementVisitorCount(): Promise<number> {
    await db.initialize();
    const prisma = db.getClient();

    await prisma.visitor.create({
      data: {},
    });

    return await prisma.visitor.count();
  },

  async reset(): Promise<void> {
    await db.initialize();
    const prisma = db.getClient();
    await prisma.visitor.deleteMany({});
    console.log("Visitor data reset successfully");
  },
};

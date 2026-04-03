import { PrismaClient, Prisma } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const categoryData: Prisma.CategoryCreateInput[] = [
  {
    name: "Mat & hushåll",
    type: "EXPENSE",
  },
  {
    name: "Hyra",
    type: "EXPENSE",
  },
  {
    name: "Sparande",
    type: "SAVING",
  },
  {
    name: "Lön",
    type: "INCOME",
  },
  {
    name: "CSN",
    type: "INCOME",
  },
];

async function main() {
  await prisma.category.createMany({
    data: categoryData,
    skipDuplicates: true,
  });
}

main();

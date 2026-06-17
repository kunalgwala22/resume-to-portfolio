import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const resumes = await prisma.resume.findMany({
    orderBy: { createdAt: 'desc' },
  });

  console.log(`Total Resumes found: ${resumes.length}`);
  resumes.forEach((r, idx) => {
    console.log(`\n--- Resume #${idx + 1} ---`);
    console.log(`ID: ${r.id}`);
    console.log(`Filename: ${r.originalName}`);
    console.log(`Status: ${r.parseStatus}`);
    console.log(`CreatedAt: ${r.createdAt}`);
  });
}

check()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
